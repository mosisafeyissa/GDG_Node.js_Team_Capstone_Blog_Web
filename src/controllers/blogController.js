//path to this file is src/controllers/blogController.js
const asyncHandler =require("express-async-handler");
const blog = require("../models/BlogPost")
//desc get all blogs
//route GET /api/blogs
//access Public

const getBlogs = asyncHandler(async (req ,res)=>{
  const blogs = await blog.find();
    res.status(200).json(blogs)
  });

//desc get  single blog
//route GET /api/blogs/:id
//access Public

const getBlog = asyncHandler(async(req ,res)=>{
  const blogs = await blog.findById(req.params.id)
  
  if(!blogs){
    res.status(404);
    throw new Error("blog not found!")
  }

    res.status(200).json(blogs)
  });
//desc create  blogs
//route POST /api/blogs/
//access Public
const createBlog = asyncHandler(async (req,res)=>{

  // req.user from authMiddleware
    console.log("the request body is: ", req.body)
    const {title, content, category} = req.body;
    if(!title|| !content  ){
        res.status(400);
        throw new Error("all fields must be filled")
    }
    const blogs = await blog.create({
      title,
      content,
      category,
      author: req.userId,
    });
    res.status(201).json(blogs);
  });

//desc update blog
//route PUT /api/blogs/:id
//access Public
const updateBlog = asyncHandler(async (req,res)=>{
    const userId = req.userId
    const blogId = req.params.id
  const blogs = await blog.findById(blogId)
  if(!blogs){
    res.status(404);
    throw new Error("blog not found!")
  }
  if(blog.author != userId){
   return res.status(400).json({message:"unauthorized - invalid blog Id"})
  }
  const updatedBlog = await blog.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new: true}
  )
    res.status(200).json(updatedBlog);
  });

//desc delete blog
//route DELETE /api/blogs
//access Public

const deleteBlog = asyncHandler(async (req,res)=>{
  try {
    const userId = req.userId
    const blogId = req.params.id
    if(blog.author != userId){
      return res.status(400).json({message:"unauthorized - invalid blog Id"})
    }
  
    await blog.findByIdAndDelete(blogId)
    res.status(200).json({message : "blog deleted"})
  } catch (error) {
    console.log("error in delete post controller" , error.message)
    res.status(500).json({message:"Internal server error"})
  }
  });
  module.exports = {
    getBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog
  }
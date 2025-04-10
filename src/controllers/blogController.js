//path to this file is src/controllers/blogController.js
const asyncHandler =require("express-async-handler");
const Blog = require("../models/BlogPost")
//desc get all blogs
//route GET /api/blogs
//access Public

const getBlogs = asyncHandler(async (req ,res)=>{
  const blogs = await Blog.find();
    res.status(200).json(blogs)
  });

//desc get  single blog
//route GET /api/blogs/:id
//access Public

const getBlog = asyncHandler(async(req ,res)=>{
  const blogs = await Blog.findById(req.params.id)
  
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
    const blogs = await Blog.create({
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
const updateBlog = asyncHandler(async (req, res) => {
  const userId = req.userId; // Set by your `protect` middleware
  const blogId = req.params.id;

  // 1. Find the blog post
  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new CustomError("Blog not found", 404);
  }

  // 2. Check if the logged-in user is the author
  if (blog.author.toString() !== userId) {
    return res
      .status(403)
      .json({ message: "Unauthorized: Not your blog post" });
  }

  // 3. Update the blog fields only if they're sent in the request
  blog.title = req.body.title || blog.title;
  blog.content = req.body.content || blog.content;
  blog.category = req.body.category || blog.category;

  const updatedBlog = await blog.save();

  // 4. Return updated blog
  res.status(200).json(updatedBlog);
});

//desc delete blog
//route DELETE /api/blogs
//access Public

const deleteBlog = asyncHandler(async (req,res)=>{
  try {
    const userId = req.userId
    const blogId = req.params.id

    const blog = await Blog.findById(blogId);
    if (!blog) {
       return res.status(404).json({ message: "Blog not found" });
    }

     // 2. Check if the current user is the author
    if (blog.author.toString() !== userId) {
       return res.status(403).json({ message: "Unauthorized - not your blog" });
    }

     // 3. Delete the blog post
     await blog.deleteOne();

     // 4. Respond to client
     res.status(200).json({ message: "Blog deleted successfully" });
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
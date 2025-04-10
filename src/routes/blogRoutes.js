//path to this file is src/routes/blogRoutes.js
const express = require("express");
const router = express.Router();
const {
    getBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog
  } = require("../controllers/blogController");

const {
  validateBlogPost,
  handleValidationErrors,
} = require("../middleware/validationMiddleware");

  const { protect, verifyToken } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(getBlogs)
  .post(
    protect,
    validateBlogPost,
    verifyToken,
    handleValidationErrors,
    createBlog
  );

router
  .route("/:id")
  .get(getBlog)
  .put(protect, validateBlogPost, handleValidationErrors, updateBlog)
  .delete(protect, verifyToken, deleteBlog);

// router.route("/").get( protect, getBlogs)
// router.route("/:id").get(protect, getBlog)
// router.route("/").post(protect, createBlog)
// router.route("/:id").put(protect, updateBlog)
// router.route("/:id").delete(protect, deleteBlog)

module.exports = router;


// const {
//   validateBlogPost,
//   handleValidationErrors,
// } = require("../middleware/validationMiddleware");

// router
//   .route("/")
//   .get(protect, getBlogs)
//   .post(protect, validateBlogPost, handleValidationErrors, createBlog);

// router
//   .route("/:id")
//   .get(protect, getBlog)
//   .put(protect, validateBlogPost, handleValidationErrors, updateBlog)
//   .delete(protect, deleteBlog);

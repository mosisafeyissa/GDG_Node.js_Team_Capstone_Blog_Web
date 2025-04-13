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

module.exports = router;
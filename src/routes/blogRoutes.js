const express = require("express");
const router = express.Router();
const {
    getBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog
  } = require("../controllers/blogController");
  const protect = require("../middleware/authMiddleware")

router.route("/").get( protect, getBlogs)
router.route("/:id").get(protect, getBlog)
router.route("/").post(protect, createBlog)
router.route("/:id").put(protect, updateBlog)
router.route("/:id").delete(protect, deleteBlog)

module.exports = router;
// path to this file is src/middleware/validationMiddleware.js
const { body, validationResult } = require('express-validator');

// Validate user registration/login inputs
const validateUser = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
    body('username')
  .notEmpty().withMessage('Username is required')
  .trim(),
];

// Validate blog post creation/update inputs
const validateBlogPost = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('category').optional().trim(),
];

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateUser,
  validateBlogPost,
  handleValidationErrors,
};
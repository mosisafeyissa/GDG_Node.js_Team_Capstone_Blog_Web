// path to this file is src/middleware/errorMiddleware.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging

  // Default error structure
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

module.exports = errorHandler;
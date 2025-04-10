// path to this file is src/middleware/errorMiddleware.js
const errorHandler = (err, req, res, next) => {
  // Log the error details for debugging
  console.error(
    "[ERROR] - Status:",
    err.statusCode || 500,
    "Message:",
    err.message
  );

  // If there are validation errors or custom errors with an 'errors' field, log those too
  if (err.errors) {
    console.error("[ERROR] Validation Errors:", err.errors);
  }

  // Default error structure
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

module.exports = errorHandler;

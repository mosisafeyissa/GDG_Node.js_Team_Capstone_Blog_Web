// path to this file is src/middleware/errorMiddleware.js
const errorHandler = (err, req, res, next) => {
  console.error(
    "[ERROR] - Status:",
    err.statusCode || 500,
    "Message:",
    err.message
  );

  if (err.errors) {
    console.error("[ERROR] Validation Errors:", err.errors);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

module.exports = errorHandler;

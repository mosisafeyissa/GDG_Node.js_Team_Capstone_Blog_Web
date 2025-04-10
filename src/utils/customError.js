// path to this file is src/utils/customError.js
class CustomError extends Error {
  constructor(message, statusCode, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors; // Optional, for validation errors
  }
}

module.exports = CustomError;

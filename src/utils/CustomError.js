// path to this file is src/utils/customError.js
class CustomError extends Error {
  constructor(message, statusCode, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors; 
  }
}

module.exports = CustomError;

//path to this file is src/routes/userRoutes.js
const jwt = require('jsonwebtoken');

// Generate a JWT token for user authentication
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = generateToken;
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // 1. Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided. Access denied.' });
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Attach user ID to the request
    next(); // Proceed to the next middleware/route
  } catch (err) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = protect;
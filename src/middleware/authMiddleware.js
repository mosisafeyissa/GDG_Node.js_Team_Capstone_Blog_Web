// path to this file is src/middleware/authMiddleware.js
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

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  let token;
  if (authHeader) {
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      token = authHeader;
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // add decoded user data to request object
    next(); // move to next middleware or controller
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};


module.exports = {protect, verifyToken};
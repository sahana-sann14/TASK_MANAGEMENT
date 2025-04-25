// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protectAdmin = (req, res, next) => {
  // Get token from request header (Authorization)
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, 'supersecretkey'); // Replace 'supersecretkey' with your actual JWT secret

    // Check if the user is an admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as an admin' });
    }

    // Add the decoded user data to the request object
    req.user = decoded;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // should have role
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid Token" });
  }
};


// Protect route for authentication
const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1] || req.header('x-auth-token');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Decode and verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
    
    // Attach user to the request object
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user?.role === "Admin") {
    next();
  } else {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
};

module.exports = { authMiddleware, protectAdmin, isAdmin, verifyToken };

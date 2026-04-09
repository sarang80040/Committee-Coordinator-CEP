const jwt = require('jsonwebtoken');
const User = require('../models/User');

// This "protect" function is the same as before
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token' });
};

// --- THIS IS THE NEW "SECURITY GUARD" ---
// We will run this *after* "protect"
const isTeacher = (req, res, next) => {
  if (req.user && req.user.role === 'teacher') {
    next(); // They are a teacher, let them pass
  } else {
    res.status(401).json({ message: 'Not authorized as a teacher' });
  }
};

module.exports = { protect, isTeacher }; // Export both
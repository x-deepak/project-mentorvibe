
// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Mentor = require('../models/Mentor');

module.exports = async (req, res, next) => {
  try {
    // Get token from header or cookie
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    
    // Check if no token
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists in User collection
    let user = await User.findById(decoded.id).select('-password');
    let isMentor = false;
    
    // If not found in User collection, check Mentor collection
    if (!user) {
      user = await Mentor.findById(decoded.id).select('-password');
      if (user) isMentor = true;
    }
    
    // User not found in either collection
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    
    // Add user and role to request
    req.user = user;
    req.isMentor = isMentor;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
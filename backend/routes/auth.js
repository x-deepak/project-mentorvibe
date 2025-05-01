// routes/auth.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const Mentor = require('../models/Mentor');
const auth = require('../middleware/auth');


// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// Register a user or mentor
router.post('/register', async (req, res) => {

  const { email, password, name, role, ...additionalFields } = req.body;
  
  try {
    // Check if user exists in either collection
    let existingUser = await User.findOne({ email });
    if (!existingUser) {
      existingUser = await Mentor.findOne({ email });
    }
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    let user;
    
    // Create user based on role
    if (role === 'mentor') {
      // Validate mentor-specific fields      
      user = new Mentor({
        email,
        password,
        name,
      });
    } else {
      // Create regular user
      user = new User({
        email,
        password,
        name,
      });
    }
    
    await user.save();
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Send token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    
    // Return user info and token
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    
    res.status(201).json({
      token,
      user: userResponse,
      isMentor: role === 'mentor'
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ message: info.message });
    }
    
    // Generate token
    const token = generateToken(user);
    
    // Send token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    
    // Remove password from response
    delete user.password;
    
    // Return user data and token
    res.json({
      token,
      user,
      isMentor: user.isMentor
    });
    
  })(req, res, next);
});

// Google OAuth routes
router.get('/google', (req, res, next) => {
  // Get the role from query parameter
  const role = req.query.role || 'user';
  
  // Store role in session for use after Google auth
  req.session = req.session || {};
  req.session.role = role;
  
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res, next);
});

// Google OAuth callback
router.get('/google/callback', passport.authenticate('google', { session: false }), async (req, res) => {
  try {
    console.log('Google callback received user:', req.user);
    console.log('Desired role from session:', req.session?.role);

    // Check if user already exists and has the right role
    const user = req.user;
    const desiredRole = req.session?.role || 'user';
    
    // If user was found in the wrong collection based on desired role
    if ((desiredRole === 'mentor' && !user.isMentor) || 
        (desiredRole === 'user' && user.isMentor)) {
      
      // User wants to be mentor but is in user collection
      if (desiredRole === 'mentor' && !user.isMentor) {
        // Create new mentor from user data
        const newMentor = new Mentor({
          email: user.email,
          name: user.name,
          googleId: user.googleId,
        });
        
        await newMentor.save();
        
        // Delete from User collection if it exists only by Google login
        if (!user.password) {
          await User.findByIdAndDelete(user._id);
        }
        
        // Generate token for new mentor
        const token = generateToken(newMentor);
        
        // Send token in cookie
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 24 * 60 * 60 * 1000
        });
        
        // Redirect with token
        return res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}&role=mentor`);
      }
      
      // User wants to be regular user but is in mentor collection
      if (desiredRole === 'user' && user.isMentor) {
        // Create new user from mentor data
        const newUser = new User({
          email: user.email,
          name: user.name,
          googleId: user.googleId
        });
        
        await newUser.save();
        
        // Delete from Mentor collection if it exists only by Google login
        if (!user.password) {
          await Mentor.findByIdAndDelete(user._id);
        }
        
        // Generate token for new user
        const token = generateToken(newUser);
        
        // Send token in cookie
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 24 * 60 * 60 * 1000
        });
        
        // Redirect with token
        return res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}&role=user`);
      }
    }
    
    // Generate token for existing user
    const token = generateToken(user);
    
    // Send token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    });
    
    // Redirect to frontend with token and role
    res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}&role=${user.isMentor ? 'mentor' : 'user'}`);
    
  } catch (err) {
    console.error('Google callback error:', err);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
  }
});

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    // User data is already added to request by auth middleware
    const user = req.user;
    
    // Return user profile
    res.json({
      user,
      isMentor: req.isMentor
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout route
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
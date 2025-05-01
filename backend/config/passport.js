// config/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const Mentor = require('../models/Mentor');

// Local Strategy - checks both User and Mentor collections
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      // Check if email exists in User collection
      let user = await User.findOne({ email });
      let isMentor = false;
      
      // If not found in User collection, check Mentor collection
      if (!user) {
        user = await Mentor.findOne({ email });
        if (user) isMentor = true;
      }
      
      // User not found in either collection
      if (!user) {
        return done(null, false, { message: 'User not found' });
      }

      // User found but no password (Google login user)
      if (!user.password) {
        return done(null, false, { message: 'Please sign in with Google' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      // Add a field to indicate if it's a mentor or regular user
      user = user.toObject();
      user.isMentor = isMentor;

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let user, isMentor = false;
    
    // Check if user already exists in User collection
    user = await User.findOne({ googleId: profile.id });
    
    // If not found by googleId, check by email in User collection
    if (!user) {
      user = await User.findOne({ email });
    }
    
    // Check Mentor collection if not found in User collection
    if (!user) {
      user = await Mentor.findOne({ googleId: profile.id });
      if (user) isMentor = true;
    }
    
    // If not found by googleId, check by email in Mentor collection
    if (!user) {
      user = await Mentor.findOne({ email });
      if (user) isMentor = true;
    }
    
    // If user exists, link Google account
    if (user) {
      if (!user.googleId) {
        user.googleId = profile.id;
        await user.save();
      }
    } else {
      // User doesn't exist, create a new user
      // For Google login, we default to User (role selection happens in frontend)
      user = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: email
      });
      await user.save();
    }
    
    // Add isMentor flag to user object
    user = user.toObject();
    user.isMentor = isMentor;
    
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

module.exports = passport;

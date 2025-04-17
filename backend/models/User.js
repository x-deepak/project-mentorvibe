const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String},
    googleId: { type: String },
    profileImage: {
      type: String,
      default: 'https://example.com/default-avatar.png', //  default image URL
    },
    favoriteMentors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mentor", // Reference to the Mentor model
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


// Password hashing middleware
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Password verification method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};



const User = mongoose.model("User", UserSchema, "user");
module.exports = User;

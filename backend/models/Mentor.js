const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const MentorSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        googleId: { type: String },
        isVerified: {
            type: Boolean,
            default: false,
        },
        professionalTitle: { type: String }, // Example: "Software Engineer"
        profileTitle: { type: String, default: "Courses taken- All boards including US,AUSTRALIAN,SINGAPORE (Maths & Physics), IIT Foundation courses."}, // Example: "Courses taken- All boards including US,AUSTRALIAN,SINGAPORE (Maths & Physics), IIT Foundation courses."
        phone: { type: String }, // Example: "+1234567890"
        profilePicture: { type: String }, // URL to the profile picture
        skills: [{ type: String }], // Example: ["JavaScript", "Python"]
        teachingMode: {
            type: String,
            enum: ["Online", "Offline", "Hybrid"], // Restricts values to these options
            default: "Online", // Default value
        },
        bio: { type: String },
        fee: { type: Number, default: 500 },
        classDetails: { type: String },
        ratings: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, rating: Number, review: String }],
        averageRating: { type: Number, default: 0 },
        studentCount: { type: Number, default: 0 },
        city: { type: String },
        location: {
            type: { type: String, enum: ["Point"], default: "Point" },
            coordinates: { type: [Number] }, // [longitude, latitude]
        },
    },
    { timestamps: true }
);

// Password hashing middleware
MentorSchema.pre('save', async function(next) {
    if (!this.isModified('password') || !this.password) return next();
    
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  });

// Location validation middleware
MentorSchema.pre('save', function(next) {
  // If coordinates are missing, remove the entire location field
  if (this.location && (!this.location.coordinates || this.location.coordinates.length !== 2)) {
    this.location = undefined;
  }
  next();
});
  
// Password verification method
MentorSchema.methods.comparePassword = async function(candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
  };

  
// Calculate average rating dynamically
MentorSchema.methods.calculateAverageRating = function () {
    if (this.ratings.length === 0) return 0;
    const sum = this.ratings.reduce((acc, rating) => acc + rating.rating, 0);
    this.averageRating = sum / this.ratings.length;
    return this.averageRating;
};

MentorSchema.index({ location: "2dsphere" });
MentorSchema.index(
    { name: "text", bio: "text", skills: "text", classDetails: "text" },
    { weights: { skills: 5, classDetails: 4 , bio: 3, name: 2, city: 1 } }
  );

const Mentor = mongoose.model("Mentor", MentorSchema, "mentor");
module.exports = Mentor;

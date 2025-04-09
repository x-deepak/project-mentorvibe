const mongoose = require("mongoose");

const MentorSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        skills: [{ type: String, required: true }], // Example: ["JavaScript", "Python"]
        teachingMode: {
            type: String,
            enum: ["Online", "Offline", "Hybrid"], // Restricts values to these options
            required: true
        },
        bio: { type: String },
        fee: { type: Number, required: true },
        classDetails: { type: String },
        ratings: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, rating: Number, review: String }],
        averageRating: { type: Number, default: 0 },
        city: { type: String },
        location: {
            type: { type: String, enum: ["Point"], default: "Point" },
            coordinates: { type: [Number] }, // [longitude, latitude]
        },
    },
    { timestamps: true }
);

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

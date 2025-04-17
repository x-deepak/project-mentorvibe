const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const getUserDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Extract user ID from the authenticated user

  try {
    // Fetch user details
    const user = await User.findById(userId).populate("favoriteMentors", "name profilePicture skills");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User dashboard data fetched successfully",
      user: {
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        favoriteMentors: user.favoriteMentors,
      },
    });
  } catch (error) {
    console.error("Error fetching user dashboard data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const getFavorites = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Extract user ID from the authenticated user

  try {
    // Fetch the user's favorite mentors
    const user = await User.findById(userId).populate(
      "favoriteMentors",
      "name profilePicture professionalTitle"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Map the favorite mentors to include only the required fields
    const favoriteMentors = user.favoriteMentors.map((mentor) => ({
      id: mentor._id,
      profilePicture: mentor.profilePicture,
      name: mentor.name,
      professionalTitle: mentor.professionalTitle,
    }));

    res.status(200).json({
      message: "Favorite mentors fetched successfully",
      favoriteMentors,
    });
  } catch (error) {
    console.error("Error fetching favorite mentors:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = { getUserDashboard, getFavorites };
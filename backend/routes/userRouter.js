const { Router } = require("express");

const {
  getUserDashboard,
  getFavorites,
  createConversation,
  getConversationStatus,
  getUserConversations,
  getMessages,
  createMessage,
  getMentorConversations,
  acceptConversation,
  rejectConversation,
  getMentorMessages,
  createMentorMessage
} = require("../controllers/userController");

const userRouter = Router();

// Protected route for user dashboard
userRouter.get("/dashboard",  getUserDashboard);

userRouter.get("/favorites", getFavorites);

// Create a new conversation with a mentor
userRouter.post("/conversations", createConversation);

// Check if conversation exists and return its active status
userRouter.get("/conversations/status", getConversationStatus);

// Get all conversations for the logged-in user to display in the dashboard or messages page
userRouter.get("/conversations", getUserConversations);


// Get all messages for a conversation
userRouter.get("/messages", getMessages);

// Create a new message in a conversation
userRouter.post("/messages", createMessage);


userRouter.get("/mentor/conversations", getMentorConversations);
userRouter.post("/mentor/conversations/accept", acceptConversation);
userRouter.post("/mentor/conversations/reject", rejectConversation);
userRouter.get("/mentor/messages", getMentorMessages);
userRouter.post("/mentor/messages", createMentorMessage);

// Remove a mentor from user's favorites
userRouter.post("/favorites/delete", async (req, res) => {
  try {
    const userId = req.user._id;
    const { mentorId } = req.body;

    if (!mentorId) {
      return res.status(400).json({ message: "mentorId is required in body" });
    }

    const user = await require("../models/User").findByIdAndUpdate(
      userId,
      { $pull: { favoriteMentors: mentorId } },
      { new: true }
    ).populate("favoriteMentors", "name profilePicture professionalTitle");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Mentor removed from favorites",
      favoriteMentors: user.favoriteMentors,
    });
  } catch (error) {
    console.error("Error removing favorite mentor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add a mentor to user's favorites
userRouter.post("/favorites/add", async (req, res) => {
  try {
    const userId = req.user._id;
    const { mentorId } = req.body;

    if (!mentorId) {
      return res.status(400).json({ message: "mentorId is required in body" });
    }

    const user = await require("../models/User").findByIdAndUpdate(
      userId,
      { $addToSet: { favoriteMentors: mentorId } }, // prevents duplicates
      { new: true }
    ).populate("favoriteMentors", "name profilePicture professionalTitle");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Mentor added to favorites",
      favoriteMentors: user.favoriteMentors,
    });
  } catch (error) {
    console.error("Error adding favorite mentor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = userRouter;

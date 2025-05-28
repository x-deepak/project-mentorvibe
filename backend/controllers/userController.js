const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Mentor = require("../models/Mentor");
const { Conversation, Message } = require("../models/Message");


Conversation.syncIndexes().then(() => {
  console.log("Indexes synced for Conversation collection");
});

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

// POST /user/conversations - Create a new conversation
const createConversation = asyncHandler(async (req, res) => {
  const user = req.user;
  const mentorId = req.body.mentorId; // Changed from req.query.mentorId

  if (!mentorId) {
    return res.status(400).json({ message: "mentorId is required in request body" });
  }

  // Check if mentor exists
  const mentor = await Mentor.findById(mentorId);
  if (!mentor) {
    return res.status(404).json({ message: "Mentor not found" });
  }

  // Check if conversation already exists
  let conversation = await Conversation.findOne({
    "participants.id": { $all: [user._id, mentor._id] },
    "participants.role": { $all: ["User", "Mentor"] }
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [
        { id: user._id, role: "User" },
        { id: mentor._id, role: "Mentor" }
      ]
    });
  }

  console.log("Conversation created or found:", conversation);

  res.status(201).json({ conversation });
});

// GET /users/conversations/status - Check if conversation exists and its status
const getConversationStatus = asyncHandler(async (req, res) => {
  const user = req.user;
  const mentorId = req.query.mentorId;

  if (!mentorId) {
    return res.status(400).json({ message: "mentorId is required in query" });
  }

  // Check if mentor exists
  const mentor = await Mentor.findById(mentorId);
  if (!mentor) {
    return res.status(404).json({ message: "Mentor not found" });
  }

  // Find conversation
  const conversation = await Conversation.findOne({
    "participants.id": { $all: [user._id, mentor._id] },
    "participants.role": { $all: ["User", "Mentor"] }
  });

  if (!conversation) {
    return res.json({ exists: false, isActive: false });
  }

  res.json({ exists: true, isActive: conversation.isActive });
});

const getUserConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find all conversations where the user is a participant
  const conversations = await Conversation.find({
    "participants.id": userId,
    "participants.role": "User"
  })
    .sort({ updatedAt: -1 }) // Most recent first
    .lean();

  // For each conversation, get the mentor's info
  const mentorIds = conversations.map(conv => {
    const mentor = conv.participants.find(p => p.role === "Mentor");
    return mentor ? mentor.id : null;
  }).filter(Boolean);

  // Get mentor details in one query
  const mentors = await Mentor.find({ _id: { $in: mentorIds } })
    .select("name professionalTitle profilePicture")
    .lean();

  // Map mentorId to mentor details for quick lookup
  const mentorMap = {};
  mentors.forEach(m => {
    mentorMap[m._id.toString()] = m;
  });

  // Get all lastMessage IDs
  const lastMessageIds = conversations
    .map(conv => conv.lastMessage)
    .filter(Boolean);

  // Fetch all lastMessages in one query
  const lastMessages = await Message.find({ _id: { $in: lastMessageIds } })
    .select("content createdAt")
    .lean();

  // Map lastMessageId to message details
  const lastMessageMap = {};
  lastMessages.forEach(msg => {
    lastMessageMap[msg._id.toString()] = msg;
  });

  // Attach mentor info and last message to each conversation
  const result = conversations.map(conv => {
    const mentor = conv.participants.find(p => p.role === "Mentor");
    const mentorInfo = mentor ? mentorMap[mentor.id.toString()] : null;
    const lastMsg = conv.lastMessage ? lastMessageMap[conv.lastMessage.toString()] : null;
    return {
      conversationId: conv._id,
      isActive: conv.isActive,
      updatedAt: conv.updatedAt,
      mentor: mentorInfo
        ? {
            id: mentorInfo._id,
            name: mentorInfo.name,
            professionalTitle: mentorInfo.professionalTitle,
            profilePicture: mentorInfo.profilePicture,
          }
        : null,
      lastMessage: lastMsg
        ? {
            content: lastMsg.content,
            createdAt: lastMsg.createdAt,
          }
        : null,
    };
  });

  res.json({ conversations: result });
});

// GET /users/messages?conversationId=...
const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.query;
  if (!conversationId) {
    return res.status(400).json({ message: "conversationId is required in query" });
  }

  const messages = await Message.find({ conversation: conversationId })
    .sort({ createdAt: 1 })
    .lean();

  res.json({ messages });
});

// POST /users/messages
const createMessage = asyncHandler(async (req, res) => {
  const user = req.user;
  const { conversationId, content, mentorId } = req.body;

  if (!conversationId || !content || !mentorId) {
    return res.status(400).json({ message: "conversationId, content, and mentorId are required in body" });
  }

  // Optionally, check if conversation exists and user is a participant
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    return res.status(404).json({ message: "Conversation not found" });
  }

  // Create the message
  const message = await Message.create({
    content,
    sender: { id: user._id, role: "User" },
    recipient: { id: mentorId, role: "Mentor" },
    conversation: conversationId
  });

  // Update the conversation's lastMessage field
  conversation.lastMessage = message._id;
  await conversation.save();

  res.status(201).json({ message });
});

const getMentorConversations = asyncHandler(async (req, res) => {
  const mentorId = req.user._id;

  // Find all conversations where the mentor is a participant
  const conversations = await Conversation.find({
    "participants.id": mentorId,
    "participants.role": "Mentor"
  })
    .sort({ updatedAt: -1 })
    .lean();

  // Get all userIds from these conversations
  const userIds = conversations.map(conv => {
    const user = conv.participants.find(p => p.role === "User");
    return user ? user.id : null;
  }).filter(Boolean);

  // Fetch user details in one query
  const users = await User.find({ _id: { $in: userIds } })
    .select("name profileImage")
    .lean();

  // Map userId to user details
  const userMap = {};
  users.forEach(u => {
    userMap[u._id.toString()] = u;
  });

  // Get all lastMessage IDs
  const lastMessageIds = conversations
    .map(conv => conv.lastMessage)
    .filter(Boolean);

  // Fetch all lastMessages in one query
  const lastMessages = await Message.find({ _id: { $in: lastMessageIds } })
    .select("content createdAt")
    .lean();

  // Map lastMessageId to message details
  const lastMessageMap = {};
  lastMessages.forEach(msg => {
    lastMessageMap[msg._id.toString()] = msg;
  });

  // Build response
  const result = conversations.map(conv => {
    const user = conv.participants.find(p => p.role === "User");
    const userInfo = user ? userMap[user.id.toString()] : null;
    const lastMsg = conv.lastMessage ? lastMessageMap[conv.lastMessage.toString()] : null;
    return {
      conversationId: conv._id,
      isPending: conv.isPending,
      isActive: conv.isActive,
      updatedAt: conv.updatedAt,
      user: userInfo
        ? {
            id: userInfo._id,
            name: userInfo.name,
            profileImage: userInfo.profileImage,
          }
        : null,
      lastMessage: lastMsg
        ? {
            content: lastMsg.content,
            createdAt: lastMsg.createdAt,
          }
        : null,
    };
  });

  res.json({ conversations: result });
});

const acceptConversation = asyncHandler(async (req, res) => {
  const { conversationId } = req.body;
  if (!conversationId) {
    return res.status(400).json({ message: "conversationId is required in body" });
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    return res.status(404).json({ message: "Conversation not found" });
  }

  conversation.isPending = false;
  conversation.isActive = true;
  await conversation.save();

  res.json({ message: "Conversation accepted", conversation });
});

const rejectConversation = asyncHandler(async (req, res) => {
  const { conversationId } = req.body;
  if (!conversationId) {
    return res.status(400).json({ message: "conversationId is required in body" });
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    return res.status(404).json({ message: "Conversation not found" });
  }

  conversation.isPending = false;
  conversation.isActive = false;
  await conversation.save();

  res.json({ message: "Conversation rejected", conversation });
});

// GET /mentor/messages?conversationId=...
const getMentorMessages = asyncHandler(async (req, res) => {
  const mentorId = req.user._id;
  const { conversationId } = req.query;
  if (!conversationId) {
    return res.status(400).json({ message: "conversationId is required in query" });
  }

  // Optionally, check if mentor is a participant in the conversation
  const conversation = await Conversation.findOne({
    _id: conversationId,
    "participants.id": mentorId,
    "participants.role": "Mentor"
  });
  if (!conversation) {
    return res.status(403).json({ message: "Not authorized for this conversation" });
  }

  const messages = await Message.find({ conversation: conversationId })
    .sort({ createdAt: 1 })
    .lean();

  res.json({ messages });
});

// POST /mentor/messages
const createMentorMessage = asyncHandler(async (req, res) => {
  const mentor = req.user;
  const { conversationId, content, userId } = req.body;

  if (!conversationId || !content || !userId) {
    return res.status(400).json({ message: "conversationId, content, and userId are required in body" });
  }

  // Optionally, check if mentor is a participant in the conversation
  const conversation = await Conversation.findOne({
    _id: conversationId,
    "participants.id": mentor._id,
    "participants.role": "Mentor"
  });
  if (!conversation) {
    return res.status(403).json({ message: "Not authorized for this conversation" });
  }

  // Create the message
  const message = await Message.create({
    content,
    sender: { id: mentor._id, role: "Mentor" },
    recipient: { id: userId, role: "User" },
    conversation: conversationId
  });

  // Update the conversation's lastMessage field
  conversation.lastMessage = message._id;
  await conversation.save();

  res.status(201).json({ message });
});

module.exports = {
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
};
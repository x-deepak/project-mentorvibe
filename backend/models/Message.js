const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  // Content of the message
  content: {
    type: String,
    required: true,
    trim: true
  },
  
  // Message sender information
  sender: {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'sender.role'
    },
    role: {
      type: String,
      required: true,
      enum: ['User', 'Mentor']
    }
  },
  
  // Message recipient information
  recipient: {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'recipient.role'
    },
    role: {
      type: String,
      required: true,
      enum: ['User', 'Mentor']
    }
  },
  
  // Conversation this message belongs to
  conversation: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  
  // Message status flags
  status: {
    read: {
      type: Boolean,
      default: false
    },
    delivered: {
      type: Boolean,
      default: false
    }
  },
  
  // File attachments (optional)
  attachments: [{
    fileName: String,
    fileType: String,
    fileSize: Number,
    fileUrl: String
  }],
  
  // Whether message has been deleted
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt
});

// Indexes for common queries
MessageSchema.index({ conversation: 1, createdAt: -1 });
MessageSchema.index({ 'sender.id': 1, 'recipient.id': 1 });
MessageSchema.index({ 'sender.role': 1, 'recipient.role': 1 });

const ConversationSchema = new Schema({
  participants: [{
    id: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'participants.role'
    },
    role: {
      type: String,
      required: true,
      enum: ['User', 'Mentor']
    }
  }],
  
  lastMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Message'
  },
  
  // Optional metadata
  title: String,

  isActive: {
    type: Boolean,
    default: false
  },
  
  isPending: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure unique conversation between participants
ConversationSchema.index(
  { 'participants.id': 1, 'participants.role': 1 },
  { unique: false }
);

const Message = mongoose.model('Message', MessageSchema, "message");
const Conversation = mongoose.model('Conversation', ConversationSchema, "conversation");

module.exports = { Message, Conversation };
import mongoose from 'mongoose';

// Conversation Schema
const conversationSchema = new mongoose.Schema({
  threadId: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  title: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Message Schema
const messageSchema = new mongoose.Schema({
  threadId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create models
const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);
const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

export { Conversation, Message };

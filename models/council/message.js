import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  commenterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // For 1-on-1 chat
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" }, // For group chat
  content: { type: String, required: true },
  isGroupMessage: { type: Boolean, default: false },
  upvotes: { type: Number, default: 0 }, // Number of upvotes
  downvotes: { type: Number, default: 0 }, // Number of downvotes
  comments: [commentSchema], // Array of comments
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;

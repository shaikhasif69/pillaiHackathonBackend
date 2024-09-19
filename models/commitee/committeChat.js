import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   username: {
//     type: String,
//     required: true,
//   },
//   profileImage: {
//     type: String,
//     required: true,
//   },
//   message: {
//     type: String,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const chatSchema = new mongoose.Schema({
//   communityId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Community",
//     required: true,
//   },
//   tag: {
//     type: String,
//     required: true, // This represents the #tag for discussions
//   },
//   messages: [messageSchema], // Store messages in the chat
// });

// const Chat = mongoose.model("Chat", chatSchema);
// export default Chat;
const messageSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  imageUrl: {
    type: String,
    default: "",
  },

  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model("Messages", messageSchema);

export default Message;

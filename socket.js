import { Server } from "socket.io";
import User from "./models/user.js";
import Message from "./models/commitee/committeChat.js";

export const socketHandler = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // Replace with your frontend's URL
      methods: ["GET", "POST"], // Specify the HTTP methods allowed
      credentials: true, // Allow credentials like cookies
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    // Join a room by roomID
    socket.on("joinRoom", async ({ roomId, userId }) => {
      console.log("joinRoom event received"); // Log when the event is received

      const user = await User.findById(userId); // Get user info (e.g., username)
      if (!user) return socket.emit("error", "User not found");
      console.log(user.imageUrl);
      socket.join(roomId);
      console.log(`${user.username} joined room: ${roomId}`);

      // Fetch previous messages for the room
      const previousMessages = await Message.find({ roomId }).sort({
        createdAt: 1,
      });
      socket.emit("previousMessages", previousMessages);
      // Notify other users in the room
      socket.to(roomId).emit("userJoined", `${user.username} joined the room`);
    });
    socket.on("1v1chat", async ({ userId, targetUserId }) => {
      console.log("1v1chat event received");

      const user = await User.findById(userId);
      const targetUser = await User.findById(targetUserId);

      if (!user || !targetUser) return socket.emit("error", "User not found");

      // Generate a unique room ID for the 1v1 chat
      const roomId = [userId, targetUserId].sort().join("_");

      socket.join(roomId);
      console.log(`${user.username} joined room: ${roomId}`);

      // Fetch previous messages for the 1v1 chat
      const previousMessages = await Message.find({ roomId }).sort({
        createdAt: 1,
      });
      socket.emit("previousMessages", previousMessages);

      // Notify the other user in the room
      socket.to(roomId).emit("userJoined", `${user.username} joined the room`);
    });

    // Single listener for all messages (group or 1v1)
    socket.on(
      "message",
      async ({ roomId, userId, content, discussion = true }) => {
        const user = await User.findById(userId);
        if (!user) return socket.emit("error", "User not found");

        const newMessage = new Message({
          roomId,
          userId,
          username: user.username,
          imageUrl: user.imageUrl,
          content,
          discussion, // False for private messages, true for group discussions
          createdAt: new Date(),
        });

        await newMessage.save(); // Save the message to the database
        console.log(newMessage);

        // Broadcast the message to the room
        io.to(roomId).emit("message", newMessage);
      }
    );

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

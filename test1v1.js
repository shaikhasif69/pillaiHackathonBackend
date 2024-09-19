import { io } from "socket.io-client";

// Connect to your backend (replace with your actual backend URL)
const socket = io("http://localhost:3000");

// Simulate 1v1 chat event after connecting
socket.on("connect", () => {
  console.log("Connected to server!");

  // Emit the '1v1chat' event to simulate 1v1 chat join
  socket.emit("1v1chat", {
    userId: "66e6926336455070e72e4bcb",
    targetUserId: "66eaad6c1b2db44d4aa2bc2d",
  });

  // Listen for previous messages
  socket.on("previousMessages", (messages) => {
    console.log("Previous Messages:", messages);
  });
  socket.emit("message", {
    roomId: ["66e6926336455070e72e4bcb", "66eaad6c1b2db44d4aa2bc2d"]
      .sort()
      .join("_"), // Room ID based on the two users
    userId: "66e6926336455070e72e4bcb", // Your user ID
    content: "Hello! This is a test message.", // Message content
    discussion: false, // Set this to false for 1v1 messages
  });
});

// Listen for new messages in the room
socket.on("message", (newMessage) => {
  console.log("New message received:", newMessage);
}); // Listen for user joined event
socket.on("userJoined", (message) => {
  console.log(message);
});

// Listen for any errors
socket.on("error", (errMsg) => {
  console.log("Error:", errMsg);
});

// Handle disconnection
socket.on("disconnect", () => {
  console.log("Disconnected from server!");
});

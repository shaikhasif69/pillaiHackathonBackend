import { io } from "socket.io-client";
import mongoose from "mongoose";
import Message from "./models/commitee/committeChat.js";

// MongoDB connection (this assumes you already have your MongoDB running)
mongoose
  .connect(
    "mongodb+srv://theshaikhasif03:fPQSb56RBLe2lG84@cluster1.o65jh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 100000,
    }
  )
  .then(() => console.log("Test MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Simulate the client
const socket = io("http://localhost:3000"); // Assuming your server runs on port 5000

// Join a room
socket.emit("joinRoom", {
  roomId: "room1",
  userId: "66e6926336455070e72e4bcb",
}); // Replace with valid userId

// Listen for previous messages
socket.on("previousMessages", (messages) => {
  console.log("Previous messages in room:", messages);
});

// Send a message to the room
socket.emit("message", {
  roomId: "room1",
  userId: "",
  content: "Hello from sai!",
});

// Listen for new messages in real-time
socket.on("message", (newMessage) => {
  console.log("New message:", newMessage);
  checkDatabase(newMessage); // Verify message is saved in the DB
});

// Verify that the message is saved in the database
async function checkDatabase(newMessage) {
  try {
    const message = await Message.findById(newMessage._id); // Find the saved message by its ID
    if (message) {
      console.log("Message found in database:", message);
    } else {
      console.log("Message not found in the database");
    }
  } catch (error) {
    console.error("Error checking database:", error);
  } finally {
    socket.disconnect(); // Close the connection after the test
    mongoose.connection.close(); // Close the MongoDB connection
  }
}

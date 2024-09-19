import { io } from "socket.io-client";

// Replace with the actual backend server URL

const userId = "66e698656ffd530f47532f6f"; // Provide the userId here
const groupId = "66ec6bdcc5d98d852110ac6e"; // Provide a valid groupId
const content = "This is a new one.";

// Simulate connection

const simulateSocketEvents = async () => {
  const clientSocket = io("http://localhost:3000");

  // Simulate joining a group
  clientSocket.emit("joinstudentGroup", {
    groupId: "66ec6bdcc5d98d852110ac6e",
    userId: "66e6926336455070e72e4bcb",
  });

  // Simulate sending a message
  clientSocket.emit("sendMessage", {
    groupId: "66ec6bdcc5d98d852110ac6e",
    userId: "66e6926336455070e72e4bcb",
    content: "Hello, from new user!",
  });

  clientSocket.on("previousMessages", (messages) => {
    console.log("Previous messages received:", messages);
  });

  clientSocket.on("newMessage", (message) => {
    console.log("New message received:", message);
  });

  clientSocket.on("error", (error) => {
    console.error("Socket error:", error);
  });
};

// Run simulation after server starts
simulateSocketEvents();

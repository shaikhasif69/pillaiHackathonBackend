import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

// Join a group
socket.emit("joinGroup", "66e832963424a23fa2b78ed7");

// Send a message
socket.emit("sendMessage", {
  groupId: "66e832963424a23fa2b78ed7",
  senderId: "66e6926336455010e72e4acb",
  content: "heloo",
});

// Listen for new messages
socket.on("newMessage", (message) => {
  console.log("New message received:", message);
});

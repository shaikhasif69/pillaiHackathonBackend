import io from "socket.io-client";
import jwt from "jsonwebtoken";
const token = jwt.sign({ id: "66e698656ffd530f47532f6f" }, "PILLAI");

// Connect to the socket server with the token
console.log("tok", token);
const socket = io("http://localhost:3000", {
  auth: {
    token: `${token}`,
  },
});

// Join a tag in a community
socket.emit("joinTag", { communityId: "66eadc1132292973ba14a4b1", tag: "wwe" });

// Listen for previous messages
socket.on("previousMessages", (messages) => {
  console.log("Previous messages:", messages);
});

// Send a message
socket.emit("sendMessage", {
  communityId: "66eadc1132292973ba14a4b1",
  tag: "general",
  message: "Hello, this is a test message!",
});

// Listen for new messages
socket.on("receiveMessage", (message) => {
  console.log("New message:", message);
});

// Handle errors
socket.on("error", (err) => {
  console.error("Error:", err);
});

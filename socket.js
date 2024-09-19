import { Server } from "socket.io";
import User from "./models/user.js";
import Message from "./models/commitee/committeChat.js";
import Group from "./models/studentForum/studentGroup.js";
import Message1 from "./models/studentForum/studentMessage.js";

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
    // *************--code for student forums ****************
    socket.on("joinstudentGroup", async ({ groupId, userId }) => {
      try {
        const group = await Group.findById(groupId);
        if (!group.members.includes(userId)) {
          group.members.push(userId);
          await group.save();
        }
        socket.join(groupId);
        io.to(groupId).emit("userJoined", { userId, groupId });

        // Fetch previous messages with user details populated
        const messages = await Message1.find({ group: groupId })
          .populate("user", "username imageUrl") // Ensure user details are populated
          .sort({ createdAt: 1 });

        console.log(messages); // Log the messages to check if user details are populated

        // Emit previous messages with full user details to the newly joined user
        socket.emit("previousMessages", messages);
      } catch (error) {
        console.error(error);
      }
    });

    // Handle group message
    socket.on("sendMessage", async ({ groupId, userId, content }) => {
      try {
        // Fetch the user details (including username)
        const user = await User.findById(userId);
        if (!user) {
          return socket.emit("error", { message: "User not found." });
        }

        // Create a new message with userId and content
        const message = new Message1({
          group: groupId,
          user: userId,
          username: user.username,
          profileImage: user.imageUrl, // Include the user's profile image if needed
          content,
          upvotes: 0, // Initialize upvotes
          downvotes: 0, //
        });
        await message.save();

        // Add the message to the group
        const group = await Group.findById(groupId);
        group.messages.push(message._id);
        await group.save();

        // Emit the message with the user's username and profile image (if needed)
        io.to(groupId).emit("newMessage", {
          messageId: message._id,
          groupId: groupId,
          userId: userId,
          username: user.username,
          profileImage: user.imageUrl, // Include the user's profile image if needed
          content: message.content,
          createdAt: message.createdAt,
          upvotes: message.upvotes, // Ensure these are included
          downvotes: message.downvotes,
        });
      } catch (error) {
        console.error(error);
        socket.emit("error", {
          message: "An error occurred while sending the message.",
        });
      }
    });

    socket.on("voteMessage", async ({ messageId, userId, voteType }) => {
      try {
        const message = await Message1.findById(messageId);

        // Check if user has already voted
        const existingVote = message.voters.find((voter) =>
          voter.user.equals(userId)
        );

        if (existingVote) {
          if (existingVote.voteType === voteType) {
            // User has already cast this vote type, no further action
            return socket.emit("error", { message: "You have already voted." });
          } else {
            // Update the vote if user is changing from upvote to downvote or vice versa
            if (voteType === "upvote") {
              message.upvotes += 1;
              message.downvotes -= 1;
            } else {
              message.downvotes += 1;
              message.upvotes -= 1;
            }
            existingVote.voteType = voteType;
          }
        } else {
          // New vote
          if (voteType === "upvote") {
            message.upvotes += 1;
          } else {
            message.downvotes += 1;
          }
          // Add the user and vote type to the voters array
          message.voters.push({ user: userId, voteType });
        }

        await message.save();

        // Emit the updated message with all relevant data, including upvotes and downvotes
        io.to(message.group).emit("messageUpdated", {
          messageId: message._id,
          groupId: message.group,
          userId: message.user,
          content: message.content,
          upvotes: message.upvotes,
          downvotes: message.downvotes,
          voters: message.voters, // Include voters array if necessary
          createdAt: message.createdAt,
        });
      } catch (error) {
        console.error(error);
        socket.emit("error", {
          message: "An error occurred while processing your vote.",
        });
      }
    });
    // *************--code for student forums ends  ****************

    // Join a room by roomID
    // *************--code for group and 1v1 chat  ****************

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

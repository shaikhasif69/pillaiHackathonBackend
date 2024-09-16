import Group from "./models/council/groupSchema.js";
import Message from "./models/council/message.js";
import User from "./models/user.js";

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Handle joining a group
    socket.on("create-group", async ({ groupName }) => {
      try {
        // Check if group name already exists
        const existingGroup = await Group.findOne({ name: groupName });
        if (existingGroup) {
          socket.emit("error", { message: "Group name already exists" });
          return;
        }

        // Create new group
        const newGroup = new Group({
          name: groupName,
          members: [socket.userId], // Add the creator as a member
        });

        await newGroup.save();

        // Join the new group room (Socket.io)
        socket.join(newGroup._id.toString());

        socket.emit("group-created", {
          groupId: newGroup._id,
          groupName: newGroup.name,
          message: `Group ${newGroup.name} created successfully`,
        });

        console.log(`User ${socket.userId} created group ${newGroup._id}`);
      } catch (error) {
        console.error("Error creating group:", error);
        socket.emit("error", {
          message: "An error occurred while creating the group",
        });
      }
    });
    socket.on("join-group", async ({ groupId }) => {
      try {
        const group = await Group.findById(groupId);

        if (!group) {
          socket.emit("error", { message: "Group not found" });
          return;
        }

        // Check if the user is already a member of the group
        const isMember = group.users.includes(socket.userId);
        if (!isMember) {
          // Add the user to the group in the database
          group.users.push(socket.userId);
          await group.save();
          console.log(`User ${socket.userId} added to group ${groupId}`);
        }

        // Add the user to the group room (Socket.io)
        socket.join(groupId);
        socket.emit("joined-group", {
          groupId,
          message: `Joined group ${group.name}`,
        });
        console.log(`User ${socket.userId} joined group ${groupId} via Socket`);
      } catch (error) {
        console.error("Error joining group:", error);
        socket.emit("error", {
          message: "An error occurred while joining the group",
        });
      }
    });

    // Handle sending a group message
    socket.on("group-message", async ({ groupId, message }) => {
      // Ensure the user has joined the group room before sending a message
      const rooms = Array.from(socket.rooms);
      if (!rooms.includes(groupId)) {
        socket.emit("error", {
          message: "You must join the group before sending messages",
        });
        return;
      }

      const newMessage = new Message({
        senderId: socket.userId,
        groupId,
        content: message,
        isGroupMessage: true,
      });

      await newMessage.save();

      // Fetch sender's username from DB
      const sender = await User.findById(socket.userId);

      io.to(groupId).emit("new-group-message", {
        senderId: socket.userId,
        senderName: sender.username, // Send the username to the frontend
        message,
      });
    });

    // Handle private messages (no change)
    socket.on("private-message", async ({ receiverId, message }) => {
      const newMessage = new Message({
        senderId: socket.userId,
        receiverId,
        content: message,
        isGroupMessage: false,
      });
      await newMessage.save();

      const sender = await User.findById(socket.userId);

      const roomId = [socket.userId, receiverId].sort().join("-");
      io.to(roomId).emit("new-private-message", {
        senderId: socket.userId,
        senderName: sender.username,
        message,
      });
    });
    socket.on("upvote-message", async ({ messageId }) => {
      try {
        const message = await Message.findById(messageId);
        if (message) {
          message.upvotes += 1;
          await message.save();

          // Notify all users in the group of the updated vote count
          if (message.groupId) {
            io.to(message.groupId.toString()).emit("message-vote-update", {
              messageId,
              upvotes: message.upvotes,
              downvotes: message.downvotes,
            });
          }
        }
      } catch (error) {
        console.error("Error upvoting message:", error);
        socket.emit("error", {
          message: "An error occurred while upvoting the message",
        });
      }
    });

    // Handle downvoting a message
    socket.on("downvote-message", async ({ messageId }) => {
      try {
        const message = await Message.findById(messageId);
        if (message) {
          message.downvotes += 1;
          await message.save();

          // Notify all users in the group of the updated vote count
          if (message.groupId) {
            io.to(message.groupId.toString()).emit("message-vote-update", {
              messageId,
              upvotes: message.upvotes,
              downvotes: message.downvotes,
            });
          }
        }
      } catch (error) {
        console.error("Error downvoting message:", error);
        socket.emit("error", {
          message: "An error occurred while downvoting the message",
        });
      }
    });

    // Other socket events...
    socket.on("post-comment", async ({ messageId, comment }) => {
      try {
        const message = await Message.findById(messageId);
        if (message) {
          const newComment = {
            commenterId: socket.userId,
            content: comment,
          };

          // Add the new comment to the message's comments array
          message.comments.push(newComment);
          await message.save();

          // Fetch the commenter's username from the database
          const commenter = await User.findById(socket.userId);

          // Notify all users in the group of the new comment
          if (message.groupId) {
            io.to(message.groupId.toString()).emit("new-comment", {
              messageId,
              comment: {
                commenterId: socket.userId,
                commenterName: commenter.username,
                content: comment,
                createdAt: new Date(),
              },
            });
          }
        }
      } catch (error) {
        console.error("Error posting comment:", error);
        socket.emit("error", {
          message: "An error occurred while posting the comment",
        });
      }
    });
  });
};

export default socketHandler;

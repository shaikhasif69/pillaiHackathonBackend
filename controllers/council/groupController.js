import Group from "../../models/council/groupSchema.js";
import Message from "./../../models/council/message.js";

export const getUserGroups = async (req, res) => {
  try {
    const userId = req.userId; // Assumes userId is set by auth middleware

    // Find groups where the userId is in the 'users' array
    const groups = await Group.find({ users: userId });

    if (!groups.length) {
      return res.status(404).json({ message: "No groups found for this user" });
    }

    res.json(groups);
  } catch (error) {
    console.error("Error fetching user groups:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching groups" });
  }
};
export const getTopUpvotedMessages = async (req, res) => {
  try {
    // Fetch messages sorted by upvotes in descending order
    const topMessages = await Message.find({})
      .sort({ upvotes: -1 }) // Sort by upvotes in descending order
      .limit(10) // Limit the number of results
      .populate("senderId", "username") // Optional: populate sender information
      .populate("groupId", "name"); // Optional: populate group information

    res.status(200).json(topMessages);
  } catch (error) {
    console.error("Error fetching top upvoted messages:", error);
    res.status(500).json({
      message: "An error occurred while fetching top upvoted messages",
    });
  }
};

export const getPreviousMessages = async (req, res) => {
  const { roomId } = req.params;

  try {
    // Fetch messages from the database based on roomId
    const messages = await Message.find({ roomId }).sort({ createdAt: 1 });

    // If no messages found, return an empty array
    if (!messages) {
      return res.status(404).json({ message: "No messages found" });
    }

    // Return the messages as a JSON response
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error" });
  }
};

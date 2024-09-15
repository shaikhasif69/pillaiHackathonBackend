import Community from "../models/community.js";
import Tag from "../models/trending.js";
import User from "../models/user.js"; // Import the User model
import mongoose from "mongoose";
export const createCommunity = async (req, res) => {
  const { name, description } = req.body;
  const userId = req.userId; // Get userId from auth middleware

  try {
    const existingCommunity = await Community.findOne({ name });
    if (existingCommunity) {
      return res.status(400).json({ message: "Community already exists" });
    }

    // Fetch the username based on the userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newCommunity = new Community({
      name,
      description,
      creator: {
        userId,
        username: user.username, // Add username to creator
      },
      members: [{ userId, username: user.username }], // Add creator as a member with username
    });

    await newCommunity.save();
    const sendCommunity = await Community.findById(newCommunity._id).select(
      "creator.username"
    );

    res.status(201).json(newCommunity);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
export const updateCommunity = async (req, res) => {
  const { communityId } = req.params; // Get community ID from request parameters
  console.log("Community ID from params:", communityId);

  // Check if communityId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(communityId)) {
    return res.status(400).json({ message: "Invalid community ID" });
  }

  const { name, description } = req.body; // Get updated name and description from request body
  const userId = req.userId; // Get userId from auth middleware

  try {
    // Find the community by ID
    const community = await Community.findById(communityId);
    console.log("Community found:", community);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Check if the current user is the creator of the community
    if (community.creator.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this community" });
    }

    // Update the community fields
    if (name) community.name = name;
    if (description) community.description = description;

    // Save the updated community
    await community.save();

    // Send the updated community data
    res.status(200).json(community);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
export const deleteCommunity = async (req, res) => {
  const { communityId } = req.params; // Get community ID from request parameters
  const userId = req.userId; // Get userId from auth middleware

  // Check if communityId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(communityId)) {
    return res.status(400).json({ message: "Invalid community ID" });
  }

  try {
    // Find the community by ID
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Check if the current user is the creator of the community
    if (community.creator.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this community" });
    }

    // Delete the community
    await Community.findByIdAndDelete(communityId);

    // Send a success response
    res.status(200).json({ message: "Community deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const joinCommunity = async (req, res) => {
  const { communityId } = req.body;
  const userId = req.userId; // Get userId from auth middleware

  try {
    const community = await Community.findById(communityId);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    if (community.members.some((member) => member.userId.equals(userId))) {
      return res.status(400).json({ message: "Already a member" });
    }

    // Fetch the username based on the userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    community.members.push({ userId, username: user.username });

    await community.save();

    res.status(200).json({ message: "Joined community successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const getPostsByCommunity = async (req, res) => {
  const { communityId } = req.params;

  try {
    // Find the community by ID and populate the posts with tag details
    const community = await Community.findById(communityId)
      .populate({
        path: "posts",
        populate: {
          path: "tags", // Populate the tags field within posts
          select: "name", // Select fields to include in the response
        },
      })
      .populate({
        path: "posts.author.id",
        select: "username", // Optional: include username of the post author
      });

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Get all posts of the community
    const posts = community.posts;

    if (!posts.length) {
      return res
        .status(404)
        .json({ message: "No posts found for this community" });
    }

    // Return the posts with tag details
    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
// get posts with tags
// export const getPostsByCommunity = async (req, res) => {
//   const { communityId } = req.params;

//   try {
//     // Find the community by ID and populate the posts with tag details
//     const community = await Community.findById(communityId)
//       .populate({
//         path: "posts",
//         populate: {
//           path: "tags", // Populate the tags field within posts
//           select: "name", // Select fields to include in the response
//         },
//       })
//       .populate({
//         path: "posts.author.id",
//         select: "username", // Optional: include username of the post author
//       });

//     if (!community) {
//       return res.status(404).json({ message: "Community not found" });
//     }

//     // Get all posts of the community
//     const posts = community.posts;

//     if (!posts.length) {
//       return res
//         .status(404)
//         .json({ message: "No posts found for this community" });
//     }

//     // Return the posts with tag details
//     res.status(200).json(posts);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Something went wrong", error: error.message });
//   }
// };

export const listCommunities = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default page is 1, limit is 10 communities per page

  try {
    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Retrieve communities with pagination
    const communities = await Community.find()
      .select("name description creator createdAt")
      .skip(skip)
      .limit(parseInt(limit)); // Adjust the fields as needed

    // Get the total count of communities for pagination info
    const total = await Community.countDocuments();

    // Check if there are no communities
    if (communities.length === 0) {
      return res.status(404).json({ message: "No communities found" });
    }

    // Return the list of communities with pagination info
    res.status(200).json({
      total, // Total number of communities
      page: parseInt(page), // Current page
      totalPages: Math.ceil(total / limit), // Total pages based on limit
      communities, // Communities for the current page
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
export const getTrendingTags = async (req, res) => {
  try {
    const trendingTags = await Tag.find().sort({ usageCount: -1 }).limit(10); // Get top 10 tags

    res.status(200).json(trendingTags);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

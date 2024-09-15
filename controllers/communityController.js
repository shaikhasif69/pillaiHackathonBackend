import cloudinary from "../helpers/cloudinary.js";
import Community from "../models/community.js";
import Event from "../models/communityEvents.js";
import Faculty from "../models/pillaiFaculty.js";
import Tag from "../models/trending.js";
import User from "../models/user.js"; // Import the User model
import mongoose from "mongoose";
export const createCommunity = async (req, res) => {
  const { name, description, facultyEmail } = req.body;
  const userId = req.userId; // Get userId from auth middleware
  const file = req.file; // Assuming the image is passed via multipart/form-data

  try {
    // Check for existing community
    const existingCommunity = await Community.findOne({ name });
    if (existingCommunity) {
      return res.status(400).json({ message: "Community already exists" });
    }

    // Fetch the username based on the userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the provided facultyEmail is valid
    const faculty = await Faculty.findOne({ email: facultyEmail });
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    // Fetch the user ID associated with this faculty email
    const facultyUser = await User.findOne({ email: faculty.email });
    if (!facultyUser) {
      return res.status(404).json({ message: "Faculty user not found" });
    }

    let imageUrl = "";
    if (file) {
      // Upload image directly to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream(
            {
              folder: "community_images",
              resource_type: "auto", // Automatically detect the file type
            },
            (error, result) => {
              if (error) {
                reject(new Error(error.message));
              } else {
                resolve(result);
              }
            }
          )
          .end(file.buffer); // Pass the buffer to Cloudinary
      });

      imageUrl = uploadResult.secure_url; // Save the image URL
    }

    // Create a new community
    const newCommunity = new Community({
      name,
      description,
      creator: {
        userId,
        username: user.username,
      },
      members: [{ userId, username: user.username }],
      status: "pending", // Set status to 'pending' by default
      facultyId: facultyUser._id, // Store the user ID of the faculty
      imageUrl: imageUrl, // Save the image URL to the community
    });

    // Save to database
    await newCommunity.save();
    res.status(201).json(newCommunity);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
export const getUserCommunities = async (req, res) => {
  const userId = req.userId; // Get userId from auth middleware

  try {
    // Find all communities created by the user and populate the facultyId field from the User model to get the faculty's username
    const communities = await Community.find({ "creator.userId": userId })
      .populate({
        path: "facultyId",
        model: User, // Populate from User model
        select: "username", // Only select the username
      })
      .exec();

    if (!communities.length) {
      return res
        .status(404)
        .json({ message: "No communities found for this user" });
    }

    // Transform the response to include the faculty's username
    const response = communities.map((community) => ({
      ...community._doc,
      facultyUsername: community.facultyId?.username || null, // Add faculty username or null if not available
    }));

    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
export const approveCommunity = async (req, res) => {
  const { communityId, status } = req.body;
  const facultyId = req.userId; // Assuming the faculty ID is in req.userId

  try {
    // Ensure status is either 'approved' or 'rejected'
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Check if the facultyId is valid and is a registered faculty
    const faculty = await User.findById(facultyId);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    // Check if the community exists and if the facultyId matches the one stored in the Community document
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    if (community.facultyId.toString() !== facultyId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to approve this community" });
    }

    // Update the community status
    community.status = status;
    if (status === "approved") {
      community.approvedFaculty = facultyId;
    } else {
      community.approvedFaculty = null;
    }

    await community.save();

    res.status(200).json(community);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
// Assuming this function is part of your API controllers
export const getPendingCommunities = async (req, res) => {
  const facultyId = req.userId; // Get the faculty ID from auth middleware

  try {
    // Find communities with pending status and where the facultyId matches
    const communities = await Community.find({
      facultyId,
      status: "pending",
    }).select("name description creator status"); // Adjust fields as needed

    if (communities.length === 0) {
      return res
        .status(404)
        .json({ message: "No communities pending approval" });
    }

    res.status(200).json(communities);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
export const createEvent = async (req, res) => {
  const { title, description, communityId, date } = req.body;
  const userId = req.userId; // Get userId from auth middleware
  console.log(userId);
  try {
    // Fetch the community to check if the user is the creator
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Ensure the user is the creator of the community
    if (community.creator.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Only the community creator can create events" });
    }

    // Fetch the user's username
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newEvent = new Event({
      title,
      description,
      community: communityId,
      creator: {
        userId,
        username: user.username,
      },
      status: "pending", // Set status to 'pending' by default
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
export const approveEvent = async (req, res) => {
  const { eventId, status } = req.body;
  const facultyId = req.userId; // Get facultyId from auth middleware (assumed to be logged in faculty)

  try {
    // Ensure status is either 'approved' or 'rejected'
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Find the community related to this event
    const community = await Community.findById(event.community);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Check if the current faculty is the one who approved the community
    if (community.approvedFaculty.toString() !== facultyId) {
      return res.status(403).json({
        message:
          "Only the faculty who approved the community can approve the event",
      });
    }

    // Update the event status
    event.status = status;
    await event.save();

    res.status(200).json(event);
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
  const file = req.file; // Get the uploaded image file (if any)

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

    // Handle image upload if a file is provided
    if (file) {
      // Upload image directly to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream(
            {
              folder: "community_images",
              resource_type: "auto", // Automatically detect the file type
            },
            (error, result) => {
              if (error) {
                reject(new Error(error.message));
              } else {
                resolve(result);
              }
            }
          )
          .end(file.buffer); // Pass the buffer to Cloudinary
      });

      community.imageUrl = uploadResult.secure_url; // Update the image URL
    }

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
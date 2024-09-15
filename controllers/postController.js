import cloudinary from "../helpers/cloudinary.js";
import Community from "../models/community.js";
import Event from "../models/communityEvents.js";
import Tag from "../models/trending.js";
import User from "../models/user.js"; // Import the User model
import mongoose from "mongoose";
export const writePost = async (req, res) => {
  const { communityId, content, tags } = req.body; // Accept tags in the request body
  const file = req.file; // Get the uploaded image file (if any)
  console.log(req.userId);
  console.log("coom", communityId);

  try {
    // Find the community by ID
    const community = await Community.findById(communityId);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    if (community.status === "pending") {
      return res.status(403).json({ message: "Community is pending approval" });
    }

    // Check if the user is a member of the community
    if (
      !community.members.some(
        (member) => member.userId.toString() === req.userId
      )
    ) {
      return res
        .status(403)
        .json({ message: "You must join the community to post" });
    }

    // Fetch the user's details to get the name
    const author = await User.findById(req.userId);
    if (!author) {
      return res.status(404).json({ message: "User not found" });
    }

    // Process tags
    const tagIds = [];
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        // Find or create the tag
        let tag = await Tag.findOne({ name: tagName });
        if (!tag) {
          tag = new Tag({ name: tagName, usageCount: 1 });
        } else {
          tag.usageCount += 1; // Increment usage count
        }
        await tag.save();
        tagIds.push(tag._id); // Add the tag ID to the array
      }
    }

    let imageUrl = "";
    if (file) {
      // Upload image directly to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream(
            {
              folder: "post_images",
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

    // Create a new post with author's name, tags, and image URL
    const newPost = {
      content,
      author: {
        id: req.userId,
        username: author.username,
      },
      tags: tagIds,
      imageUrl: imageUrl, // Add the image URL to the post
    };

    // Add the new post to the community
    community.posts.push(newPost);

    // Save the updated community
    await community.save();

    res.status(200).json(community.posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { communityId, postId, content } = req.body;
  const file = req.file; // Get the uploaded image file (if any)

  try {
    // Find the community by ID
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Find the post by ID
    const post = community.posts.id(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is the author of the post
    if (post.author.id.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this post" });
    }

    // Update the post content
    if (content) {
      post.content = content;
    }

    // Handle image upload
    if (file) {
      // Upload image to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream(
            {
              folder: "post_images",
              resource_type: "auto",
            },
            (error, result) => {
              if (error) {
                reject(new Error(error.message));
              } else {
                resolve(result);
              }
            }
          )
          .end(file.buffer);
      });

      // Update the post with the new image URL
      post.imageUrl = uploadResult.secure_url;
    }

    // Save the updated community
    await community.save();

    res.status(200).json(post);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
export const deletePost = async (req, res) => {
  const { communityId, postId } = req.body;

  try {
    // Find the community by ID
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // Find the index of the post to be deleted
    const postIndex = community.posts.findIndex(
      (post) => post.id.toString() === postId
    );

    if (postIndex === -1) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find the post by ID
    const post = community.posts[postIndex];

    // Check if the user is the author of the post
    if (
      post.author.id.toString() !== req.userId &&
      community.creator.userId.toString() !== req.userId
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }

    // Remove the post from the array
    community.posts.splice(postIndex, 1);

    // Save the updated community
    await community.save();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
export const getApprovedEvents = async (req, res) => {
  const { communityId } = req.params;
  const userId = req.userId; // Get userId from auth middleware

  try {
    // Check if the user is a member of the community
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const isMember = community.members.some(
      (member) => member.userId.toString() === userId
    );
    if (!isMember) {
      return res
        .status(403)
        .json({ message: "Only community members can view events" });
    }

    // Find all approved events for the community
    const events = await Event.find({
      community: communityId,
      status: "approved",
    });

    if (events.length === 0) {
      return res.status(404).json({ message: "No approved events found" });
    }

    res.status(200).json(events);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const getUserFeed = async (req, res) => {
  const userId = req.userId; // Assuming userId is obtained from authentication middleware
  const { tags: filterTags, page = 1, limit = 10 } = req.query; // Pagination parameters

  try {
    // Step 1: Find all communities the user is a member of
    const communities = await Community.find({
      "members.userId": userId,
    }).populate({
      path: "posts",
      populate: {
        path: "tags",
        select: "name", // Populate tag details
      },
    });

    // Check if any communities were found
    if (!communities.length) {
      return res
        .status(404)
        .json({ message: "No communities found for this user" });
    }

    // Step 2: Extract posts from these communities
    let posts = communities.flatMap((community) => community.posts);

    // Step 3: Filter posts by tags if filterTags are provided
    if (filterTags) {
      const tagsArray = filterTags.split(","); // Assuming tags are comma-separated in the query parameter

      // Filter posts based on tags
      posts = posts.filter((post) =>
        post.tags.some((tag) => tagsArray.includes(tag.name))
      );
    }

    // Check if any posts were found after filtering
    if (!posts.length) {
      return res.status(404).json({
        message:
          "No posts found for the communities this user has joined with the specified tags",
      });
    }

    // Step 4: Implement pagination
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const totalPosts = posts.length;
    const totalPages = Math.ceil(totalPosts / pageSize);

    // Slice the posts array to return the current page's posts
    const paginatedPosts = posts.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    );

    // Return paginated results
    res.status(200).json({
      posts: paginatedPosts,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalPosts,
        pageSize,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

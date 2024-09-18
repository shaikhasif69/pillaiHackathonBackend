import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
  },
  content: {
    type: String,
    required: true,
  },

  author: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true }, // Add name field
  },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }], // Reference tags by their ID
  imageUrl: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  creator: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  members: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      username: {
        type: String,
      },
    },
  ],
  posts: [postSchema],

  createdAt: {
    type: Date,
    default: Date.now,
    get: (date) =>
      date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }), // Formats date to "Month Day, Year"
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  imageUrl: {
    type: String, // URL to the image stored on Cloudinary
    required: false,
  },
  category: {
    type: [String], // Array of strings for multiple categories (you can change it to String if only one category is allowed)
    enum: [
      "sports",
      "technology",
      "music",
      "art",
      "photography",
      "coding",
      "artifical intelligence",
      "python",
      "web development",
      "javascript",
      "cybersecurity",
      "ethical hacking",
      "design",
      "game development",
      "machine learning",
      "algorithms",
      "data science",
      "gaming",
      "multiplayer",
      "battle royale",
      "photography",
      "visual art",
      "media",
    ], // Add predefined categories

    required: true, // Set this as required if every community should have a category
  },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming the faculty user is also a User
  },
  approvedFaculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
  },
});
communitySchema.set("toJSON", { getters: true });

const Community = mongoose.model("Community", communitySchema);

export default Community;

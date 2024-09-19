import mongoose from "mongoose";
import Community from "./models/community.js";

const communities = [
  //   {
  //     name: "AI Club",
  //     description:
  //       "A community focused on artificial intelligence and related topics.",
  //     category: ["coding", "artificial intelligence", "python"],
  //     creator: {
  //       userId: "66e6926336455070e72e4bcb", // Aadarsh
  //       username: "Aadarsh",
  //     },
  //     members: [
  //       {
  //         userId: "66e6926336455070e72e4bcb",
  //         username: "Aadarsh",
  //       },
  //     ],
  //     status: "pending",
  //     facultyId: "66e698656ffd530f47532f6f",
  //     imageUrl:
  //       "https://res.cloudinary.com/dnznafp2a/image/upload/v1726649735/community_images/i5nxdelcgug0tfzmjdvn.png",
  //   },
  //   {
  //     name: "Python Club",
  //     description: "A community for Python enthusiasts.",
  //     category: ["coding", "python", "data science"],
  //     creator: {
  //       userId: "66e6926336455070e72e4bcb", // Aadarsh
  //       username: "Aadarsh",
  //     },
  //     members: [
  //       {
  //         userId: "66e6926336455070e72e4bcb",
  //         username: "Aadarsh",
  //       },
  //     ],
  //     status: "pending",
  //     facultyId: "66e698656ffd530f47532f6f",
  //     imageUrl:
  //       "https://res.cloudinary.com/dnznafp2a/image/upload/v1726649735/community_images/i5nxdelcgug0tfzmjdvn.png",
  //   },
  //   {
  //     name: "JavaScript Club",
  //     description: "A community for JavaScript and web development enthusiasts.",
  //     category: ["coding", "web development", "javascript"],
  //     creator: {
  //       userId: "66e6926336455070e72e4bcb", // Aadarsh
  //       username: "Aadarsh",
  //     },
  //     members: [
  //       {
  //         userId: "66e6926336455070e72e4bcb",
  //         username: "Aadarsh",
  //       },
  //     ],
  //     status: "pending",
  //     facultyId: "66e698656ffd530f47532f6f",
  //     imageUrl:
  //       "https://res.cloudinary.com/dnznafp2a/image/upload/v1726649735/community_images/i5nxdelcgug0tfzmjdvn.png",
  //   },
  //   {
  //     name: "Cybersecurity Club",
  //     description: "A community dedicated to cybersecurity and ethical hacking.",
  //     category: ["coding", "cybersecurity", "ethical hacking"],
  //     creator: {
  //       userId: "66e6926336455070e72e4bcb", // Aadarsh
  //       username: "Aadarsh",
  //     },
  //     members: [
  //       {
  //         userId: "66e6926336455070e72e4bcb",
  //         username: "Aadarsh",
  //       },
  //     ],
  //     status: "pending",
  //     facultyId: "66e698656ffd530f47532f6f",
  //     imageUrl:
  //       "https://res.cloudinary.com/dnznafp2a/image/upload/v1726649735/community_images/i5nxdelcgug0tfzmjdvn.png",
  //   },
  //   {
  //     name: "Game Development Club",
  //     description: "A community for game development and design enthusiasts.",
  //     category: ["coding", "game development", "design"],
  //     creator: {
  //       userId: "66e6926336455070e72e4bcb", // Aadarsh
  //       username: "Aadarsh",
  //     },
  //     members: [
  //       {
  //         userId: "66e6926336455070e72e4bcb",
  //         username: "Aadarsh",
  //       },
  //     ],
  //     status: "pending",
  //     facultyId: "66e698656ffd530f47532f6f",
  //     imageUrl:
  //       "https://res.cloudinary.com/dnznafp2a/image/upload/v1726649735/community_images/i5nxdelcgug0tfzmjdvn.png",
  //   },
  //   {
  //     name: "Machine Learning Club",
  //     description: "A community focused on machine learning and algorithms.",
  //     category: ["coding", "machine learning", "algorithms"],
  //     creator: {
  //       userId: "66e6926336455070e72e4bcb", // Aadarsh
  //       username: "Aadarsh",
  //     },
  //     members: [
  //       {
  //         userId: "66e6926336455070e72e4bcb",
  //         username: "Aadarsh",
  //       },
  //     ],
  //     status: "pending",
  //     facultyId: "66e698656ffd530f47532f6f",
  //     imageUrl:
  //       "https://res.cloudinary.com/dnznafp2a/image/upload/v1726649735/community_images/i5nxdelcgug0tfzmjdvn.png",
  //   },
  //   {
  //     name: "Data Science Club",
  //     description: "A community for data science and Python enthusiasts.",
  //     category: ["coding", "data science", "python"],
  //     creator: {
  //       userId: "66e6926336455070e72e4bcb", // Aadarsh
  //       username: "Aadarsh",
  //     },
  //     members: [
  //       {
  //         userId: "66e6926336455070e72e4bcb",
  //         username: "Aadarsh",
  //       },
  //     ],
  //     status: "pending",
  //     facultyId: "66e698656ffd530f47532f6f",
  //     imageUrl:
  //       "https://res.cloudinary.com/dnznafp2a/image/upload/v1726649735/community_images/i5nxdelcgug0tfzmjdvn.png",
  //   },
  {
    name: "Fortnite Club",
    description:
      "A community for multiplayer and battle royale game enthusiasts.",
    category: ["gaming", "multiplayer", "battle royale"],
    creator: {
      userId: "66e6926336455070e72e4bcb",
      username: "Aadarsh",
    },
    members: [
      {
        userId: "66e6926336455070e72e4bcb",
        username: "Aadarsh",
      },
    ],
    status: "pending",
    facultyId: "66e698656ffd530f47532f6f",
    imageUrl:
      "https://res.cloudinary.com/dnznafp2a/image/upload/v1726649735/community_images/i5nxdelcgug0tfzmjdvn.png",
  },
  {
    name: "Photography Club",
    description: "A community for photography and visual art enthusiasts.",
    category: ["photography", "visual art", "media"],
    creator: {
      userId: "66e6926336455070e72e4bcb",
      username: "Aadarsh",
    },
    members: [
      {
        userId: "66e6926336455070e72e4bcb",
        username: "Aadarsh",
      },
    ],
    status: "pending",
    facultyId: "66e698656ffd530f47532f6f",
    imageUrl:
      "https://res.cloudinary.com/dnznafp2a/image/upload/v1726649735/community_images/i5nxdelcgug0tfzmjdvn.png",
  },
  // Add more communities similarly
];

const createCommunities = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      "mongodb+srv://theshaikhasif03:fPQSb56RBLe2lG84@cluster1.o65jh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 90000, // Increase timeout
      }
    );

    console.log("Connected to MongoDB");

    // Insert communities
    await Community.insertMany(communities);
    console.log("Communities added successfully");
  } catch (error) {
    console.error("Error adding communities:", error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
};

createCommunities();

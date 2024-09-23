import mongoose from "mongoose";
import Group from "./models/studentForum/studentGroup.js";

const dummyGroups = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Tech Enthusiasts",
    description:
      "A group for discussing the latest in technology and software development.",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
const saveDummyGroups = async () => {
  const mongoURI =
    "mongodb+srv://theshaikhasif03:fPQSb56RBLe2lG84@cluster1.o65jh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"; // Replace with your MongoDB URI

  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Connected to MongoDB");

    // Insert dummy groups
    const savedGroups = await Group.insertMany(dummyGroups);
    console.log("Dummy groups saved successfully:", savedGroups);
  } catch (error) {
    console.error("Error saving dummy groups:", error);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
};

// Call the function
saveDummyGroups();

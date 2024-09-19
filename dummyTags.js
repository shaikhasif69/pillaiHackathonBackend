import mongoose from "mongoose";
import Chat from "./models/commitee/committeChat.js";

const addDummyTags = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://theshaikhasif03:fPQSb56RBLe2lG84@cluster1.o65jh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      }
    );

    // Add dummy chats with tags
    const dummyChats = [
      {
        communityId: "60f7f0e5c1259d4f5c51c42b", // Replace with a valid community ID
        tag: "#sports",
        messages: [],
      },
      {
        communityId: "60f7f0e5c1259d4f5c51c42b", // Replace with the same community ID
        tag: "#technology",
        messages: [],
      },
      {
        communityId: "60f7f0e5c1259d4f5c51c42b", // Replace with the same community ID
        tag: "#gaming",
        messages: [],
      },
    ];

    // Insert dummy data
    await Chat.insertMany(dummyChats);
    console.log("Dummy tags added to database");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error adding dummy tags:", error);
    mongoose.connection.close();
  }
};

addDummyTags();

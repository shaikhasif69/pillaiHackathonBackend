import mongoose from "mongoose";
import csv from "csv-parser";
import fs from "fs";
import Mentor from "./models/mentorship.js"; // Import the Mentor model

// MongoDB connection string
const MONGODB_URI =
  "mongodb+srv://theshaikhasif03:fPQSb56RBLe2lG84@cluster1.o65jh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB", err));

const importClubsFromCSV = async () => {
  const mentors = []; // Array to store mentors

  // Read the CSV file
  fs.createReadStream("mentors.csv") // Replace with the path to your CSV file
    .pipe(csv())
    .on("data", (row) => {
      mentors.push({
        mentor_id: row.mentor_id,
        mentor_name: row.mentor_name,
        category_1: row.category_1,
        category_2: row.category_2,
        category_3: row.category_3,
      });
    })
    .on("end", async () => {
      try {
        // Insert mentor data into the MongoDB collection using Mentor model
        await Mentor.insertMany(mentors); // Use insertMany to insert all mentor records at once
        console.log("CSV data successfully inserted into MongoDB");
        mongoose.connection.close(); // Close the connection after insertion
      } catch (error) {
        console.error("Error inserting data into MongoDB", error);
      }
    });
};

importClubsFromCSV();

// scripts/importClubs.js
import mongoose from "mongoose";
import csv from "csv-parser";
import fs from "fs";
import Club from "./models/myclubs.js";

// MongoDB connection string
const MONGODB_URI =
  "mongodb+srv://theshaikhasif03:fPQSb56RBLe2lG84@cluster1.o65jh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"; // Replace with your MongoDB URI

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
  const clubs = [];

  // Read the CSV file
  fs.createReadStream("clubs.csv") // Replace with the path to your CSV file
    .pipe(csv())
    .on("data", (row) => {
      clubs.push({
        club_id: row.club_id,
        club_name: row.club_name,
        category_1: row.category_1,
        category_2: row.category_2,
        category_3: row.category_3,
      });
    })
    .on("end", async () => {
      try {
        // Insert clubs data into the MongoDB collection
        await Club.insertMany(clubs);
        console.log("CSV data successfully inserted into MongoDB");
        mongoose.connection.close();
      } catch (error) {
        console.error("Error inserting data into MongoDB", error);
      }
    });
};

importClubsFromCSV();

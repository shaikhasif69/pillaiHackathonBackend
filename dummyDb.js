import mongoose from "mongoose";
import Student from "./models/pillaiStudent.js";
import Faculty from "./models/pillaiFaculty.js";

const studentEmails = [
  "maadarsh23comp@student.mes.ac.in",
  "john.doe@student.mes.ac.in",
  "jane.smith@student.mes.ac.in",
  "alice.jones@student.mes.ac.in",
  "bob.brown@student.mes.ac.in",
  "20sdeveloper4209@gmail.com",
];

const facultyEmails = [
  "onlyaddy68@gmail.com",
  "prof.john@example.com",
  "prof.smith@example.com",
  "prof.jones@example.com",
  "prof.brown@example.com",
  "prof.miller@example.com",
  "20sdeveloper4209@gmail.com",
];

// Function to save emails
const saveEmails = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      "mongodb+srv://theshaikhasif03:fPQSb56RBLe2lG84@cluster1.o65jh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      }
    );

    console.log("Connected to MongoDB");

    // Save student emails
    await Promise.all(
      studentEmails.map((email) =>
        Student.updateOne(
          { email }, // Match by email
          { $setOnInsert: { email } }, // Insert only if the email doesn't exist
          { upsert: true } // Insert if not found
        )
      )
    );
    console.log("All student emails saved successfully.");

    // Save faculty emails
    await Promise.all(
      facultyEmails.map((email) =>
        Faculty.updateOne(
          { email }, // Match by email
          { $setOnInsert: { email } }, // Insert only if the email doesn't exist
          { upsert: true } // Insert if not found
        )
      )
    );
    console.log("All faculty emails saved successfully.");
  } catch (error) {
    console.error("Error saving emails:", error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Execute the function
saveEmails();

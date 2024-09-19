import mongoose from "mongoose";
import Student from "./models/pillaiStudent.js";
import Faculty from "./models/pillaiFaculty.js";

const studentData = [
  {
    email: "shaikhasif@student.mes.ac.in",
    name: "Shaikh Asif",
    department: "Computer Engineering",
    year: "3rd Year",
    address: "Mumbai, India",
    handicapped: false,
  },

  {
    email: "pgaurav23comp@student.mes.ac.in",
    name: "Gaurav",
    department: "Computer Engineering",
    year: "3rd Year",
    address: "Mumbai, India",
    handicapped: true,
  },

  {
    email: "psai23comp@student.mes.ac.in",
    name: "Sai",
    department: "Computer Engineering",
    year: "3rd Year",
    address: "Mumbai, India",
    handicapped: false,
  },

  {
    email: "maadarsh23comp@student.mes.ac.in",
    name: "Adarsh M.",
    department: "Computer Engineering",
    year: "3rd Year",
    address: "Mumbai, India",
    handicapped: false,
  },
  {
    email: "john.doe@student.mes.ac.in",
    name: "John Doe",
    department: "Mechanical Engineering",
    year: "2nd Year",
    address: "Delhi, India",
    handicapped: false,
  },
  {
    email: "jane.smith@student.mes.ac.in",
    name: "Jane Smith",
    department: "Civil Engineering",
    year: "1st Year",
    address: "Pune, India",
    handicapped: false,
  },
  {
    email: "alice.jones@student.mes.ac.in",
    name: "Alice Jones",
    department: "Information Technology",
    year: "4th Year",
    address: "Bangalore, India",
    handicapped: true, // Only one handicapped student
  },
  {
    email: "bob.brown@student.mes.ac.in",
    name: "Bob Brown",
    department: "Computer Engineering",
    year: "3rd Year",
    address: "Mumbai, India",
    handicapped: false,
  },
  {
    email: "20sdeveloper4209@gmail.com",
    name: "Developer",
    department: "Electronics Engineering",
    year: "2nd Year",
    address: "Hyderabad, India",
    handicapped: false,
  },
];

const facultyData = [
  {
    email: "onlyaddy68@gmail.com",
    name: "Aditya S.",
    department: "Computer Engineering",
    subject: "Software Engineering",
    experience: 5,
    gender: "Male",
  },
  {
    email: "prof.john@example.com",
    name: "Prof. John",
    department: "Mechanical Engineering",
    subject: "Thermodynamics",
    experience: 10,
    gender: "Male",
  },
  {
    email: "prof.smith@example.com",
    name: "Prof. Smith",
    department: "Civil Engineering",
    subject: "Structural Engineering",
    experience: 8,
    gender: "Female",
  },
  {
    email: "prof.jones@example.com",
    name: "Prof. Jones",
    department: "Information Technology",
    subject: "Networking",
    experience: 6,
    gender: "Female",
  },
  {
    email: "prof.brown@example.com",
    name: "Prof. Brown",
    department: "Computer Engineering",
    subject: "Artificial Intelligence",
    experience: 7,
    gender: "Male",
  },
  {
    email: "prof.miller@example.com",
    name: "Prof. Miller",
    department: "Electronics Engineering",
    subject: "Digital Systems",
    experience: 9,
    gender: "Male",
  },
  {
    email: "20sdeveloper4209@gmail.com",
    name: "Developer Faculty",
    department: "Computer Engineering",
    subject: "Web Development",
    experience: 4,
    gender: "Male",
  },
];

// Function to save emails with additional info
const saveEmails = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      "mongodb+srv://theshaikhasif03:fPQSb56RBLe2lG84@cluster1.o65jh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      }
    );

    console.log("Connected to MongoDB");

    // Save student data
    await Promise.all(
      studentData.map((student) =>
        Student.updateOne(
          { email: student.email },
          { $setOnInsert: student }, // Insert only if the email doesn't exist
          { upsert: true } // Insert if not founds
        )
      )
    );
    console.log("All student data saved successfully.");

    // Save faculty data
    await Promise.all(
      facultyData.map((faculty) =>
        Faculty.updateOne(
          { email: faculty.email },
          { $setOnInsert: faculty },
          { upsert: true } // Insert if not found
        )
      )
    );
    console.log("All faculty data saved successfully.");
  } catch (error) {
    console.error("Error saving data:", error);
  } finally {
    mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Execute the function
saveEmails();

import Community from "../../models/community.js";
import User from "../../models/user.js";
import Faculty from "./../../models/pillaiFaculty.js";
import Student from "./../../models/pillaiStudent.js";

export const getUsersWithRole = async (req, res) => {
  try {
    // Fetch all users, faculties, and students
    const users = await User.find({});
    const faculties = await Faculty.find({});
    const students = await Student.find({});

    // Create a map of faculty emails for quick lookup
    const facultyEmails = faculties.reduce((acc, faculty) => {
      acc[faculty.email] = faculty;
      return acc;
    }, {});

    // Create a map of student emails for quick lookup
    const studentEmails = students.reduce((acc, student) => {
      acc[student.email] = student;
      return acc;
    }, {});

    // Transform users, marking them as faculty or student based on email
    const usersWithRole = users.map((user) => {
      if (facultyEmails[user.email]) {
        // If user is a faculty member, add faculty-related details
        return {
          ...user.toObject(),
          role: "faculty",
          facultyDetails: facultyEmails[user.email], // Add faculty details
        };
      } else if (studentEmails[user.email]) {
        // If user is a student, add student-related details
        return {
          ...user.toObject(),
          role: "student",
          studentDetails: studentEmails[user.email], // Add student details
        };
      } else {
        // If neither, just return the user (optional handling for unknown role)
        return {
          ...user.toObject(),
          role: "unknown",
        };
      }
    });

    // Total counts
    const totalUsers = users.length;
    const totalFaculty = faculties.length;
    const totalStudents = students.length;

    // Send the response with users and total counts
    res.status(200).json({
      totalUsers,
      totalFaculty,
      totalStudents,
      users: usersWithRole,
    });
  } catch (error) {
    console.error("Error fetching users with roles and counts:", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
export const getStudents = async (req, res) => {
  try {
    // Fetch all users, faculties, and students
    const users = await User.find({});
    const students = await Student.find({});

    // Create a map of faculty emails for quick lookup

    const studentEmails = students.reduce((acc, student) => {
      acc[student.email] = student;
      return acc;
    }, {});
    // Transform users, marking them as faculty or student based on email
    const usersWithRole = users.map((user) => {
      if (studentEmails[user.email]) {
        // If user is a student, add student-related details
        return {
          ...user.toObject(),
          role: "student",
          studentDetails: studentEmails[user.email], // Add student details
        };
      } else {
        // If neither, just return the user (optional handling for unknown role)
        return {
          ...user.toObject(),
          role: "unknown",
        };
      }
    });
    const totalUsers = users.length;
    const totalStudents = students.length;

    res.status(200).json({
      totalUsers,
      totalStudents,

      users: usersWithRole,
    });
  } catch (error) {
    console.error("Error fetching users with roles and counts:", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
export const getFaculties = async (req, res) => {
  try {
    // Fetch all users, faculties, and students
    const users = await User.find({});
    const faculties = await Faculty.find({});
    const students = await Student.find({});

    // Create a map of faculty emails for quick lookup
    const facultyEmails = faculties.reduce((acc, faculty) => {
      acc[faculty.email] = faculty;
      return acc;
    }, {});

    // Transform users, marking them as faculty or student based on email
    const usersWithRole = users.map((user) => {
      if (facultyEmails[user.email]) {
        // If user is a faculty member, add faculty-related details
        return {
          ...user.toObject(),
          role: "faculty",
          facultyDetails: facultyEmails[user.email], // Add faculty details
        };
      } else {
        return {
          ...user.toObject(),
          role: "unknown",
        };
      }
    });
    const totalUsers = users.length;
    const totalStudents = students.length;
    const totalFaculty = faculties.length;

    res.status(200).json({
      totalUsers,
      totalFaculty,

      users: usersWithRole,
    });
  } catch (error) {
    console.error("Error fetching users with roles and counts:", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const getAllCommunitiesWithUserDetails = async (req, res) => {
  try {
    // Fetch all communities and populate the members, creator, and facultyId fields
    const communities = await Community.find({})
      .populate("members.userId", "username _id imageUrl") // Populate members' username, ID, and imageUrl
      .populate("creator.userId", "username _id imageUrl") // Populate creator's username, ID, and imageUrl
      .populate("facultyId", "username name imageUrl"); // Populate facultyId with fields from the User model

    res.status(200).json(communities);
  } catch (error) {
    console.error("Error fetching communities with user details:", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
export const getApprovedCommunitiesWithUserDetails = async (req, res) => {
  try {
    // Fetch all approved communities and populate the members, creator, and facultyId fields
    const approvedCommunities = await Community.find({ status: "approved" })
      .populate("members.userId", "username _id imageUrl") // Populate members' username, ID, and imageUrl
      .populate("creator.userId", "username _id imageUrl") // Populate creator's username, ID, and imageUrl
      .populate("facultyId", "username name imageUrl"); // Populate facultyId with fields from the User model

    res.status(200).json(approvedCommunities);
  } catch (error) {
    console.error(
      "Error fetching approved communities with user details:",
      error
    );
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
export const getAllCommunitiesWithPosts = async (req, res) => {
  try {
    // Fetch all communities and populate the posts and authors
    const communities = await Community.find({})
      .populate({
        path: "posts.author.id",
        select: "username _id imageUrl", // Adjust the fields to populate as needed
      })
      .populate({
        path: "posts.tags",
        select: "name", // Assuming you have a Tag model with a name field
      });

    res.status(200).json(communities);
  } catch (error) {
    console.error("Error fetching communities with posts:", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

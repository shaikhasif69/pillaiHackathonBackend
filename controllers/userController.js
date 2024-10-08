// import userModel from "../models/user";
import userModel from "../models/user.js";
import UserForm from "../models/userFormScheme.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpModel from "../models/otp.js";
import { sendOTPEmail } from "../helpers/email_sender.js";
import Student from "../models/pillaiStudent.js";
import Faculty from "../models/pillaiFaculty.js";
import User from "../models/user.js";
import cloudinary from "../helpers/cloudinary.js";
import Event from "../models/communityEvents.js";
import Community from "../models/community.js";
import Message from "../models/commitee/committeChat.js";
import Message1 from "../models/studentForum/studentMessage.js";
import Mentor from "../models/mentorship.js";

const SECRET = "PILLAI";

export const signup = async (req, res) => {
  const { email, username, password } = req.body;
  console.log("someone hitting : " + email + " " + password);
  try {
    const existingCollegeStudent = await Student.findOne({ email });
    const existingCollegeFaculty = await Faculty.findOne({ email });
    const existingMentoo = await Mentor.findOne({ email });
    if (!existingCollegeStudent && !existingCollegeFaculty && !existingMentoo) {
      return res.status(400).json({
        message: "you mail not registered with college.Contact Admin",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiration = Date.now() + 10 * 60 * 1000;

    // Store OTP with user data (password stored temporarily)
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password before storing
    await otpModel.create({
      email,
      otp,
      expiration: otpExpiration,
      password: hashedPassword,
      username,
    });

    // Send OTP via email
    await sendOTPEmail(email, otp);

    res.status(200).json({
      message: "OTP sent to your email. Please verify to complete signup.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  console.log("data i am getting: " + email + " " + password);

  try {
    const existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({ message: "user not found" });
    }
    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res.status(404).json({ message: "invalid credetails" });
    }
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      SECRET,
      {
        expiresIn: "30d",
      }
    );
    res.status(201).json({ user: existingUser, token: token });
  } catch (error) {}
};
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpEntry = await otpModel.findOne({ email, otp });
    if (!otpEntry) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if OTP has expired
    if (Date.now() > otpEntry.expiration) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // OTP is valid, create the user using stored password
    const result = await userModel.create({
      email: email,
      password: otpEntry.password, // Use the stored hashed password
      username: otpEntry.username,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, SECRET);

    // Delete OTP after verification
    await otpModel.deleteOne({ email: email });

    res.status(201).json({ user: result, token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const otpEntry = await otpModel.findOne({ email: email });
    if (!otpEntry) {
      return res
        .status(400)
        .json({ message: "No OTP request found for this email" });
    }

    // Generate a new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const newExpiration = Date.now() + 10 * 60 * 1000; // 10-minute expiration

    // Update the OTP and expiration in the database
    otpEntry.otp = newOtp;
    otpEntry.expiration = newExpiration;
    await otpEntry.save();

    // Send the new OTP via email
    await sendOTPEmail(email, newOtp);

    res.status(200).json({ message: "A new OTP has been sent to your email" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to resend OTP. Please try again." });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    // Query to find all users where both username and email exist
    const users = await User.find({
      username: { $exists: true, $ne: null },
      email: { $exists: true, $ne: null },
    });

    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
export const getUserProfileByName = async (req, res) => {
  const { username } = req.params; // Assuming username is passed as a route parameter

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Determine if the user is a student or faculty
    let role = null;
    const faculty = await Faculty.findOne({ email: user.email });
    const student = await Student.findOne({ email: user.email });

    if (faculty) {
      role = "faculty";
    } else if (student) {
      role = "student";
    } else {
      role = "user"; // Default role if not identified as student or faculty
    }

    // Find the communities the user has created
    const createdCommunities = await Community.find({
      "creator.userId": user._id,
    });

    // Find the communities the user has joined
    const joinedCommunities = await Community.find({
      "members.userId": user._id,
    });

    // Respond with the user's details, created communities, joined communities, and role
    res.status(200).json({
      name: user.username,
      email: user.email,
      imageUrl: user.imageUrl,
      role,
      createdCommunities,
      joinedCommunities,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
export const getUserProfile = async (req, res) => {
  const userId = req.userId; // Assuming userId comes from auth middleware
  console.log(userId);
  try {
    // Fetch basic user profile
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch user-related posts
    const posts = await Community.aggregate([
      { $match: { "posts.author.id": userId } },
      { $unwind: "$posts" },
      { $match: { "posts.author.id": userId } },
      {
        $project: {
          _id: "$posts._id",
          content: "$posts.content",
          imageUrl: "$posts.imageUrl",
          createdAt: "$posts.createdAt",
          communityName: "$name",
        },
      },
    ]);

    // Fetch communities created by the user
    const communitiesCreated = await Community.find({
      "creator.userId": userId,
    });

    // Fetch communities the user is a member of
    // const communitiesJoined = await Community.find({
    //   facultyId: userId,

    // });
    // Fetch communities where the user is a member or a faculty
    const communitiesJoined = await Community.find({
      $or: [{ "members.userId": userId }, { facultyId: userId }],
    });

    // Fetch events created by the user
    const events = await Event.find({ "creator.userId": userId });

    // Check if the user is a faculty member
    const faculty = await Faculty.findOne({ email: user.email });
    let facultyDetails = null;
    let studentDetails = null;
    const student = await Student.findOne({ email: user.email });

    if (faculty) {
      facultyDetails = {
        department: faculty.department,
        subject: faculty.subject,
        experience: faculty.experience,
        gender: faculty.gender,
        profession: faculty.profession,
      };
    }
    if (student) {
      studentDetails = {
        address: student.address,
        department: student.department,
        year: student.year,
        handicapped: student.handicapped,
      };
    }

    // Return the user's profile information along with associated data
    res.status(200).json({
      username: user.username,
      email: user.email,
      imageUrl: user.imageUrl,
      facultyDetails, // This will be null if not a faculty member
      studentDetails, // This will be null if not a student
      posts,
      communitiesCreated,
      communitiesJoined,
      events,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
export const editProfile = async (req, res) => {
  const userId = req.userId; // Coming from auth middleware
  const userRole = req.userRole; // Either 'student', 'faculty', or 'mentor'

  // Extract common fields from the request body
  const { username, email } = req.body;
  const file = req.file; // Assuming profile image is uploaded via multer middleware

  let imageUrl = ""; // Initialize imageUrl

  try {
    if (file) {
      // Upload image directly to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream(
            {
              folder: "profile_images", // Adjust the folder name if needed
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

    // Prepare the updates object with common fields (username, email)
    const updates = { username, email };

    if (imageUrl) {
      updates.imageUrl = imageUrl; // Add imageUrl to updates if available
    }

    // Add role-specific fields
    if (userRole === "student") {
      // For student role
      const { preferredSubjects, researchInterest } = req.body;
      updates.studentDetails = {
        preferredSubjects,
        researchInterest,
      };
    } else if (userRole === "faculty") {
      // For faculty role
      const {
        department,
        position,
        coursesYouTeach,
        researchSpecialist,
        currentResearch,
        pastResearch,
      } = req.body;
      updates.facultyDetails = {
        department,
        position,
        coursesYouTeach,
        researchSpecialist,
        currentResearch,
        pastResearch,
      };
    } else if (userRole === "mentor") {
      // For mentor role
      const { currentJob, careerPath, industry, skills, mentoringAreas } =
        req.body;
      updates.mentorshipDetails = {
        currentJob,
        careerPath,
        industry,
        skills,
        mentoringAreas,
      };
    }

    // Find and update the user profile with only the provided fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates }, // Use $set to update only specified fields
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const saveUserForm = async (req, res) => {
  const {
    userId,
    academicStream,
    yearOfStudy,
    academicInterests,
    extracurricularInterests,
    activityPreference,
    timeCommitment,
    communityEngagement,
    communityType,
    leadershipPreference,
    longTermGoal,
    collaborationPreference,
  } = req.body;

  try {
    const userForm = new UserForm({
      userId,
      academicStream,
      yearOfStudy,
      academicInterests,
      extracurricularInterests,
      activityPreference,
      timeCommitment,
      communityEngagement,
      communityType,
      leadershipPreference,
      longTermGoal,
      collaborationPreference,
    });

    // Save the form to the database
    await userForm.save();

    res.status(201).json({
      message: "Form data saved successfully.",
      formData: userForm,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to save form data.",
    });
  }
};

export const getTwoUserChat = async (req, res) => {
  const { userId1, userId2 } = req.query; // Get the two user IDs from the query parameters

  if (!userId1 || !userId2) {
    return res.status(400).json({ error: "Both user IDs are required" });
  }

  try {
    // Create roomId for both possible combinations of userIds
    const roomId1 = `${userId1}_${userId2}`;
    const roomId2 = `${userId2}_${userId1}`;

    // Find messages where roomId matches either combination
    const messages = await Message.find({
      roomId: { $in: [roomId1, roomId2] },
    }).sort({ createdAt: 1 }); // Sort messages by date (oldest to newest)

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ error: "Server error" });
  }
};
export const getMessagesByGroupId = async (req, res) => {
  const { groupId } = req.query; // Assuming groupId is passed as a URL parameter

  try {
    // Fetch all messages for the given groupId, populate the user who sent the message
    const messages = await Message1.find({ group: groupId })
      .populate("user", "username email imageUrl") // Populating user fields
      .populate("voters.user", "username") // Populating voter user details
      .sort({ createdAt: -1 }); // Sorting by the latest message first (optional)

    if (!messages) {
      return res
        .status(404)
        .json({ message: "No messages found for this group" });
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages: ", error);
    res
      .status(500)
      .json({ message: "Error fetching messages", error: error.message });
  }
};

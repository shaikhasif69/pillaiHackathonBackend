// // models/User.js
// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: {
//     type: String,
//     required: true,
//     // minlength: 6,
//     // validate: {
//     //   validator: (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password),
//     //   message: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character"
//     // }
//   },
//   imageUrl: {
//     type: String,
//     default: "", // default placeholder image URL
//   },
//   groups: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "studentGroup",
//     },

//   ],
// });

// const User = mongoose.model("User", userSchema);

// export default User;
// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // General User Fields
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: "", // default placeholder image URL
  },

  // groups: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "studentGroup",
  //   },
  // ],

  // // Common Career Fields for Both Faculty and Students
  // careerPath: {
  //   type: String,
  //   default: "",
  // },
  // field: {
  //   type: String,
  //   default: "",
  // },
  // skills: {
  //   type: [String], // Array of skills
  //   default: [],
  // },
  // mentoringAreas: {
  //   type: [String], // Areas where the user can provide mentoring
  //   default: [],
  // },
  // preferredMenteeProfile: {
  //   type: String,
  //   default: "", // e.g., description of preferred mentee attributes
  // },
  // preferredCommunicationMethod: {
  //   type: String,
  //   default: "", // e.g., Email, Phone, Chat, etc.
  // },
  // timeAvailability: {
  //   type: String,
  //   default: "", // e.g., "Weekdays 9 AM - 5 PM"
  // },
  // mentorshipDetails: {
  //   currentJob: { type: String, default: "" }, // Current job title
  //   careerPath: { type: String, default: "" }, // Career path description
  //   industry: { type: String, default: "" }, // Industry the user is involved in
  //   skills: { type: [String], default: [] }, // Array of skills
  //   mentoringAreas: { type: [String], default: [] }, // Areas where the user can provide mentoring
  // },
  // // Faculty-Specific Fields
  // facultyDetails: {
  //   department: { type: String, default: "" }, // Department the faculty belongs to
  //   position: { type: String, default: "" }, // Faculty's position (e.g., Professor, Lecturer)
  //   coursesYouTeach: { type: [String], default: [] }, // List of courses the faculty teaches
  //   researchSpecialist: { type: String, default: "" }, // Area of research specialization
  //   currentResearch: { type: String, default: "" }, // Description of current research
  //   pastResearch: { type: String, default: "" }, // Description of past research
  // },
});

const User = mongoose.model("User", userSchema);

export default User;

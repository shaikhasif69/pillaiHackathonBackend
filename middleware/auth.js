import jwt from "jsonwebtoken";
import Student from "../models/pillaiStudent.js";
import Faculty from "../models/pillaiFaculty.js";
import Mentor from "../models/mentorship.js";
const SECRET = "PILLAI";

// export const auth = (req, res, next) => {
//   try {
//     let token = req.headers.authorization;
//     if (token) {
//       token = token.split(" ")[1];
//       let user = jwt.verify(token, SECRET);
//       req.userId = user.id;
//     } else {
//       res.status(401).json({ message: "unauthorized user" });
//     }

//     next();
//   } catch (error) {
//     res.status(401).json({ message: "unauthozied usr" });
//   }
// };
export const auth = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (token) {
      token = token.split(" ")[1];
      const user = jwt.verify(token, SECRET);
      req.userId = user.id; // Attach userId from the token

      // Check if the user is a student or faculty
      const student = await Student.findOne({ email: user.email });
      const faculty = await Faculty.findOne({ email: user.email });
      const mentor = await Mentor.findOne({ email: user.email });

      if (student) {
        req.userRole = "student"; // Add role to request object
        req.userDetails = student; // Optionally pass more details if needed
      } else if (faculty) {
        req.userRole = "faculty"; // Add role to request object
        req.userDetails = faculty;
      } else if (mentor) {
        req.userRole = "mentor"; // Add role to request object
        req.userDetails = mentor; // Optionally pass more details if needed
      } else {
        return res.status(401).json({ message: "Unauthorized user" });
      }
    } else {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    next();
  } catch (error) {
    console.log("Authorization error:", error);
    return res.status(401).json({ message: "Unauthorized user" });
  }
};

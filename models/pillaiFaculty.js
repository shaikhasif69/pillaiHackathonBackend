import mongoose from "mongoose";

const FacultySchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  subject: { type: String, required: true },
  experience: { type: Number, required: true },
  gender: { type: String, required: true },   
});

const Faculty = mongoose.model("pillaiFaculty", FacultySchema);

export default Faculty;

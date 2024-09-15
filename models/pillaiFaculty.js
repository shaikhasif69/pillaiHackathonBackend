import mongoose from "mongoose";

const FacultySchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
});

const Faculty = mongoose.model("pillaiFaculty", FacultySchema);

export default Faculty;

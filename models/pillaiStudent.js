import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
});

const Student = mongoose.model("pillaiStudent", studentSchema);

export default Student;

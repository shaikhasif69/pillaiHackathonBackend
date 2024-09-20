import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  //   department: { type: String, required: true },
  //   year: { type: String, required: true },
  //   address: { type: String, required: true },
  //   handicapped: { type: Boolean, default: false },
});

const Mentor = mongoose.model("pillaiMentor", studentSchema);

export default Mentor;

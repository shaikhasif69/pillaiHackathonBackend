import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  mentor_id: { type: String, required: true, unique: true },
  mentor_name: { type: String, required: true },
  category_1: { type: String, required: true },
  category_2: { type: String, required: true },
  category_3: { type: String, required: true },
  //   department: { type: String, required: true },
  //   year: { type: String, required: true },
  //   address: { type: String, required: true },
  //   handicapped: { type: Boolean, default: false },
});

const Mentor = mongoose.model("Mentors", studentSchema);

export default Mentor;

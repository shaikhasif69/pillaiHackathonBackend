import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema({
  mentor_id: Number,
  club_name: String,
  category_1: String,
  category_2: String,
  category_3: String,
});

const Mentor = mongoose.model("mentors", mentorSchema);

export default Mentor;

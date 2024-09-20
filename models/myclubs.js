// models/Club.js
import mongoose from "mongoose";

const clubSchema = new mongoose.Schema({
  club_id: Number,
  club_name: String,
  category_1: String,
  category_2: String,
  category_3: String,
});

const Club = mongoose.model("Club", clubSchema);

export default Club;

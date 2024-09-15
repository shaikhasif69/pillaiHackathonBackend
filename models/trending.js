import mongoose from "mongoose";
const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensures each tag is unique
  },
  usageCount: {
    type: Number,
    default: 0, // Keeps track of tag usage
  },
});

const Tag = mongoose.model("Tag", tagSchema);

export default Tag;

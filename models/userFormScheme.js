import mongoose from "mongoose";

const userFormSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  academicStream: { type: String, required: false },
  yearOfStudy: { type: String, required: false },
  academicInterests: { type: [String], required: false },
  extracurricularInterests: { type: [String], required: false },
  activityPreference: { type: String, required: false },
  timeCommitment: { type: String, required: false },
  communityEngagement: { type: String, required: false },
  communityType: { type: String, required: false },
  leadershipPreference: { type: String, required: false },
  longTermGoal: { type: String, required: false },
  collaborationPreference: { type: String, required: false },
});

const UserForm = mongoose.model("UserForm", userFormSchema);

export default UserForm;

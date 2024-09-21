const AluminiSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  workAt: { type: String, required: true },
  experience: { type: String },
  currentPosition: { type: String },
  gender: { type: String },
});

const Faculty = mongoose.model("pillaiFaculty", AluminiSchema);

export default Faculty;

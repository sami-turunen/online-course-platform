import mongoose from "mongoose";
const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructors: [{ type: Schema.Types.ObjectId, ref: "User" }],
    students: [{ type: Schema.Types.ObjectId, ref: "User" }],
    topics: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
    slug: { type: String, unique: true },
  },
  { timestamps: true },
);

const Course = mongoose.model("Course", courseSchema);
export default Course;

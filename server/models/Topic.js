import mongoose from "mongoose";
const { Schema } = mongoose;

const topicSchema = new Schema(
  {
    title: { type: String, required: true },
    lessons: [{ type: String }],
    courseId: { type: Schema.Types.ObjectId, ref: "Course" },
  },
  { timestamps: true },
);

const Topic = mongoose.model("Topic", topicSchema);
export default Topic;

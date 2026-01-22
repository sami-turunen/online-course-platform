import mongoose from "mongoose";
const { Schema } = mongoose;
import { model } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
  },
  { timestamps: true },
);

const User = model("User", userSchema);
export default User;

import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "./config/db.js";
import User from "./models/User.js";
import Course from "./models/Course.js";
import Topic from "./models/Topic.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 3000;

const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Forbidden", error });
  }
};

connectToDatabase();

app.post("/api/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const existingUser = await User.findOne({
      username,
    });
    if (existingUser) return res.status(400).send("User already exists");

    const hashedPassword = bcrypt.hashSync(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered!" });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compareSync(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
});

const slugify = (text) => text.toLowerCase().replace(/\s+/g, "-");

app.post("/api/courses", authenticate, async (req, res) => {
  try {
    const { title, description, instructorId } = req.body;
    const courseExists = await Course.findOne({ title });
    if (courseExists)
      return res.status(400).json({ message: "Course already exists" });
    const course = await Course.create({
      title,
      description,
      instructors: [instructorId],
      slug: slugify(title),
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: "Course creation failed", error });
  }
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });
  res.json({ message: "Logged out" });
});

app.get("/api/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user", error });
  }
});

app.get("/api/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courses", error });
  }
});

app.get("/api/courses/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({ slug }).populate("topics");
    res.status(200).json({ course });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch course", error });
  }
});

app.post("/api/courses/:courseId/topics", authenticate, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title } = req.body;

    const topic = await Topic.create({
      title,
      lessons: [],
      course: courseId,
    });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.topics.push(topic._id);
    await course.save();

    // Populate topics so frontend gets full objects
    const populatedCourse = await Course.findById(courseId).populate("topics");

    res.status(201).json({ topic, course: populatedCourse });
  } catch (error) {
    res.status(500).json({ message: "Failed to create topic", error });
  }
});

app.get("/api/topics/:topicId", async (req, res) => {
  try {
    const { topicId } = req.params;
    const topic = await Topic.findById(topicId);
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    res.status(200).json({ topic });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch topic", error });
  }
});

app.post("/api/topics/:topicId/lessons", authenticate, async (req, res) => {
  try {
    const { topicId } = req.params;
    const { title, content } = req.body;

    const topic = await Topic.findById(topicId);
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    const lesson = { title, content };
    topic.lessons.push(lesson);
    await topic.save();
    res.status(201).json({ topic });
  } catch (error) {
    res.status(500).json({ message: "Failed to create lesson", error });
  }
});

app.get("/api/courses/:courseId/topics", async (req, res) => {
  try {
    const { courseId } = req.params;
    const topics = await Topic.find({ course: courseId });
    res.status(200).json({ topics });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch topics", error });
  }
});

app.post("/api/courses/reset", async (req, res) => {
  try {
    await Course.deleteMany({});
    res.status(200).json({ message: "Courses reset" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reset courses", error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./index.css";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import Login from "./components/Login";
import Courses from "./components/Courses";
import CoursePage from "./components/CoursePage";
import TopicPage from "./components/TopicPage";

function App() {
  const [user, setUser] = useState(null); // state to store user data
  // Fetch user from backend
  const fetchUser = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/me", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  return (
    // Routes
    <Routes>
      {/* SignUp page */}
      <Route path="/signup" element={<SignUp />} />

      {/* Home page */}
      <Route
        path="/"
        element={<Home user={user} fetchUser={fetchUser} setUser={setUser} />}
      />

      {/* Login page */}
      <Route path="/login" element={<Login setUser={setUser} />} />

      {/* Courses page */}
      <Route
        path="/courses"
        element={<Courses user={user} fetchUser={fetchUser} />}
      />

      {/* Specific course page */}
      <Route
        path="/courses/:slug"
        element={<CoursePage user={user} fetchUser={fetchUser} />}
      />

      {/* Specific topic page */}
      <Route
        path="/topics/:topicId"
        element={<TopicPage user={user} fetchUser={fetchUser} />}
      />
    </Routes>
  );
}

export default App;

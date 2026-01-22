import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./index.css";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import Login from "./components/Login";
import Courses from "./components/Courses";
import CoursePage from "./components/CoursePage";
import TopicPage from "./components/TopicPage";

function App() {
  const [user, setUser] = useState(null);
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
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/"
        element={<Home user={user} fetchUser={fetchUser} setUser={setUser} />}
      />
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route
        path="/courses"
        element={<Courses user={user} fetchUser={fetchUser} />}
      />
      <Route
        path="/courses/:slug"
        element={<CoursePage user={user} fetchUser={fetchUser} />}
      />
      <Route
        path="/topics/:topicId"
        element={<TopicPage user={user} fetchUser={fetchUser} />}
      />
    </Routes>
  );
}

export default App;

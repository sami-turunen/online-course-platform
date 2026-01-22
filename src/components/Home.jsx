import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";

export default function Home({ user, fetchUser, setUser }) {
  const navigate = useNavigate();
  useEffect(() => {
    fetchUser();
  }, []);
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      alert("You have been logged out.");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleCourses = () => {
    navigate("/courses");
  };

  return user ? (
    <div className="home">
      <h1>Welcome to the Home Page</h1>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleCourses}>Courses</button>
      <p>Logged in as: {user.username}</p>
    </div>
  ) : (
    <>
      <h1>Please login or sign up</h1>
      <Login setUser={setUser} />
      <SignUp />
    </>
  );
}

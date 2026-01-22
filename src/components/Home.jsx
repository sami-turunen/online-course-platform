import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";

export default function Home({ user, fetchUser, setUser }) {
  const navigate = useNavigate(); // Navigation
  // Fetch user on mount
  useEffect(() => {
    fetchUser();
  }, []);

  // Handle logging out
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

  // Handle course navigation
  const handleCourses = () => {
    navigate("/courses");
  };

  // Render home page if user is logged in, else render message and login form
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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignUp.css";

export default function SignUp() {
  const [username, setUsername] = useState(""); // Username, empty string at first
  const [email, setEmail] = useState(""); // Email, empty string at first
  const [password, setPassword] = useState(""); // Password, empty string at first
  const navigate = useNavigate(); // Navigation

  // Handle form submission (registration)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();
      console.log("Registration successful:", data);
      navigate("/login");
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <>
      <h1>Sign Up</h1>
      {/* Registration form */}
      <form onSubmit={handleSubmit}>
        <label>Username: </label>
        {/* Username input field */}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <label>Email: </label>
        {/* Email input field */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <label>Password: </label>
        {/* Password input field */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        {/* Submit button */}
        <button type="submit">Register</button>
      </form>
    </>
  );
}

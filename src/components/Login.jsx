import { useState } from "react";

import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [username, setUsername] = useState(""); // Username, empty string at first
  const [password, setPassword] = useState(""); // Password, empty string at first
  const navigate = useNavigate(); // Navigation

  // Handle form submission (login)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      console.log("Login successful:", data);
      setUser(data.user);
      navigate("/");
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>Username: </label>
        {/* Input field for username */}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Password: </label>
        {/* Input field for password */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {/* Login button */}
        <button type="submit">Login</button>
      </form>
    </>
  );
}

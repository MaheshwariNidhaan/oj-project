import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance"; // Import the axios instance

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        navigate.push("/");
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error("Error logging in", error);
    }
  };

  const handleSignupClick = () => {
    navigate("/signup"); // Redirect to the signup page
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>

        {/* Add the "Don't have an account?" button */}
        <button onClick={handleSignupClick}>Don't have an account?</button>
      </form>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css"; // Importing styles
import Cookies from "js-cookie";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const response = await axios.post("http://localhost:3000/signup", {
        name,
        email,
        password,
      });

      if (response.status === 200) {
        Cookies.set("token", response.data.token, { secure: false }); // Store token in cookies
        navigate("/"); // Redirect to a protected route
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.data.errors[0]) {
        if(err.response.data.errors[0].password){
            setError(err.response.data.errors[0].password);
        }
      } else {
        console.log(err.response.data.errors[0].password)
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSignup}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Sign Up</button>
      </form>

      {/* Link to Login Page */}
      <p className="login-link">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;

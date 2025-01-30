import React from "react";
import { Link } from "react-router-dom";
import "./Error.css"; // Importing styles

const Error = () => {
  return (
    <div className="error-container">
      <h1>404</h1>
      <h2>Oops! Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="home-link">Go to Home</Link>
    </div>
  );
};

export default Error;

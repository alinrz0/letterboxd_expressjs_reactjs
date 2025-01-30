import "./Header.css"; // Import CSS for styling
import Icon from "../assets/icons/Icon.svg";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/profile", {
          withCredentials: true, // Ensure cookies are sent
        });
        setUser(response.data.profile.name); // Store user data
      } catch (error) {
        setUser(null); // If error, assume not logged in
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    // Get the checkbox toggle element
    const darkModeToggle = document.getElementById("header-toggle");

    const applyDarkMode = () => {
      const root = document.getElementById("root");
      if (darkModeToggle.checked) {
        root.classList.add("dark-mode");
      } else {
        root.classList.remove("dark-mode");
      }
    };

    // Listen for changes on the toggle
    darkModeToggle.addEventListener("change", applyDarkMode);

    // Cleanup event listener on component unmount
    return () => {
      darkModeToggle.removeEventListener("change", applyDarkMode);
    };
  }, []);

  return (
    <>
      <input type="checkbox" id="header-toggle" hidden />

      <header>
        <div className="logo-container">
          <label className="logo">
            <img src={Icon} alt="Icon" className="logo-icon" />
            <h1>LetterBOXD</h1>
          </label>
        </div>

        <input type="checkbox" id="nav-toggle" className="nav-toggle" />
        <label htmlFor="nav-toggle" className="hamburger-menu">
          <span></span>
          <span></span>
          <span></span>
        </label>

        <nav className="links-container">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About Us</Link>
          <Link to="/services" className="nav-link">Services</Link>
          <Link to="/contact" className="nav-link">Contact Us</Link>

          {user ? (
            <span className="nav-link">profile</span> // Show user name if logged in
          ) : (
            <Link to="/login" className="nav-link">Login</Link> // Show login link if not logged in
          )}

          <label htmlFor="header-toggle" className="dark-mode-toggle">
            <i className="fas fa-sun mode-icon sun"></i>
            <i className="fas fa-moon mode-icon moon"></i>
          </label>
        </nav>
      </header>
    </>
  );
};

export default Header;

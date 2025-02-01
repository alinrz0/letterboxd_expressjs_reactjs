import "./Header.css"; 
import Icon from "../assets/icons/Icon.svg";
import { Link ,useNavigate } from "react-router-dom";
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

    // Logout Function
    const handleLogout = async () => {
      try {
        await axios.post("http://localhost:3000/logout", {}, { withCredentials: true });
        setUser(null); // Clear user state
        navigate("/"); 
        window.location.reload();
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };

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
          <Link to="/find-friend" className="nav-link">Find friend</Link>
          <Link to="/requests" className="nav-link">Requests</Link>
          <Link to="/contact" className="nav-link">Contact Us</Link>

          {user ? (
             <>
             <Link to="/profile" className="nav-link">Profile</Link>
             <Link className="nav-link" onClick={handleLogout}>Logout</Link>
           </>
             
          ) : (
            <Link to="/login" className="nav-link">Login</Link> 
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

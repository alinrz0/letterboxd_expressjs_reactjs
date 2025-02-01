import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // For navigation
import axios from "axios";
import "./Profile.css"; 

const Profile = () => {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Navigation hook

  // Fetch user profile data
  const fetchProfile = async () => {
    try {
      const response = await axios.get("http://localhost:3000/profile", {
        withCredentials: true, // Ensure cookies are sent
      });
      setUser(response.data.profile);
      setReviews(response.data.reviews);
    } catch (err) {
      setError("You need to log in to view your profile.");
      navigate("/login"); // Redirect to login after 2 sec
    }
  };

  // Load profile and related data when component mounts
  useEffect(() => {
    fetchProfile();
    setLoading(false);
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="profile-container">
      
      {/* Profile Header (User Info + Connections) */}
      <div className="profile-header">
        {/* User Info */}
        {user && (
          <div className="profile-info">
            <h3>{user.name}</h3>
            <p>Email: {user.email}</p>
          </div>
        )}

        {/* Connections (Now next to the Top) */}
        <div className="profile-connections">
          <p>
            <Link to="/followers" className="link">Followers</Link>
          </p>
          <p>
            <Link to="/following" className="link">Following</Link>
          </p>
        </div>
      </div>

      {/* User Reviews */}
      <div className="profile-section">
        <h3>My Reviews</h3>
        {reviews.length > 0 ? (
          <ul className="review-list">
            {reviews.map((review, index) => (
              <Link key={index} to={`/movie/${review.movie_id}`} className="review-card">
                <img src={`http://localhost:3000/movies/movie/image?name=${review.poster.replace("src\\images\\", "")}` || "https://via.placeholder.com/100"} alt="Movie Poster" className="review-poster" />
                <div className="review-details">
                  <h4>{review.title} ({review.year})</h4>
                  <p><strong>Rating:</strong> {review.rating}/5</p>
                  <p><strong>Review:</strong> {review.review}</p>
                </div>
              </Link>
            ))}
          </ul>
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;

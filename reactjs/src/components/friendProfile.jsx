import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation  } from "react-router-dom"; // For navigation
import axios from "axios";
import "./Profile.css";

const FriendProfile = () => {
  const [friend, setFriend] = useState(null); // Friend's profile data
  const [reviews, setReviews] = useState([]); // Reviews of the friend
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate(); // Navigation hook

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search); 
  const email = queryParams.get('email');
  // Fetch friend's profile data
  const fetchFriendProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/review?email=${email}`, {
        withCredentials: true, // Ensure cookies are sent
      });
      console.log(response)
      setFriend(response.data.friend); // Set friend's profile data
      setReviews(response.data.reviews); // Set friend's reviews
    } catch (err) {
      setError("Failed to fetch friend's profile data.");
      navigate("/following"); // Redirect to login if there's an error
    } finally {
      setLoading(false);
    }
  };

  // Load friend's profile and related data when component mounts
  useEffect(() => {
    fetchFriendProfile();
  }, [email]);

  if (loading) return <p>Loading friend's profile...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="profile-container">
      {/* Profile Header (Friend Info + Connections) */}
      <div className="profile-header">
        {/* Friend Info */}
        {friend && (
          <div className="profile-info">
            <h3>{friend.name}</h3>
            <p>Email: {friend.email}</p>
          </div>
        )}

      </div>

      {/* Friend's Reviews */}
      <div className="profile-section">
        <h3>{friend ? `${friend.name}'s Reviews` : "Friend's Reviews"}</h3>
        {reviews.length > 0 ? (
          <ul className="review-list">
            {reviews.map((review, index) => (
              <Link key={index} to={`/movie/${review.movie_id}`} className="review-card">
                <img
                  src={`http://localhost:3000/movies/movie/image?name=${review.movie.poster.replace("src\\images\\", "")}` || "https://via.placeholder.com/100"}
                  alt="Movie Poster"
                  className="review-poster"
                />
                <div className="review-details">
                  <h4>{review.movie.title} ({review.movie.year})</h4>
                  <p><strong>Rating:</strong> {review.rating}/5</p>
                  <p><strong>Review:</strong> {review.review}</p>
                </div>
              </Link>
            ))}
          </ul>
        ) : (
          <p>{friend ? "No reviews yet." : "Friend has no reviews."}</p>
        )}
      </div>
    </div>
  );
};

export default FriendProfile;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserX } from "lucide-react"; // For unfollow button icon
import "./Following.css"; // Add appropriate CSS for styling

const Following = () => {
  const [following, setFollowing] = useState([]); // Users the current user is following
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();

  // Fetch the list of users the logged-in user is following
  const fetchFollowing = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:3000/friend/following", {
        withCredentials: true, // Ensure cookies are sent
      });
      setFollowing(response.data.following); // Assuming the API returns a list of users the logged-in user is following
    } catch (err) {
      setError("Failed to fetch following list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowing(); // Fetch the list of followed users when the component mounts
  }, []);

  // Function to unfollow a user
  const unfollow = async (email) => {
    try {
      await axios.put(
        `http://localhost:3000/friend/delete-connection/following?email=${email}`,
        {}, // Empty body as no data is needed
        { withCredentials: true }
      );
      setFollowing((prev) => prev.filter((user) => user.email !== email)); // Remove unfollowed user from the list
      alert("You have unfollowed the user!");
    } catch (err) {
      console.error("Error unfollowing user:", err);
      alert("Failed to unfollow the user.");
    }
  };

  // Navigate to the profile of the followed user
  const viewProfile = (email) => {
    navigate(`/profile/${email}`); // Assuming you have a route for the user's profile
  };

  return (
    <div className="following-container">
      <h2>Users You Are Following</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="following-list">
        {following.length === 0 ? (
          <p>You are not following anyone yet.</p>
        ) : (
          following.map((user) => (
            <div key={user.email} className="following-card">
              <div className="following-info">
                <p>{user.name}</p>
                <p>{user.email}</p>
              </div>
              <div className="following-actions">
                <button
                  className="view-profile-button"
                  onClick={() => viewProfile(user.email)}
                >
                  View Profile
                </button>
                <button
                  className="unfollow-button"
                  onClick={() => unfollow(user.email)}
                >
                  <UserX className="icon" />
                  Unfollow
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Following;

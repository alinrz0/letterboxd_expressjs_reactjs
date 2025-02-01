import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Followers.css"; // Import styles

const Followers = () => {
  const [followers, setFollowers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/friend/followers", {
          withCredentials: true, // Ensures cookies are sent
        });
        setFollowers(response.data.followers); // Set followers list
      } catch (err) {
        setError("You need to log in to view your followers.");
        navigate("/login"); // Redirect to login after 2 seconds
        
      }
    };

    fetchFollowers();
  }, [navigate]);

  // Function to delete a follower
  const handleDelete = async (followerEmail) => {
    try {
      await axios.put(`http://localhost:3000/friend/delete-connection/follower?email=${followerEmail}`, 
      {},
        {
        withCredentials: true,
      });
      setFollowers(followers.filter((follower) => follower.email !== followerEmail)); // Update UI
    } catch (error) {
      console.error("Error deleting follower:", error);
    }
  };

  return (
    <div className="followers-container">
      <h2>Followers</h2>
      {error && <p className="error">{error}</p>}
      {followers.length === 0 ? (
        <p className="no-followers">You have no followers.</p>
      ) : (
        <div className="followers-grid">
          {followers.map((follower) => (
            <div key={follower.id} className="follower-card">
              <div className="avatar">
                {follower.name.charAt(0).toUpperCase()}
              </div>
              <div className="follower-details">
                <p className="follower-name">{follower.name}</p>
                <p className="follower-email">{follower.email}</p>
              </div>
              <button className="remove-btn" onClick={() => handleDelete(follower.email)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Followers;

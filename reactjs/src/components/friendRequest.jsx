import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserCheck, UserX } from "lucide-react"; // Icons for accepting and rejecting
import "./friendRequest.css"; // Import CSS for styling

const FriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the list of friend requests from the server
  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get("http://localhost:3000/friend/friend-requests", {
        withCredentials: true, // Ensure cookies are sent
      });
      setFriendRequests(response.data.requests); // Assuming response.data.requests contains the list
    } catch (err) {
      setError("Failed to load friend requests.");
    } finally {
      setLoading(false);
    }
  };

  // Accept a friend request
  const acceptRequest = async (friendEmail) => {
    try {
      await axios.put(
        "http://localhost:3000/friend/accept-friend",
        { email: friendEmail },
        { withCredentials: true }
      );
      setFriendRequests(friendRequests.filter((request) => request.email !== friendEmail)); // Remove accepted request
      alert("Friend request accepted!");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        alert(`Failed to accept request: ${err.response.data.message}`);
      } else {
        alert("Failed to accept request: An unknown error occurred");
      }
    }
  };

  // Reject a friend request
  const rejectRequest = async (friendEmail) => {
    try {
      await axios.put(
        "http://localhost:3000/friend/reject-friend",
        { email: friendEmail },
        { withCredentials: true }
      );
      setFriendRequests(friendRequests.filter((request) => request.email !== friendEmail)); // Remove rejected request
      alert("Friend request rejected!");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        alert(`Failed to reject request: ${err.response.data.message}`);
      } else {
        alert("Failed to reject request: An unknown error occurred");
      }
    }
  };

  // Fetch the requests when the component mounts
  useEffect(() => {
    fetchFriendRequests();
  }, []);

  return (
    <div className="friend-requests-container">
      <h2>Friend Requests</h2>

      {/* Show loading message if data is loading */}
      {loading && <p>Loading friend requests...</p>}

      {/* Show error message if there is an error */}
      {error && <p className="error-message">{error}</p>}

      {/* Display the friend requests */}
      {friendRequests.length > 0 ? (
        <ul className="friend-requests-list">
          {friendRequests.map((request) => (
            <li key={request.senderEmail} className="friend-request-item">
              <p>{request.senderName} ({request.senderEmail})</p>
              <button
                className="accept-request-button"
                onClick={() => acceptRequest(request.senderEmail)}
              >
                <UserCheck className="icon" />
                Accept
              </button>
              <button
                className="reject-request-button"
                onClick={() => rejectRequest(request.senderEmail)}
              >
                <UserX className="icon" />
                Reject
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No friend requests.</p>
      )}
    </div>
  );
};

export default FriendRequests;

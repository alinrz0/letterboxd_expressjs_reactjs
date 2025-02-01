import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserCheck, UserX } from "lucide-react"; // Icons for accept/reject
import "./friendRequest.css"; // Import styles

const FriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState({}); // Track individual request states

  // Fetch the list of friend requests
  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get("http://localhost:3000/friend/friend-requests", {
          withCredentials: true, // Ensure cookies are sent
        });
        setFriendRequests(response.data.requests || []);
      } catch (err) {
        setError("Failed to load friend requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchFriendRequests();
  }, []);

  // Handle accepting a request
  const handleRequest = async (friendEmail, action) => {
    setProcessing((prev) => ({ ...prev, [friendEmail]: true })); // Set processing state

    try {
      await axios.put(
        `http://localhost:3000/friend/${action}-friend`,
        { email: friendEmail },
        { withCredentials: true }
      );
      setFriendRequests((prev) => prev.filter((req) => req.senderEmail !== friendEmail)); // Remove from UI
    } catch (err) {
      alert(`Failed to ${action} request: ${err.response?.data?.message || "Unknown error"}`);
    } finally {
      setProcessing((prev) => ({ ...prev, [friendEmail]: false })); // Reset processing state
    }
  };

  return (
    <div className="friend-requests-container">
      <h2>Friend Requests</h2>

      {loading && <p>Loading friend requests...</p>}
      {error && <p className="error-message">{error}</p>}

      {friendRequests.length > 0 ? (
        <ul className="friend-requests-list">
          {friendRequests.map((request) => (
            <li key={request.senderEmail} className="friend-request-item">
              <p>{request.senderName} ({request.senderEmail})</p>
              <button
                className="accept-request-button"
                onClick={() => handleRequest(request.senderEmail, "accept")}
                disabled={processing[request.senderEmail]}
              >
                <UserCheck className="icon" />
                {processing[request.senderEmail] ? "Accepting..." : "Accept"}
              </button>
              <button
                className="reject-request-button"
                onClick={() => handleRequest(request.senderEmail, "reject")}
                disabled={processing[request.senderEmail]}
              >
                <UserX className="icon" />
                {processing[request.senderEmail] ? "Rejecting..." : "Reject"}
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

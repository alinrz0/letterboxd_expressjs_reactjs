import React, { useState, useEffect } from "react";
import { Search, UserPlus, UserX } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Use useNavigate from react-router-dom v6
import "./FindFriend.css"; // Import CSS for styling

const FindFriend = () => {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [friendRequestStatus, setFriendRequestStatus] = useState(null); // Track friend request status
  const navigate = useNavigate(); // Initialize navigate for redirection

  // Check if the user is authenticated using the profile API
  const checkAuthentication = async () => {
    try {
      const response = await axios.get("http://localhost:3000/profile", {
        withCredentials: true, // Ensure cookies are sent
      });

      // If the API responds with a valid user profile, then the user is authenticated
      console.log(response.data)
      if (response.data.profile) {
        return true; // User is authenticated
      }
    } catch (err) {
      // If the request fails, the user is not authenticated
      console.error("Not authenticated:", err);
    }

    return false; // User is not authenticated
  };

  // Check authentication when the component mounts
  useEffect(() => {
    const checkUserAuthentication = async () => {
      const isAuthenticated = await checkAuthentication();
      if (!isAuthenticated) {
        navigate("/login"); // Redirect to login page if not authenticated
      }
    };

    checkUserAuthentication(); // Call the function to check if the user is authenticated
  }, [navigate]); // Run only once on component mount, and include navigate as a dependency

  // Function to search for a user
  const searchUser = async () => {
    if (!email) return;
    setLoading(true);
    setError(null);
    setUser(null);
    setFriendRequestStatus(null); // Reset friend request status

    try {
      const response = await axios.get(`http://localhost:3000/users?email=${email}`);
      setUser(response.data);

      const friendRequestResponse = await axios.get(
        `http://localhost:3000/friend/request-status?email=${response.data.email}`,
        { withCredentials: true }
      );
      setFriendRequestStatus(friendRequestResponse.data.status); 
    } catch (err) {
      setError("User not found");
    } finally {
      setLoading(false);
    }
  };

  // Function to send a friend request
  const sendFriendRequest = async () => {
    if (!user) return;
    try {
      await axios.post(
        "http://localhost:3000/friend/add-friend",
        { friend_email: user.email },
        { withCredentials: true }
      );
      setFriendRequestStatus('W'); // Update the request status to 'W' (Waiting)
      alert("Friend request sent!");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        alert(`Failed to send request: ${err.response.data.message}`);
      } else {
        alert("Failed to send request: An unknown error occurred");
      }
    }
  };

  // Function to delete a friend request
  const deleteFriendRequest = async () => {
    if (!user) return;
    try {
      await axios.delete(
        `http://localhost:3000/friend/delete-request`,
        { data: { friend_email: user.email }, withCredentials: true }
      );
      setFriendRequestStatus('none'); // Reset request status to 'none'
      alert("Friend request deleted!");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        alert(`Failed to delete request: ${err.response.data.message}`);
      } else {
        alert("Failed to delete request: An unknown error occurred");
      }
    }
  };

  const unfollow = async () => {
    if (!user) return;
    try {
      console.log(email);
      // Make sure to include withCredentials: true to send cookies
      await axios.put(
        `http://localhost:3000/friend/delete-connection/following?email=${email}`,
        {}, // Include an empty body if not needed
        { withCredentials: true } // Make sure cookies are sent along with the request
      );
      setFriendRequestStatus('none'); // Reset request status to 'none' after unfollow
      alert("Unfollowed user!");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        alert(`Failed to unfollow: ${err.response.data.message}`);
      } else {
        alert("Failed to unfollow: An unknown error occurred");
      }
    }
  };

  return (
    <div className="find-friend-container">
      <h2>Find a Friend</h2>

      {/* Email Input Box */}
      <input
        type="email"
        className="email-input"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Search Button */}
      <button className="search-button" onClick={searchUser} disabled={loading}>
        <Search className="icon" />
        Search
      </button>

      {error && <p className="error-message">{error}</p>}

      {user && (
        <div className="user-card">
          <p>{user.name} ({user.email})</p>

          {/* Conditional Button: Send Friend Request, Delete Request, or Unfollow */}
          {friendRequestStatus === 'W' ? (
            <button className="delete-friend-request-button" onClick={deleteFriendRequest}>
              <UserX className="icon" />
              Delete Friend Request
            </button>
          ) : friendRequestStatus === 'A' ? (
            <button className="delete-friend-request-button" onClick={unfollow}>
              <UserX className="icon" />
              Unfollow
            </button>
          ) : (
            <button className="add-friend-button" onClick={sendFriendRequest}>
              <UserPlus className="icon" />
              Add Friend
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FindFriend;

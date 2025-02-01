import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./adminDashboard.css"; // Import updated CSS

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminToken();
  }, []);

  const fetchAdminToken = async () => {
    try {
      const response = await axios.get("http://localhost:3000/admin", { withCredentials: true });
      if (response.data.admin_token) {
        fetchDashboardData();
      } else {
        navigate("/admin/login");
      }
    } catch (error) {
      console.error("Error fetching admin token:", error);
      navigate("/admin/login");
    }
  };

  const fetchDashboardData = async () => {
    try {
      const usersRes = await axios.get("http://localhost:3000/admin/users", { withCredentials: true });
      const moviesRes = await axios.get("http://localhost:3000/movies");
      const reviewsRes = await axios.get("http://localhost:3000/admin/reviews", { withCredentials: true });

      setUsers(usersRes.data.users);
      setMovies(moviesRes.data);
      setReviews(reviewsRes.data.reviews);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await axios.delete(`http://localhost:3000/admin/users/${id}`, { withCredentials: true });
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const handleUpdateUser = async (id, name, email) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/admin/users/${id}`,
        { name, email },
        { withCredentials: true }
      );
  
      if (response.status === 200) {
        alert("User updated successfully!");
        fetchDashboardData(); // Refresh data after update
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. user with this email  already exsist");
    }
  };
  

  const handleDeleteMovie = async (id) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      await axios.delete(`http://localhost:3000/admin/movie/${id}`, { withCredentials: true });
      setMovies(movies.filter(movie => movie.id !== id));
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      await axios.delete(`http://localhost:3000/admin/reviews/${id}`, { withCredentials: true });
      setReviews(reviews.filter(review => review.id !== id));
    }
  };

  const handleAddMovie = () => {
    navigate("/admin/add-movie");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <div className="dashboard-sections">
        {/* Users Management */}
        <div className="section">
          <h3>Users</h3>
          <ul>
            {users.map(user => (
              <li key={user.id}>
                <div className="user-inputs">
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => {
                      const updatedUsers = users.map(u => 
                        u.id === user.id ? { ...u, name: e.target.value } : u
                      );
                      setUsers(updatedUsers);
                    }}
                  />
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => {
                      const updatedUsers = users.map(u => 
                        u.id === user.id ? { ...u, email: e.target.value } : u
                      );
                      setUsers(updatedUsers);
                    }}
                  />
                </div>
                <div className="user-buttons">
                  <button className="update-btn" onClick={() => handleUpdateUser(user.id, user.name, user.email)}>
                    Update
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteUser(user.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Movies Management */}
        <div className="section">
          <h3>Movies</h3>
          <button className="add-movie-btn" onClick={handleAddMovie}>Add Movie</button>
          <ul>
            {movies.map(movie => (
              <li key={movie.id}>
                {movie.title} ({movie.year})
                <button className="delete-btn" onClick={() => handleDeleteMovie(movie.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Reviews Management */}
        <div className="section">
          <h3>Reviews</h3>
          <ul>
            {reviews.map(review => (
              <li key={review.id}>
                "{review.review}" by {review.user_id}
                <button className="delete-btn" onClick={() => handleDeleteReview(review.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

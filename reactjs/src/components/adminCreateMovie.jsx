import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminCreateMovie.css";
import noImage from "../assets/no_image.jpg";

const AdminCreateMovie = () => {
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState("");
  const [poster, setPoster] = useState(null);
  const [images, setImages] = useState([]);
  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useState("");

  useEffect(() => {
    fetchAdminToken();
    fetchGenres();
  }, []);

  const fetchAdminToken = async () => {
    try {
      const response = await axios.get("http://localhost:3000/admin", { withCredentials: true });
      if (!response.data.admin_token) {
        navigate("/admin/login");
      }
    } catch (error) {
      console.error("Error fetching admin token:", error);
      navigate("/admin/login");
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get("http://localhost:3000/movies/genres");
      setGenres(response.data); // Assuming the response contains a list of genres
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  const handlePosterChange = (event) => {
    setPoster(event.target.files[0]);
  };

  const handleImagesChange = (event) => {
    setImages([...event.target.files]);
  };

  const handleCreateMovie = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("year", year);
      formData.append("genre", genre); // Add genre to form data
      if (poster) formData.append("poster", poster);
      images.forEach((image) => formData.append("images", image));

      await axios.post("http://localhost:3000/admin/movie", formData, { withCredentials: true });

      alert("Movie created successfully!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error creating movie:", error);
      alert("Error creating movie.");
    }
  };

  return (
    <div className="admin-movie-create">
      <h2>Create New Movie</h2>

      <div className="create-form">
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

        <label>Year:</label>
        <input type="number" value={year} onChange={(e) => setYear(e.target.value)} />

        <label>Genre:</label>
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">Select Genre</option>
          {genres.map((g) => (
            <option key={g.id} value={g.name}>
              {g.name}
            </option>
          ))}
        </select>

        <h3>Upload Poster</h3>
        <input type="file" accept="image/*" onChange={handlePosterChange} />

        <h3>Upload Movie Images</h3>
        <input type="file" accept="image/*" multiple onChange={handleImagesChange} />

        <button onClick={handleCreateMovie} className="create-btn">Create Movie</button>
      </div>
    </div>
  );
};

export default AdminCreateMovie;

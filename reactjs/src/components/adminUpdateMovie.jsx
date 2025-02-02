import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams ,useNavigate} from "react-router-dom";
import "./AdminUpdateMovie.css";
import noImage from "../assets/no_image.jpg";

const AdminUpdateMovie = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Editable fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState("");
  const [poster, setPoster] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [genre, setGenre] = useState("");
  const [genresList, setGenresList] = useState([]);



  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get("http://localhost:3000/movies/genres");
        setGenresList(response.data);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, []);
  
  useEffect(() => {
    fetchAdminToken();
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
  useEffect(() => {
    const fetchMovieDetail = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/movies/${id}`);
        const movieData = response.data.movie;
        const movieImages = response.data.images || [];

        const modifiedMovie = {
          ...movieData,
          poster: movieData.poster
            ? `http://localhost:3000/movies/movie/image?name=${movieData.poster.replace("src\\images\\", "")}`
            : noImage,
        };

        const modifiedImages = movieImages.map((img) =>
          `http://localhost:3000/movies/movie/image?name=${img.replace("src\\images\\", "")}`
        );

        setMovie(modifiedMovie);
        setImages(modifiedImages);
        setTitle(movieData.title);
        setDescription(movieData.description);
        setYear(movieData.year);
        setGenre(movieData.genre || "");
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
      setLoading(false);
    };

    fetchMovieDetail();
  }, [id]);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Handle poster file selection
  const handlePosterChange = (event) => {
    setPoster(event.target.files[0]);
  };

  // Handle new images selection
  const handleNewImagesChange = (event) => {
    setNewImages([...event.target.files]);
  };

  // Update movie details
  const handleUpdateMovie = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("year", year);
      formData.append("genre", genre);
      if (poster) {
        formData.append("poster", poster);
      }

      await axios.put(`http://localhost:3000/admin/movie/${id}`, formData, 
        { withCredentials: true },
      );

      alert("Movie details updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating movie details:", error);
      alert("Error updating movie details.");
    }
  };

  // Upload new images
  const handleUploadImages = async () => {
    if (newImages.length === 0) {
      alert("Please select images to upload.");
      return;
    }

    try {
      const formData = new FormData();
      newImages.forEach((image) => formData.append("images", image));

      await axios.post(`http://localhost:3000/admin/movie/${id}/images`, formData, 
        { withCredentials: true },
      );

      alert("Images uploaded successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Error uploading images.");
    }
  };

  // Delete an image
  const handleDeleteImage = async (imageUrl) => {
    try {
      const imageName = imageUrl.replace("http://localhost:3000/movies/movie/image?name=","src\\images\\");
      console.log(imageName)
      console.log(id)
      await axios.delete(`http://localhost:3000/admin/movie/${id}/images?name=${imageName}`,{ withCredentials: true },);
      alert("Image deleted successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Error deleting image.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="admin-movie-detail">
      {movie ? (
        <>
          <h2>Edit Movie Details</h2>

          <div className="edit-form">
            <label>Title:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />

            <label>Description:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

            <label>Year:</label>
            <input type="number" value={year} onChange={(e) => setYear(e.target.value)} />

            <label>Genre:</label>
            <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">{genre}</option>
            {genresList.map((g) => (
                <option key={g.id} value={g.name}>{g.name}</option>
            ))}
            </select>


            <h3>Current Poster</h3>
            <img
                src={movie.poster}
                alt={movie.title}
                className="movie-detail-poster"
                onError={(e) => (e.target.src = noImage)}
            />
            <label>Change Poster:</label>
            <input type="file" accept="image/*" onChange={handlePosterChange} />

            <button onClick={handleUpdateMovie} className="update-btn">
              Update Movie
            </button>
          </div>



          <h3>Movie Gallery</h3>
          <div className="gallery-container">
            {images.length > 0 ? (
              <>
                <button onClick={handlePrevImage} className="gallery-button">❮</button>
                <img src={images[currentImageIndex]} alt="Movie Scene" className="gallery-image" />
                <button onClick={handleNextImage} className="gallery-button">❯</button>
              </>
            ) : (
              <p>No images available.</p>
            )}
          </div>

          <h3>Upload New Images</h3>
          <input type="file" accept="image/*" multiple onChange={handleNewImagesChange} />
          <button onClick={handleUploadImages} className="upload-btn">Upload Images</button>

          <h3>Delete Images</h3>
          <div className="image-list">
            {images.map((img, index) => (
              <div key={index} className="image-item">
                <img src={img} alt={`Movie Scene ${index}`} className="thumbnail" />
                <button onClick={() => handleDeleteImage(img)} className="delete-btn">Delete</button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="error-message">Movie not found.</p>
      )}
    </div>
  );
};

export default AdminUpdateMovie;

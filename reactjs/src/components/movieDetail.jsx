import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./MovieDetail.css";
import noImage from "../assets/no_image.jpg";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState("rate");
  const [user, setUser] = useState(null);
  const [hasReviewed, setHasReviewed] = useState(false);

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
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
      setLoading(false);
    };

    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/profile", {
          withCredentials: true, // Ensure cookies are sent
        });
    
        const userData = response.data.profile;
        setUser(userData);
        // Fetch user review for the specific movie from the reviews array
        if (userData.id && response.data.reviews) {
          const userReview = response.data.reviews.find((r) => String(r.movie_id) === String(id));
          if (userReview) {
            setReview(userReview.review); // Set the review text
            setRating(userReview.rating); // Set the rating
            setHasReviewed(true); // Flag that the user has reviewed this movie
            console.log("User's Review for this movie:", userReview);
          } else {
            console.log("No review found for this movie.");
            setHasReviewed(false); // Set false if the user hasn't reviewed this movie
          }
        }
      } catch (error) {
        setUser(null);
        console.error("Error fetching user profile:", error);
      }
    };

    fetchMovieDetail();
    fetchUser();
  }, [id]);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleSubmitReview = async () => {
    if (!review.trim() || rating === "rate") {
      alert("Please enter a review and select a rating.");
      return;
    }

    try {
      if (!user.id) {
        alert("You must be logged in to submit a review.");
        return;
      }
      const response = await axios.post(
        `http://localhost:3000/review?movie_id=${id}`,
        { review, rating },
        {
          withCredentials: true,
        }
      );

      alert("Review submitted successfully!");
      setHasReviewed(true);
      window.location.reload();
    } catch (error) {
      console.error("Error submitting review:", error.response?.data || error);
      alert("Error submitting review:", error.response?.data || error);
    }
  };

  // Handle updating the review
  const handleUpdateReview = async () => {
    if (!review.trim()) {
      alert("Please enter a review and select a rating.");
      return;
    }
    if (rating === 0) {
      alert("Rating cannot be 0. Please select a valid rating.");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:3000/review?movie_id=${id}`,
        { review, rating },
        {
          withCredentials: true,
        }
      );
      alert("Review updated successfully!");
      setHasReviewed(true);
      window.location.reload();
    } catch (error) {
      console.error("Error updating review:", error);
      alert("Error updating review.");
    }
  };

  // Handle deleting the review
  const handleDeleteReview = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/review?movie_id=${id}`,
        {
          withCredentials: true,
        }
      );
      alert("Review deleted successfully!");
      setReview("");
      setRating(0);
      setHasReviewed(false);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Error deleting review.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="movie-detail-container">
      {movie ? (
        <>
          <img
            src={movie.poster}
            alt={movie.title}
            className="movie-detail-poster"
            onError={(e) => (e.target.src = noImage)}
          />
          <h2>{movie.title}</h2>
          <p><strong>Description:</strong> {movie.description}</p>
          <p><strong>Year:</strong> {movie.year}</p>
          <p><strong>Genre:</strong> {movie.genre}</p>
          <p><strong>Rating:</strong> ⭐ {movie.rate === 0 ? '-' : movie.rate.toFixed(2)} / 5</p>

          {images.length > 0 && (
            <div className="movie-gallery">
              <h3>Gallery</h3>
              <div className="gallery-container">
                <button onClick={handlePrevImage} className="gallery-button">❮</button>
                <img src={images[currentImageIndex]} alt="Movie Scene" className="gallery-image" />
                <button onClick={handleNextImage} className="gallery-button">❯</button>
              </div>
            </div>
          )}

          <div className="review-section">
            <h3>{hasReviewed ? "Your Review" : "Write a Review"}</h3>
            <div>
              <p><strong>Your Review:</strong></p>
              <textarea
                placeholder="Write your review here..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="review-textarea"
              ></textarea>
              <div className="rating-container">
                <label><strong>Rating:</strong></label>
                <select
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    if (selectedValue !== "rate") {
                      setRating(parseFloat(selectedValue));
                    } else {
                      setRating("rate"); // Keep it as "rate" if selected
                    }
                  }}
                  value={rating}
                  className="rating-dropdown"
                >
                  <option value="rate" disabled>Rate</option> {/* Default option */}
                  {[...Array(20)].map((_, index) => {
                    const ratingValue = (index * 0.25 + 0.25).toFixed(2);
                    return (
                      <option key={ratingValue} value={ratingValue}>
                        {ratingValue}
                      </option>
                    );
                  })}
                </select>
              </div>

              {hasReviewed ? (
                <>
                  <p><strong>Your Rating:</strong> ⭐ {rating} / 5</p> {/* Displaying the user's rating */}
                  <button onClick={handleUpdateReview} className="submit-review-button">Update Review</button>
                  <button onClick={handleDeleteReview} className="submit-review-button">Delete Review</button>
                </>
              ) : (
                <button onClick={handleSubmitReview} className="submit-review-button">
                  Submit Review
                </button>
              )}
            </div>
          </div>

        </>
      ) : (
        <p className="error-message">Movie not found.</p>
      )}
    </div>
  );
};

export default MovieDetail;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./MovieDetail.css";

const MovieDetail = () => {
  const { id } = useParams(); // Get the movie ID from the URL
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/movies/${id}`);
        setMovie(response.data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
      setLoading(false);
    };

    fetchMovieDetail();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="movie-detail-container">
      {movie && (
        <>
          <img
            src={movie.poster}
            alt={movie.title}
            className="movie-detail-poster"
          />
          <h2>{movie.title}</h2>
          <p className="movie-detail-year">{movie.year}</p>
          <p className="movie-detail-description">{movie.description}</p>
        </>
      )}
    </div>
  );
};

export default MovieDetail;

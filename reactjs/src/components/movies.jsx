import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Movies.css";
import noImage from "../assets/no_image.jpg";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [visibleMovies, setVisibleMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedGenre, setSelectedGenre] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [minRate, setMinRate] = useState("");
  const [maxRate, setMaxRate] = useState("");

  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetchMovies(); // Fetch all movies when page loads
    fetchGenres();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/movies");
      const modifiedMovies = response.data.map((movie) => ({
        ...movie,
        poster: movie.poster
          ? `http://localhost:3000/movies/movie/image?name=${movie.poster.replace("src\\images\\", "")}`
          : noImage,
      }));
      setMovies(modifiedMovies);
      setVisibleMovies(modifiedMovies);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError("Failed to load movies.");
    }
    setLoading(false);
  };

  const fetchGenres = async () => {
    try {
      const response = await axios.get("http://localhost:3000/movies/genres");
      setGenres(response.data.map((genre) => genre.name));
    } catch (error) {
      console.error("Error fetching genres:", error);
      setError("Failed to load genres.");
    }
  };

  const applyFilter = async () => {
    setLoading(true);
    setError("");
    let genreMovies = [],
      yearMovies = [],
      rateMovies = [];

    try {
      if (minRate && maxRate) {
        const response = await axios.get(
          `http://localhost:3000/movies/filter/rate?minRate=${minRate}&maxRate=${maxRate}`
        );
        rateMovies = response.data;
      }

      if (selectedGenre) {
        const response = await axios.get(
          `http://localhost:3000/movies/filter/genre?genre=${selectedGenre}`
        );
        genreMovies = response.data;
      }

      if (minYear && maxYear) {
        const response = await axios.get(
          `http://localhost:3000/movies/filter/year?startYear=${minYear}&endYear=${maxYear}`
        );
        yearMovies = response.data;
      }

      if (!minRate && !maxRate && !selectedGenre && !minYear && !maxYear) {
        fetchMovies(); // If no filters applied, reload all movies
        setLoading(false);
        return;
      }

      const genreSet = new Set(genreMovies.map((m) => m.id));
      const yearSet = new Set(yearMovies.map((m) => m.id));
      const rateSet = new Set(rateMovies.map((m) => m.id));

      let filteredMovies = [];

      if (genreMovies.length && yearMovies.length && rateMovies.length) {
        filteredMovies = genreMovies.filter(
          (m) => yearSet.has(m.id) && rateSet.has(m.id)
        );
      } else if (genreMovies.length && yearMovies.length) {
        filteredMovies = genreMovies.filter((m) => yearSet.has(m.id));
      } else if (genreMovies.length && rateMovies.length) {
        filteredMovies = genreMovies.filter((m) => rateSet.has(m.id));
      } else if (yearMovies.length && rateMovies.length) {
        filteredMovies = yearMovies.filter((m) => rateSet.has(m.id));
      } else {
        filteredMovies = genreMovies.length
          ? genreMovies
          : yearMovies.length
          ? yearMovies
          : rateMovies;
      }

      if (filteredMovies.length === 0) {
        setError("No movies found for the selected filters.");
        setMovies([]);
        setVisibleMovies([]);
      } else {
        const modifiedMovies = filteredMovies.map((movie) => ({
          ...movie,
          poster: movie.poster
            ? `http://localhost:3000/movies/movie/image?name=${movie.poster.replace(
                "src\\images\\",
                ""
              )}`
            : noImage,
        }));
        setMovies(modifiedMovies);
        setVisibleMovies(modifiedMovies);
      }
    } catch (error) {
      console.error("Error fetching filtered movies:", error);
      setError("Failed to fetch movies. Please try again.");
      setMovies([]);
      setVisibleMovies([]);
    }

    setLoading(false);
  };

  return (
    <div className="movies-container">
      <h2>Movies</h2>

      {/* Filters */}
      <div className="filters">
        <select onChange={(e) => setMinYear(e.target.value)} value={minYear}>
          <option value="">Min Year</option>
          {Array.from({ length: 126 }, (_, i) => 2025 - i).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select onChange={(e) => setMaxYear(e.target.value)} value={maxYear}>
          <option value="">Max Year</option>
          {Array.from({ length: 126 }, (_, i) => 2025 - i).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select onChange={(e) => setMinRate(e.target.value)} value={minRate}>
          <option value="">Min Rating</option>
          {Array.from({ length: 21 }, (_, i) => (i * 0.25).toFixed(2)).map(
            (rate) => (
              <option key={rate} value={rate}>
                {rate}
              </option>
            )
          )}
        </select>

        <select onChange={(e) => setMaxRate(e.target.value)} value={maxRate}>
          <option value="">Max Rating</option>
          {Array.from({ length: 21 }, (_, i) => (i * 0.25).toFixed(2)).map(
            (rate) => (
              <option key={rate} value={rate}>
                {rate}
              </option>
            )
          )}
        </select>

        <select onChange={(e) => setSelectedGenre(e.target.value)} value={selectedGenre}>
          <option value="">All Genres</option>
          {genres.map((genre, index) => (
            <option key={index} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        <button onClick={applyFilter}>Filter</button>
      </div>

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}

      {/* Movies Grid */}
      {!error && visibleMovies.length > 0 && (
        <div className="movies-grid">
          {visibleMovies.map((movie) => (
            <Link key={movie.id} to={`/movie/${movie.id}`} className="movie-card-link">
              <div className="movie-card">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="movie-poster"
                  onError={(e) => (e.target.src = noImage)}
                />
                <div className="movie-info">
                  <h3 className="movie-title">Title: {movie.title}</h3>
                  <p className="movie-rating">Rating: ⭐ {movie.rate === 0 ? '-' : movie.rate.toFixed(2)}/5</p>
                  <p className="movie-year">Year: {movie.year}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {loading && <p className="loading">Loading...</p>}
    </div>
  );
};

export default Movies;

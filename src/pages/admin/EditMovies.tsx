import React, { useEffect, useState } from "react";
import "./EditMovies.css";

export default function EditMovies() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    duration_minutes: "",
    release_date: "",
    poster_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  // ✅ Fetch paginated movies
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/movies?page=${page}&limit=${limit}`
        );
        const data = await res.json();

        // Support both paginated + non-paginated responses
        if (Array.isArray(data)) {
          setMovies(data);
          setTotalPages(1);
        } else {
          setMovies(data.data || []);
          setTotalPages(data.totalPages || 1);
        }
      } catch (err) {
        console.error("Error fetching movies:", err);
        setErrorMessage("Failed to load movies.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page]);

  // ✅ When a movie is selected
  const handleSelectMovie = (movieId) => {
    const movie = movies.find((m) => m.id.toString() === movieId);
    if (movie) {
      setSelectedMovie(movie);
      setFormData({
        title: movie.title || "",
        description: movie.description || "",
        genre: movie.genre || "",
        duration_minutes: movie.duration_minutes || "",
        release_date: movie.release_date?.split("T")[0] || "",
        poster_url: movie.poster_url || "",
      });
    }
  };

  // ✅ Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMovie) return;

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch(
        `https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/movies/${selectedMovie.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (res.ok) {
        setSuccessMessage("🎬 Movie updated successfully!");
        const updatedList = movies.map((m) =>
          m.id === selectedMovie.id ? { ...m, ...formData } : m
        );
        setMovies(updatedList);
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage("Failed to update movie.");
      }
    } catch (error) {
      console.error("Error updating movie:", error);
      setErrorMessage("An error occurred while updating the movie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-container">
      <h2 className="title">Edit Movies</h2>

      {successMessage && <div className="message success">{successMessage}</div>}
      {errorMessage && <div className="message error">{errorMessage}</div>}

      {/* Movie Selector */}
      <div className="form-group">
        <label>Select Movie</label>
        <select onChange={(e) => handleSelectMovie(e.target.value)}>
          <option value="">-- Choose a movie to edit --</option>
          {movies.map((movie) => (
            <option key={movie.id} value={movie.id.toString()}>
              {movie.title}
            </option>
          ))}
        </select>
      </div>

      {selectedMovie && (
        <form onSubmit={handleSubmit} className="edit-form">
          {formData.poster_url && (
            <div className="poster-wrapper">
              <img
                src={formData.poster_url}
                alt="poster"
                className="poster"
              />
            </div>
          )}

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Genre</label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Duration (minutes)</label>
            <input
              type="number"
              name="duration_minutes"
              value={formData.duration_minutes}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Release Date</label>
            <input
              type="date"
              name="release_date"
              value={formData.release_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Poster URL</label>
            <input
              type="text"
              name="poster_url"
              value={formData.poster_url}
              onChange={handleChange}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Movie"}
          </button>
        </form>
      )}

      {/* ✅ Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          ⬅ Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}

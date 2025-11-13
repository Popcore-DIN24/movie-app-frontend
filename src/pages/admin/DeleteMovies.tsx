import React, { useEffect, useState } from "react";
import "./DeleteMovies.css"; // 👈 we'll create this CSS file below

export default function DeleteMovies() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8; // movies per page

  // ✅ Fetch paginated movies
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/movies?page=${page}&limit=${limit}`
        );
        const data = await res.json();

        // Check if backend returned { data, totalPages } (paginated) or array (non-paginated)
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

  // ✅ Handle delete
  const handleDelete = async (movie) => {
    if (!movie) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${movie.title}"?`
    );
    if (!confirmDelete) return;

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch(
        `https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/movies/${movie.id}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        setSuccessMessage(`🗑️ "${movie.title}" deleted successfully!`);
        setMovies((prev) => prev.filter((m) => m.id !== movie.id));

        // If last item deleted from the page → go back a page
        if (movies.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        }

        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage("Failed to delete movie.");
      }
    } catch (err) {
      console.error("Error deleting movie:", err);
      setErrorMessage("An error occurred while deleting the movie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="delete-container">
      <h2 className="title">Delete Movies</h2>

      {successMessage && <div className="message success">{successMessage}</div>}
      {errorMessage && <div className="message error">{errorMessage}</div>}

      {loading && <p className="loading-text">Loading...</p>}

      <div className="movie-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <div className="poster-wrapper">
              {movie.poster_url ? (
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="poster"
                />
              ) : (
                <div className="poster placeholder">No Image</div>
              )}
            </div>
            <div className="movie-info">
              <h3>{movie.title}</h3>
              <p className="genre">{movie.genre}</p>
              <button
                className="delete-button"
                onClick={() => handleDelete(movie)}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Pagination controls */}
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

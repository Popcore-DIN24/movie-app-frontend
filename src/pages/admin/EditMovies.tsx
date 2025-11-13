import { useEffect, useState } from "react";

export default function EditMovies() {
  const [movies, setMovies] = useState<any[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);
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

  // ✅ Fetch all movies when component mounts
  useEffect(() => {
    fetch(
      "https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/movies"
    )
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error("Error fetching movies:", err));
  }, []);

  // ✅ When a movie is selected, fill the form with its current details
  const handleSelectMovie = (movieId: string) => {
    const movie = movies.find((m) => m.id.toString() === movieId); // convert to string for safe match
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

  // ✅ Handle input changes in the form
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Submit the edited movie to the API
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

  // ✅ Delete movie function
  const handleDelete = async () => {
    if (!selectedMovie) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${selectedMovie.title}"?`
    );
    if (!confirmDelete) return;

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch(
        `https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/movies/${selectedMovie.id}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        setSuccessMessage("🗑️ Movie deleted successfully!");
        const updatedList = movies.filter((m) => m.id !== selectedMovie.id);
        setMovies(updatedList);
        setSelectedMovie(null);
        setFormData({
          title: "",
          description: "",
          genre: "",
          duration_minutes: "",
          release_date: "",
          poster_url: "",
        });
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage("Failed to delete movie.");
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
      setErrorMessage("An error occurred while deleting the movie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-900 text-white p-6 rounded-2xl shadow-lg mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-center">Edit Movies</h2>

      {successMessage && (
        <div className="bg-green-600 text-white p-2 rounded mb-3 text-center">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-600 text-white p-2 rounded mb-3 text-center">
          {errorMessage}
        </div>
      )}

      <div className="form-group mb-4">
        <label className="block mb-1 font-medium">Select Movie</label>
        <select
          onChange={(e) => handleSelectMovie(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Choose a movie to edit --</option>
          {movies.map((movie) => (
            <option key={movie.id} value={movie.id.toString()}>
              {movie.title}
            </option>
          ))}
        </select>
      </div>

      {selectedMovie && (
        <form onSubmit={handleSubmit}>
          {formData.poster_url && (
            <div className="flex justify-center mb-4">
              <div className="w-48 h-64 overflow-hidden rounded shadow-md flex items-center justify-center bg-gray-800">
                <img
                  src={formData.poster_url}
                  alt="poster"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          )}

          {/* Title */}
          <div className="form-group mb-3">
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div className="form-group mb-3">
            <label className="block mb-1 font-medium">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Genre */}
          <div className="form-group mb-3">
            <label className="block mb-1 font-medium">Genre</label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              placeholder="e.g. action, comedy"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Duration */}
          <div className="form-group mb-3">
            <label className="block mb-1 font-medium">Duration (minutes)</label>
            <input
              type="text"
              name="duration_minutes"
              value={formData.duration_minutes}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Release Date */}
          <div className="form-group mb-3">
            <label className="block mb-1 font-medium">Release Date</label>
            <input
              type="date"
              name="release_date"
              value={formData.release_date}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Poster URL */}
          <div className="form-group mb-4">
            <label className="block mb-1 font-medium">Poster URL</label>
            <input
              type="text"
              name="poster_url"
              value={formData.poster_url}
              onChange={handleChange}
              placeholder="Enter image URL"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-2 rounded font-semibold transition ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Updating..." : "Update Movie"}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className={`flex-1 py-2 rounded font-semibold transition bg-red-600 hover:bg-red-700`}
            >
              {loading ? "Deleting..." : "Delete Movie"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

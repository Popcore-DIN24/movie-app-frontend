import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function CreateMovies() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: [] as string[], 
    duration_minutes: "",
    release_date: "",
    poster_url: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const genres = [
    "action",
    "comedy",
    "drama",
    "horror",
    "romance",
    "scifi",
    "fantasy",
    "thriller",
    "animation",
    "adventure",
    "documentary",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, multiple, selectedOptions } = e.target as HTMLSelectElement;

    if (multiple) {
      const values = Array.from(selectedOptions, (option) => option.value);
      setFormData({ ...formData, [name]: values });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title || !formData.description || formData.genre.length === 0) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (isNaN(Number(formData.duration_minutes))) {
      setErrorMessage("Duration must be a number.");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/movies",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (res.ok) {
        setSuccessMessage("🎬 Movie added successfully!");
        setFormData({
          title: "",
          description: "",
          genre: [],
          duration_minutes: "",
          release_date: "",
          poster_url: "",
        });
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage("Failed to add movie. Please try again.");
      }
    } catch (error) {
      console.error("Error adding movie:", error);
      setErrorMessage("An error occurred while adding the movie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-900 text-white p-6 rounded-2xl shadow-lg mt-8">
      <form className="movie-form" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Create New Movie
        </h2>

        {/* messages*/}
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

        {/* Title */}
        <div className="form-group mb-3">
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter movie title"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
            required
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
            placeholder="Enter description"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* ✅ Genre (multiple select) */}
        <div className="form-group mb-3">
          <label className="block mb-1 font-medium">Genres (Select one or more)</label>
          <select
            name="genre"
            multiple
            value={formData.genre}
            onChange={handleChange}
            className="w-full p-2 h-40 rounded bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500"
            required
          >
            {genres.map((g) => (
              <option key={g} value={g}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </option>
            ))}
          </select>
          <small className="text-gray-400">
            Hold Ctrl (Windows) or Cmd (Mac) to select multiple genres
          </small>
        </div>

        {/* Duration */}
        <div className="form-group mb-3">
          <label className="block mb-1 font-medium">Movie Duration (minutes)</label>
          <input
            type="text"
            name="duration_minutes"
            value={formData.duration_minutes}
            onChange={handleChange}
            placeholder="Enter duration in minutes"
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded font-semibold transition ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Submitting..." : "Create"}
        </button>
      </form>
      <button
        type="button"
        onClick={() => navigate("/edit-movies")}
        className="w-full py-2 mt-3 rounded font-semibold bg-purple-600 hover:bg-purple-700 transition"
      >
        Go to Edit Movies
      </button>

    </div>
  );
}

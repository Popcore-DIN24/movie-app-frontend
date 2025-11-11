import { useState } from "react";

export default function CreateMovies() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    duration_minutes: "",
    release_date: "",
    poster_url: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting movie:", formData);

    try {
      const res = await fetch("https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccessMessage("Movie added successfully!");
        setFormData({
          title: "",
          description: "",
          genre: "",
          duration_minutes: "",
          release_date: "",
          poster_url: "",
        });
      } else {
        alert("Failed to add movie");
      }
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };

  return (
    <div>
      <form className="movie-form" onSubmit={handleSubmit}>
        <h2>Create New Movie</h2>
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter movie title"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            required
          />
        </div>

        <div className="form-group">
          <label>Genre</label>
          <input
            type="text"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            placeholder="Enter genre"
          />
        </div>

        <div className="form-group">
          <label>Movie Duration (minutes)</label>
          <input
            type="text"
            name="duration_minutes"
            value={formData.duration_minutes}
            onChange={handleChange}
            placeholder="Enter duration in minutes"
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
            placeholder="Enter image URL"
          />
        </div>

        <button type="submit">Create</button>
      </form>
    </div>
  );
}

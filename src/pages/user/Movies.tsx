import { useEffect, useState } from "react";
import "./Movies.css"; // optional CSS for styling

interface Movie {
  id: number;
  title: string;
  description: string;
  genre: string;
  duration: number | string;
  release_date: string;
  poster_url: string;
}

export default function Movies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/movies"
        );
        if (!res.ok) throw new Error("Failed to fetch movies");
        const data: Movie[] = await res.json();
        setMovies(data);
      } catch (err) {
        console.error(err);
        setErrorMessage("Failed to load movies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="movies-container">
      <h2 className="movies-title">All Movies</h2>

      {loading && <p>Loading movies...</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}

      <div className="movies-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            {movie.poster_url && (
              <img src={movie.poster_url} alt={movie.title} className="movie-poster" />
            )}
            <h3 className="movie-title">{movie.title}</h3>
            <p className="movie-genre">{(movie.genre).toString().toUpperCase()}</p>
            <p className="movie-duration">{Number(movie.duration)} mins</p>
            <p className="movie-release">Released: {movie.release_date?.split("T")[0]}</p>
            <p className="movie-description">{movie.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

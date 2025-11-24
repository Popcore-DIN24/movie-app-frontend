import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./MovieDetails.css";

interface Movie {
  id: number;
  title: string;
  description: string;
  genre: string;
  duration: number;
  poster_url?: string;
  release_date: string;
}

interface ShowTime {
  id: number;
  date: string;
  time: string;
  price: number;
  data: data[];
}
interface data{
  id:number;
  start_time: number;
  price_amount:number;
  end_time:number
}

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTimes, setShowTimes] = useState<ShowTime[]>([]);
  const [movieData, setMovieData]= useState<data[]>([])

  useEffect(() => {
    const fetchMovieAndShows = async () => {
      try {
        const movieResponse = await fetch(
          "https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/movies"
        );

        if (!movieResponse.ok) throw new Error("Failed to load movies");

        const allMovies: Movie[] = await movieResponse.json();
        const selected = allMovies.find((m) => m.id === Number(id));

        if (!selected) {
          setError("Movie not found");
          setLoading(false);
          return;
        }

        setMovie(selected);

        const showResponse = await fetch(
          `https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/movies/${id}/showtimes`
        );

        if (!showResponse.ok) throw new Error("Failed to load showtimes");

        const showsData: any = await showResponse.json();
        console.log("Showtimes response:", showsData);

        if (Array.isArray(showsData)) {
          setShowTimes(showsData);
        } else if (Array.isArray(showsData.data)) {
          setShowTimes(showsData.data);
        } else {
          setShowTimes([]); 
        }
        setMovieData(showsData.data)

      } catch (err: any) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchMovieAndShows();
  }, [id]);

  if (loading) return <div className="movieDetailsRoot">Loading...</div>;
  if (error) return <div className="movieDetailsRoot">{error}</div>;
  if (!movie) return <div className="movieDetailsRoot">No movie found</div>;

  return (
    <div className="movieDetailsRoot">
      <h1 className="movieTitle">{movie.title}</h1>
      {movie.poster_url && (
        <img src={movie.poster_url} alt={movie.title} className="moviePoster" />
      )}
      <div className="movieInfo">
        <p>{movie.description}</p>
        <p>
          <span className="movieLabel">Genre:</span> {movie.genre}
        </p>
        <p>
          <span className="movieLabel">Duration:</span> {movie.duration} min
        </p>
        <p className="releaseDate">
          Release: {new Date(movie.release_date).toLocaleDateString()}
        </p>

        <div className="showTimesSection">
          <h2>Show Times</h2>
          {!Array.isArray(showTimes) || showTimes.length === 0 ? (
            <p>No showtimes available</p>
          ) : (
            movieData.map((show) => (
              <div key={show.id} className="showTimeCard">
                <span className="showDate">
                  {new Date(show.start_time).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="showTime">{show.start_time}</span>
                <span className="showTime">{show.end_time}</span>
                <span className="showPrice">${show.price_amount}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

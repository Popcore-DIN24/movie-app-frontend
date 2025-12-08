import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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

interface Showtime {
  id: number;
  theater_city: string;
  start_time: number;
  end_time: number;
  price_amount: number;
  theater_id?: number;
  hall_id?: number;
}

export default function MovieDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const params = new URLSearchParams(location.search);
  const initialCity = params.get("city") || "";

  const [movie, setMovie] = useState<Movie | null>(null);
  const [showTimes, setShowTimes] = useState<Showtime[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredShows, setFilteredShows] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentLang = i18n.language;

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(
          "https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/theaters"
        );
        const data: { data: { city: string }[] } = await response.json();
        const cityList: string[] = [
          ...new Set(
            (data.data || [])
              .map((t) => t.city)
              .filter((c) => typeof c === "string" && c.trim() !== "")
          ),
        ];
        setCities(cityList);
        if (initialCity && cityList.includes(initialCity)) {
          setSelectedCity(initialCity);
        } else if (cityList.length > 0) {
          setSelectedCity(cityList[0]);
        }
      } catch (err: any) {
        console.error("Failed to load cities:", err.message);
      }
    };
    fetchCities();
  }, [initialCity]);

  useEffect(() => {
    const fetchMovieAndShows = async () => {
      try {
        const apiLangMap: any = {
          en: "en-US",
          fi: "fi-FI",
        };
        const apiLang = apiLangMap[currentLang] || "en-US";

        const response = await fetch(
          `https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/movies/scheduled?lang=${apiLang}`
        );
        const data = await response.json();

        const selected = data.find((m: any) => m.id === Number(id));

        if (!selected) {
          setError("Movie not found");
          setLoading(false);
          return;
        }

        setMovie({
          id: selected.id,
          title: selected.title,
          description: selected.description,
          genre: selected.genre,
          duration: selected.duration,
          poster_url: selected.poster_url,
          release_date: selected.release_date,
        });

        const enrichedShows: Showtime[] = (selected.showtimes || []).map((s: any) => ({
          id: s.id,
          theater_city: s.theater_city,
          start_time: s.start_time,
          end_time: s.end_time,
          price_amount: s.price,
          theater_id: s.theater_id ?? 0,
          hall_id: s.hall_id ?? 0,
        }));

        setShowTimes(enrichedShows);

        const dateList = [
          ...new Set(enrichedShows.map((s) => new Date(s.start_time).toISOString().split("T")[0])),
        ];
        setDates(dateList);

        setFilteredShows(enrichedShows);
      } catch (err: any) {
        setError(err.message);
      }
      setLoading(false);
    };
    fetchMovieAndShows();
  }, [id, currentLang]);

  useEffect(() => {
    let result = [...showTimes];
    if (selectedCity) {
      result = result.filter(
        (s) => s.theater_city && s.theater_city.toLowerCase() === selectedCity.toLowerCase()
      );
    }
    if (selectedDate) {
      result = result.filter((s) => new Date(s.start_time).toISOString().split("T")[0] === selectedDate);
    }
    setFilteredShows(result);
  }, [selectedCity, selectedDate, showTimes]);

  if (loading) return <div className="movieDetailsRoot">{t("loading")}</div>;
  if (error) return <div className="movieDetailsRoot">{error}</div>;
  if (!movie) return <div className="movieDetailsRoot">No movie found</div>;

  const goToSeatSelection = (show: Showtime) => {
    if (!show.theater_id || !show.hall_id) {
      console.error("Theater or Hall ID is missing");
      return;
    }
    navigate(`/movie/${movie.id}/showtime/${show.id}/seats`, {
      state: { movie, show },
    });
  };

  return (
    <div className="movieDetailsRoot">
      <h1 className="movieTitle">{movie.title}</h1>

      {movie.poster_url && <img className="moviePoster" src={movie.poster_url} alt={movie.title} />}

      <div className="movieInfo">
        <p>{movie.description}</p>
        <p><strong>{t("genre")}:</strong> {movie.genre}</p>
        <p><strong>{t("duration")}:</strong> {movie.duration} min</p>
        <p className="releaseDate">{t("release")}: {new Date(movie.release_date).toLocaleDateString()}</p>

        <div className="dropdownGroup">
          <label>{t("city")}:</label>
          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
            {cities.map((city, i) => <option key={i} value={city}>{city}</option>)}
          </select>
        </div>

        <div className="dropdownGroup">
          <label>{t("date")}:</label>
          <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
            <option value="">{t("all") || "All"}</option>
            {dates.map((date, i) => <option key={i} value={date}>{new Date(date).toLocaleDateString()}</option>)}
          </select>
        </div>

        <div className="showTimesSection">
          <h2>{t("showtimes")}</h2>
          {filteredShows.length === 0 ? (
            <p>{t("noShowtimes")}</p>
          ) : (
            filteredShows.map((show) => (
              <div key={show.id} className="showCard" onClick={() => goToSeatSelection(show)} style={{ cursor: "pointer" }}>
                <div><strong>{new Date(show.start_time).toLocaleDateString()}</strong></div>
                <div>
                  {new Date(show.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  {" - "}
                  {new Date(show.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
                <div className="price">${show.price_amount}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

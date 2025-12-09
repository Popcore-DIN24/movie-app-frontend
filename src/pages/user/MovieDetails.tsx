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

  // Azure Translator compatible languages
  const apiLang = i18n.language === "fi" ? "fi" : "en";

  const [translatedDescription, setTranslatedDescription] = useState<string>("");

  // ---------------------- Fetch cities ----------------------
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch(
          "https://wdfinpopcorebackend-fyfuhuambrfnc3hz.swedencentral-01.azurewebsites.net/api/v6/theaters"
        );
        const data: { data: { city: string }[] } = await res.json();
        const cityList = [
          ...new Set(
            (data.data || [])
              .map((t) => t.city)
              .filter((c) => typeof c === "string" && c.trim() !== "")
          ),
        ];
        setCities(cityList);
        setSelectedCity(initialCity && cityList.includes(initialCity) ? initialCity : cityList[0] || "");
      } catch (err: any) {
        console.error("Failed to load cities:", err.message);
      }
    };
    fetchCities();
  }, [initialCity]);

  // ---------------------- Fetch movie and showtimes ----------------------
  useEffect(() => {
    const fetchMovieAndShows = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://wdfinpopcorebackend-fyfuhuambrfnc3hz.swedencentral-01.azurewebsites.net/api/v6/movies/scheduled?lang=${apiLang}`
        );
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();

        const selected = data.find((m: any) => m.id === Number(id));
        if (!selected) {
          setError(t("movieDetails.notFound"));
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

        const shows: Showtime[] = (selected.showtimes || []).map((s: any) => ({
          id: s.id,
          theater_city: s.theater_city,
          start_time: s.start_time,
          end_time: s.end_time,
          price_amount: s.price,
          theater_id: s.theater_id ?? 0,
          hall_id: s.hall_id ?? 0,
        }));

        setShowTimes(shows);

        const dateList = [...new Set(shows.map((s) => new Date(s.start_time).toISOString().split("T")[0]))];
        setDates(dateList);

        setFilteredShows(shows);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieAndShows();
  }, [id, apiLang, t]);

  // ---------------------- Translate description ----------------------
  useEffect(() => {
    const translateDescription = async () => {
      if (!movie?.description) return;

      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: movie.description, targetLang: apiLang }),
        });

        if (!res.ok) {
          console.error("Translation API returned non-OK:", res.status);
          return;
        }

        const data = await res.json();
        if (data.translatedText) setTranslatedDescription(data.translatedText);
      } catch (error) {
        console.error("Translation failed:", error);
      }
    };

    translateDescription();
  }, [movie, apiLang]);

  // ---------------------- Filter shows ----------------------
  useEffect(() => {
    let filtered = [...showTimes];
    if (selectedCity) {
      filtered = filtered.filter(
        (s) => s.theater_city?.toLowerCase() === selectedCity.toLowerCase()
      );
    }
    if (selectedDate) {
      filtered = filtered.filter(
        (s) => new Date(s.start_time).toISOString().split("T")[0] === selectedDate
      );
    }
    setFilteredShows(filtered);
  }, [selectedCity, selectedDate, showTimes]);

  const goToSeatSelection = (show: Showtime) => {
    if (!show.theater_id || !show.hall_id) {
      console.error("Missing theater or hall ID");
      return;
    }
    navigate(`/movie/${movie?.id}/showtime/${show.id}/seats`, { state: { movie, show } });
  };

  // ---------------------- Render ----------------------
  if (loading) return <div className="movieDetailsRoot">{t("movieDetails.loading")}</div>;
  if (error) return <div className="movieDetailsRoot">{error}</div>;
  if (!movie) return <div className="movieDetailsRoot">{t("movieDetails.notFound")}</div>;

  return (
    <div className="movieDetailsRoot">
      <h1 className="movieTitle">{movie.title}</h1>

      {movie.poster_url && <img className="moviePoster" src={movie.poster_url} alt={movie.title} />}

      <div className="movieInfo">
        <p>{translatedDescription || movie.description}</p>

        <p><strong>{t("movieDetails.genre")}:</strong> {movie.genre}</p>
        <p><strong>{t("movieDetails.duration")}:</strong> {movie.duration} min</p>
        <p className="releaseDate">{t("movieDetails.release")}: {new Date(movie.release_date).toLocaleDateString()}</p>

        <div className="dropdownGroup">
          <label>{t("movieDetails.city")}:</label>
          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
            {cities.map((city, i) => <option key={i} value={city}>{city}</option>)}
          </select>
        </div>

        <div className="dropdownGroup">
          <label>{t("movieDetails.date")}:</label>
          <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
            <option value="">{t("movieDetails.all")}</option>
            {dates.map((date, i) => (
              <option key={i} value={date}>{new Date(date).toLocaleDateString()}</option>
            ))}
          </select>
        </div>

        <div className="showTimesSection">
          <h2>{t("movieDetails.showtimes")}</h2>
          {filteredShows.length === 0 ? (
            <p>{t("movieDetails.noShowtimes")}</p>
          ) : (
            filteredShows.map((show) => (
              <div key={show.id} className="showCard">
                <div className="showInfo">
                  <div className="showDate">{new Date(show.start_time).toLocaleDateString()}</div>
                  <div className="showTimePrice">
                    <span className="showTime">
                      {new Date(show.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - 
                      {new Date(show.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span className="showPrice">${show.price_amount}</span>
                  </div>
                </div>
                <button className="buyButton" onClick={() => goToSeatSelection(show)}>
                  {t("movieDetails.buyTickets")}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

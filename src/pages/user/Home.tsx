import React, { useState, useRef, useEffect } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/Footer";
import styles from "./Home.module.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type CategoryKey =
  | "action"
  | "comedy"
  | "drama"
  | "horror"
  | "romance"
  | "scifi"
  | "fantasy"
  | "animation"
  | "adventure"
  | "documentary";

interface Showtime {
  theater_city?: string;
}

interface ScheduledMovie {
  id?: number;
  title: string;
  poster_url?: string;
  genre?: string;
  showtimes?: Showtime[];
}

export default function Home(): React.JSX.Element {
  const { t } = useTranslation();

  const [selectedCity, setSelectedCity] = useState<string>("");
  const [movies, setMovies] = useState<ScheduledMovie[]>([]);

  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
  };

  const scrollByStep = (direction: "next" | "prev") => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const firstChild = scroller.children[0] as HTMLElement | undefined;
    if (!firstChild) return;

    const itemWidth = Math.round(firstChild.getBoundingClientRect().width);

    scroller.scrollTo({
      left:
        direction === "next"
          ? scroller.scrollLeft + itemWidth
          : scroller.scrollLeft - itemWidth,
      behavior: "smooth",
    });
  };

  const categories = [
    "action",
    "comedy",
    "drama",
    "horror",
    "romance",
    "scifi",
    "fantasy",
    "animation",
    "adventure",
    "documentary",
  ] as const;

  const categoryRefs: Record<
    CategoryKey,
    React.RefObject<HTMLHeadingElement | null>
  > = categories.reduce((acc, key) => {
    acc[key] = React.createRef<HTMLHeadingElement | null>();
    return acc;
  }, {} as Record<CategoryKey, React.RefObject<HTMLHeadingElement | null>>);

  const scrollToCategory = (key: CategoryKey) => {
    const element = categoryRefs[key]?.current;
    if (!element) return;

    const viewportHeight = window.innerHeight;
    const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
    const offset = viewportHeight / 2 - element.offsetHeight / 2;

    window.scrollTo({
      top: elementTop - offset,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          "https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/movies/scheduled"
        );
        if (!response.ok) throw new Error("Failed to fetch movies");

        const data: ScheduledMovie[] = await response.json();
        setMovies(data);
      } catch (error) {
        console.error("❌ Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  const getGenres = (genre?: string): string[] => {
    if (!genre) return [];

    try {
      if (genre.trim().startsWith("{")) {
        const cleaned = genre.replace(/[\{\}"]/g, "");
        return cleaned.split(",").map((g) => g.toLowerCase().trim());
      }

      if (genre.includes(",")) {
        return genre.split(",").map((g) => g.toLowerCase().trim());
      }

      return [genre.toLowerCase().trim()];
    } catch {
      return [genre.toLowerCase()];
    }
  };

  const selectedCityNormalized = selectedCity.trim().toLowerCase();

  const filteredMovies = movies.filter((movie) => {
    if (!selectedCityNormalized) return true;

    return (movie.showtimes ?? []).some((showtime) => {
      const city = showtime.theater_city?.trim().toLowerCase() || "";
      return city.includes(selectedCityNormalized);
    });
  });

  return (
    <div className={styles.pageRoot} data-testid="home-page">
      <Navbar />

      <div className={styles.heroWrapper}>
        <div className={styles.citySelectorWrapper}>
          <select
            data-testid="city-select"
            className={styles.citySelector}
            value={selectedCity}
            onChange={handleChange}
          >
            <option value="">All cities</option>
            <option value="Oulu">Oulu</option>
            <option value="Helsinki">Helsinki</option>
            <option value="Turku">Turku</option>
          </select>
        </div>
      </div>

      {/* 🔥 CAROUSEL WITH CLICKABLE MOVIES */}
      <section className={styles.carouselSection}>
        <div className={styles.carouselContainer}>
          <button
            className={`${styles.carouselBtn} ${styles.left}`}
            onClick={() => scrollByStep("prev")}
          >
            ‹
          </button>

          <div className={styles.scroller} ref={scrollerRef}>
            {filteredMovies.map((movie, idx) => (
              <Link
                data-testid="movie-card"
                to={`/movie/${movie.id}`}
                className={styles.card}
                key={movie.id ?? idx}
              >
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className={styles.cardImg}
                />
                <div className={styles.movieTitle}>{movie.title}</div>
              </Link>
            ))}
          </div>

          <button
            className={`${styles.carouselBtn} ${styles.right}`}
            onClick={() => scrollByStep("next")}
          >
            ›
          </button>
        </div>
      </section>

      {/* 🔥 CATEGORY BUTTONS */}
      <section className={styles.categorySection}>
        <div className={styles.categoryScroller}>
          {categories.map((key) => (
            <button
              key={key}
              className={styles.categoryBtn}
              onClick={() => scrollToCategory(key)}
            >
              {t(`category.${key}`)}
            </button>
          ))}
        </div>
      </section>

      {/* 🔥 MOVIE ROWS */}
      <section className={styles.movieRows}>
        {categories.map((key) => (
          <div key={key} className={styles.movieRowWrapper}>
            <h2 ref={categoryRefs[key]} className={styles.rowTitle}>
              {t(`category.${key}`)}
            </h2>

            <div className={styles.rowScroller} data-testid="genre-row">
              {filteredMovies
                .filter((m) => getGenres(m.genre).includes(key))
                .map((movie, idx) => (
                  <Link
                    to={`/movie/${movie.id}`}
                    className={styles.rowCard}
                    key={movie.id ?? idx}
                  >
                    <img src={movie.poster_url} alt={movie.title} />
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
}

import React, { useState, useRef,useEffect } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/Footer"
import styles from "./Home.module.css";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  const [selectedCity, setSelectedCity] = useState("Helsinki");
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
  };

  const scrollByStep = (direction: "next" | "prev") => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const children = scroller.children;
    if (children.length === 0) return;

    const firstChild = children[0] as HTMLElement;
    const itemWidth = Math.round(firstChild.getBoundingClientRect().width);

    scroller.scrollTo({
      left:
        direction === "next"
          ? scroller.scrollLeft + itemWidth
          : scroller.scrollLeft - itemWidth,
      behavior: "smooth",
    });
  };

  /* ✅ CATEGORY LIST */
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

  type CategoryKey = typeof categories[number];

  /* ✅ refs  */
  const categoryRefs: Record<CategoryKey, React.RefObject<HTMLDivElement | null>> =
    categories.reduce((acc, key) => {
      acc[key] = React.createRef<HTMLDivElement>();
      return acc;
    }, {} as Record<CategoryKey, React.RefObject<HTMLDivElement | null>>);

  /* scrool to category*/
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

    const [movies, setMovies] = useState<any[]>([]);
    useEffect(() => {
      const fetchMovies = async () => {
        try {
          const response = await fetch("https://popcore-facrh7bjd0bbatbj.swedencentral-01.azurewebsites.net/api/v6/movies");
          if (!response.ok) throw new Error("Failed to fetch movies");
          const data = await response.json();
          setMovies(data);
        } catch (error) {
          console.error("❌ Error fetching movies:", error);
        }
      };

      fetchMovies();
    }, []);


    const getGenres = (genre: string) => {
      try {
        const cleaned = genre.replace(/[\{\}"]/g, ""); 
        return cleaned.split(",").map(g => g.toLowerCase().trim());
      } catch {
        return [genre.toLowerCase()];
      }
    };



  return (
    <div className={styles.pageRoot}>
      <Navbar />

      {/* HERO */}
      <div className={styles.heroWrapper}>
        <div className={styles.citySelectorWrapper}>
          <select
            className={styles.citySelector}
            value={selectedCity}
            onChange={handleChange}
          >
            <option value="Oulu">Oulu</option>
            <option value="Helsinki">Helsinki</option>
            <option value="Turku">Turku</option>
          </select>
        </div>
      </div>

      {/* CAROUSEL */}
      <section className={styles.carouselSection}>
        <div className={styles.carouselContainer}>
          <button
            className={`${styles.carouselBtn} ${styles.left}`}
            onClick={() => scrollByStep("prev")}
          >
            ‹
          </button>

          <div className={styles.scroller} ref={scrollerRef}>
            {movies.map((movie, idx) => (
              <div className={styles.card} key={idx}>
                <img src={movie.poster_url} alt={movie.title} className={styles.cardImg} />
                <div className={styles.movieTitle}>{movie.title}</div>
              </div>
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

      {/* CATEGORY BAR */}
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

      {/* MOVIE ROWS SECTION */}
      <section className={styles.movieRows}>
        {categories.map((key) => (
          <div key={key} className={styles.movieRowWrapper}>
            <h2 ref={categoryRefs[key]} className={styles.rowTitle}>
              {t(`category.${key}`)}
            </h2>

            <div className={styles.rowScroller}>
              {movies
              .filter((m) => getGenres(m.genre).includes(key))
              .map((movie, idx) => (
                <div className={styles.rowCard} key={idx}>
                  <img src={movie.poster_url} alt={movie.title} />
                </div>
              ))}

            </div>
          </div>
        ))}
      </section>

      <div> <Footer/></div>
    </div>
  );
}

import React, { useState, useRef } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/Footer"
import styles from "./Home.module.css";
import { useTranslation } from "react-i18next";


import img1 from "../../assets/images/test/1.jpeg";
import img2 from "../../assets/images/test/3.jpeg";
import img3 from "../../assets/images/test/4.jpeg";

export default function Home() {
  const { t } = useTranslation();
  const [selectedCity, setSelectedCity] = useState("Helsinki");

  const images = [img1, img2, img3];
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
    "thriller",
    "animation",
    "adventure",
    "documentary",
  ] as const;

  type CategoryKey = typeof categories[number];

  /* ✅ refs ساختن */
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
            {images.map((src, idx) => (
              <div className={styles.card} key={idx}>
                <img src={src} alt="" className={styles.cardImg} />
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
              {images.map((src, idx) => (
                <div className={styles.rowCard} key={idx}>
                  <img src={src} alt="" />
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

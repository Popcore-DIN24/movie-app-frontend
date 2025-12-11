import "./Navbar.css";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import menuIcon from "../../assets/icons/menu-burger.svg";
import searchIcon from "../../assets/icons/search.svg";
import userIcon from "../../assets/icons/user.svg";
import logoImg from "../../assets/icons/logo.png";
import { FaSun, FaMoon } from "react-icons/fa";

import { useTranslation } from "react-i18next";
import SearchModal from "./SearchModal";

export default function Navbar() {
  // Mobile menu state
  const [menuOpen, setMenuOpen] = useState(false);

  // Dropdown state (theaters, language)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  // i18n state
  const { t, i18n } = useTranslation();
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  // References for detecting outside clicks
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  // User dropdown and search modal state
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Logged-in user state
  const [loggedUser, setLoggedUser] = useState<any>(null);

  // Load user from localStorage once
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setLoggedUser(JSON.parse(savedUser));
    }
  }, []);

  // Theme state
  const [theme, setTheme] = useState<string>("dark");

  // Load saved theme on first render
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.body.className = savedTheme;
  }, []);

  // Toggle theme between dark and light
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.body.className = newTheme;
    localStorage.setItem("theme", newTheme);
  };

  // Detect clicks outside navbar or user menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setDropdownOpen(null);
        setUserMenuOpen(false);
      }

      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // When search is used inside modal
  const handleSearch = (filters: any) => {
    console.log("filters:", filters);
  };

  return (
    <nav className={`navbar ${theme}`} ref={navbarRef} data-testid="navbar">

      {/* Mobile menu icon */}
      <div className="navbar__menu" onClick={() => setMenuOpen(!menuOpen)} data-testid="mobile-menu">
        <img src={menuIcon} alt="menu" className="navbar__icon navbar__menu-icon" />
      </div>

      {/* Website logo */}
      <div className="navbar__logo">
        <Link to="/" className="navbar__logo-link">
          <img src={logoImg} alt="MovieApp logo" className="navbar__logo-img" />
        </Link>
      </div>

      {/* Navigation links */}
      <ul className={`navbar__links ${menuOpen ? "open" : ""}`}>
        <li><Link to="/">{t("nav.Home")}</Link></li>
        <li><Link to="/movies">{t("nav.Movies")}</Link></li>

        {/* Theaters dropdown */}
        <li
          className={`dropdown ${dropdownOpen === "theaters" ? "open" : ""}`}
          onClick={() =>
            setDropdownOpen(dropdownOpen === "theaters" ? null : "theaters")
          }
        >
          <span className="dropdown-toggle">{t("nav.Theaters")}</span>
          <ul className="dropdown-menu" data-testid="theaters-dropdown-menu">
            <li><Link to="/theaters#cinema-nova">Cinema Nova</Link></li>
            <li><Link to="/theaters#kino-baltic">Kino Baltic</Link></li>
            <li><Link to="/theaters#helsinki-central">Helsinki Central</Link></li>
          </ul>
        </li>

        <li><Link to="/contactus">{t("nav.Contact")}</Link></li>
        <li><Link to="/history">{t("nav.history")}</Link></li>

        {/* Language dropdown */}
        <li
          className={`dropdown ${dropdownOpen === "language" ? "open" : ""}`}
          onClick={() =>
            setDropdownOpen(dropdownOpen === "language" ? null : "language")
          }
          data-testid="lang-dropdown"
        >
          <span className="dropdown-toggle">{t("nav.language")}</span>
          <ul className="dropdown-menu">
            <li>
              <button onClick={() => changeLanguage("en")} className="lang-btn">
                English
              </button>
            </li>
            <li>
              <button onClick={() => changeLanguage("fi")} className="lang-btn">
                Suomi
              </button>
            </li>
          </ul>
        </li>

        {/* Theme toggle button */}
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </button>
      </ul>

      {/* Right side icons (search and user menu) */}
      <div className="navbar__actions">

        {/* Search icon */}
        <img
          src={searchIcon}
          alt="search"
          className="navbar__icon"
          onClick={() => setSearchModalOpen(true)}
          data-testid="search-btn"
        />

        {/* User menu */}
        <div className="user-dropdown" ref={userMenuRef}>
          <button
            className="user-btn"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            data-testid="user-btn"
          >
            <img src={userIcon} alt="user" className="navbar__icon" />
          </button>

          {/* User dropdown content */}
          {userMenuOpen && (
            <ul className="user-dropdown-menu" data-testid="user-dropdown">

              {/* If user is logged in */}
              {loggedUser ? (
                <>
                  <li className="user-name">
                    {loggedUser?.name || loggedUser?.username || loggedUser?.email}
                  </li>

                  <li>
                    <button
                      onClick={() => {
                        localStorage.removeItem("user");
                        setLoggedUser(null);
                        window.location.href = "/";
                      }}
                      className="logout-btn"
                    >
                      {t("nav.logout")}
                    </button>
                  </li>
                </>
              ) : (
                /* If no user is logged in */
                <>
                  <li><Link to="/Login">{t("nav.signIn")}</Link></li>
                  <li><Link to="/signup">{t("nav.signUp")}</Link></li>
                </>
              )}

            </ul>
          )}
        </div>
      </div>

      {/* Search modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSearch={handleSearch}
      />

    </nav>
  );
}

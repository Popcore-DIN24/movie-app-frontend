import "./Navbar.css";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import menuIcon from "../../assets/icons/menu-burger.svg";
import searchIcon from "../../assets/icons/search.svg";
import userIcon from "../../assets/icons/user.svg";
import logoImg from "../../assets/icons/logo.png";

import { useTranslation } from "react-i18next";

import SearchModal from "./SearchModal";

export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const { t, i18n } = useTranslation();
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const navbarRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (filters: any) => {
    console.log("filters :", filters);
  };

  return (
    <nav className="navbar" ref={navbarRef} data-testid="navbar">

      {/* Menu icon (mobile) */}
      <div className="navbar__menu" onClick={() => setMenuOpen(!menuOpen)} data-testid="mobile-menu">
        <img src={menuIcon} alt="menu" className="navbar__icon navbar__menu-icon" />
      </div>

      {/* Logo */}
      <div className="navbar__logo">
        <Link to="/" className="navbar__logo-link">
          <img src={logoImg} alt="MovieApp logo" className="navbar__logo-img" />
        </Link>
      </div>

      {/* Navigation links */}
      <ul className={`navbar__links ${menuOpen ? "open" : ""}`}>
        <li><Link to="/">{t("nav.Home")}</Link></li>
        <li><Link to="/movies">{t("nav.Movies")}</Link></li>

        {/* Dropdown: Theaters */}
        <li
          className={`dropdown ${dropdownOpen === "theaters" ? "open" : ""}`}
          onClick={() =>
            setDropdownOpen(dropdownOpen === "theaters" ? null : "theaters")
          }
        >
          <span className="dropdown-toggle">{t("nav.Theaters")}</span>
          <ul className="dropdown-menu" data-testid="theaters-dropdown-menu">
            <li><a href="#">{t("nav.cinema1")}</a></li>
            <li><a href="#">{t("nav.cinema2")}</a></li>
            <li><a href="#">{t("nav.cinema3")}</a></li>
          </ul>
        </li>

        <li><Link to="/contact">{t("nav.Contact")}</Link></li>

        <li><Link to="/history">{t("nav.history")}</Link></li>

        {/* Language switcher */}
        <li
          className={`dropdown ${dropdownOpen === 'language' ? 'open' : ''}`}
          onClick={() =>
            setDropdownOpen(dropdownOpen === 'language' ? null : 'language')
          }
          data-testid="lang-dropdown"
        >
          <span className="dropdown-toggle">{t("nav.language")}</span>
          <ul className="dropdown-menu">
            <li>
              <button onClick={() => changeLanguage("en")} className="lang-btn">
                🇬🇧 English
              </button>
            </li>
            <li>
              <button onClick={() => changeLanguage("fi")} className="lang-btn">
                🇫🇮 Suomi
              </button>
            </li>
          </ul>
        </li>
      </ul>

      {/* Right section (search + user menu) */}
      <div className="navbar__actions">

        <img
          src={searchIcon}
          alt="search"
          className="navbar__icon"
          onClick={() => setSearchModalOpen(true)}
          data-testid="search-btn"
        />

        {/* User dropdown */}
        <div className="user-dropdown">
          <button
            className="user-btn"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            data-testid="user-btn"
          >
            <img src={userIcon} alt="user" className="navbar__icon" />
          </button>

          {userMenuOpen && (
            <ul className="user-dropdown-menu" data-testid="user-dropdown">
              <li><Link to="/signin">{t("nav.signIn")}</Link></li>
              <li><Link to="/signup">{t("nav.signUp")}</Link></li>
            </ul>
          )}
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSearch={handleSearch}
        data-testid="search-modal"
      />

    </nav>
  );
}

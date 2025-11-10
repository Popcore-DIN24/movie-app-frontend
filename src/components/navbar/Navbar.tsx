import "./Navbar.css";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

// import icons directly
import menuIcon from "../../assets/icons/menu-burger.svg";
import searchIcon from "../../assets/icons/search.svg";
import userIcon from "../../assets/icons/user.svg";
//import logoImage
import logoImg from "../../assets/icons/logo.png";
//import i18n hook
import { useTranslation } from "react-i18next";

export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  
  //i18n translation hook
  const { t, i18n } = useTranslation();
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };
//ref for navbar to close menus when clicking outside
  const navbarRef = useRef<HTMLDivElement | null>(null);
//ref for user menu to close when clicking outside
  const userMenuRef = useRef<HTMLDivElement | null>(null);

//for user menu (signin/signup)
  const [userMenuOpen, setUserMenuOpen] = useState(false);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
        setDropdownOpen(null);
        setUserMenuOpen(false);

      }
    };
     if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
      setUserMenuOpen(false);
    }
 

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <nav className="navbar" ref={navbarRef}>
      {/* Left: Menu icon (mobile only) */}      
      <div className="navbar__menu" onClick={() => setMenuOpen(!menuOpen)}>
        <img src={menuIcon} alt="menu" className="navbar__icon navbar__menu-icon" />
      </div>

      {/* Center: Logo (click → go home) */}
      <div className="navbar__logo">
        <Link to="/" className="navbar__logo-link">
          <img src={logoImg} alt="MovieApp logo" className="navbar__logo-img" />
        </Link>
      </div>


       {/* Navigation links (visible in desktop, hidden in mobile) */}
      <ul className={`navbar__links ${menuOpen ? "open" : ""}`}>
        <li><Link to="/">{t("Home")}</Link></li>
        <li><Link to="/movies">{t("Movies")}</Link></li>
        {/* Dropdown */}
        <li
          className={`dropdown ${dropdownOpen === "theaters" ? "open" : ""}`}
          onClick={() =>
            setDropdownOpen(dropdownOpen === "theaters" ? null : "theaters")
          }
        >
          <span className="dropdown-toggle">{t("Theaters")}</span>
          <ul className="dropdown-menu">
            <li><a href="#">Cinema Nova (Oulu)</a></li>
            <li><a href="#">Kino Baltic (Turku)</a></li>
            <li><a href="#">Elokuvateatteri (Helsinki)</a></li>
          </ul>
        </li>



        <li><Link to="/contactus">{t("Contact")}</Link></li>
        <li><Link to="/history">{t("history")}</Link></li>
        <li> <Link to="/admin">{t("Admin")}</Link></li>

        {/* Language switcher */}
        <li
          className={`dropdown ${dropdownOpen === 'language' ? 'open' : ''}`}
          onClick={() =>
            setDropdownOpen(dropdownOpen === 'language' ? null : 'language')
          }
        >
          <span className="dropdown-toggle">{t("language")}</span>
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


      {/* Right: Action icons */}
      <div className="navbar__actions">
  <img src={searchIcon} alt="search" className="navbar__icon" />

  {/* User dropdown */}
  <div className="user-dropdown">
      <button
        className="user-btn"
        onClick={() => setUserMenuOpen(!userMenuOpen)}
      >
        <img src={userIcon} alt="user" className="navbar__icon" />
      </button>

      {userMenuOpen && (
        <ul className="user-dropdown-menu">
          <li><Link to="/signin">{t("signIn")}</Link></li>
          <li><Link to="/signup">{t("signUp")}</Link></li>
        </ul>
      )}
    </div>
  </div>

    </nav>
  );
}

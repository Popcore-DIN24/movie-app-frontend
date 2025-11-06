import "./Navbar.css";
import { Link } from "react-router-dom";
import { useState } from "react";

// import icons directly
import menuIcon from "../../assets/icons/menu-burger.svg";
import searchIcon from "../../assets/icons/search.svg";
import userIcon from "../../assets/icons/user.svg";
//import logoImage
import logoImg from "../../assets/icons/logo.png";

export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="navbar">
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
        <li><Link to="/">Home</Link></li>
        <li><Link to="/movies">Movies</Link></li>
        {/* Dropdown */}
        <li
          className={`dropdown ${dropdownOpen ? "open" : ""}`}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span className="dropdown-toggle">Theaters</span>
          <ul className="dropdown-menu">
            <li><a href="#">Cinema Nova (Oulu)</a></li>
            <li><a href="#">Kino Baltic (Turku)</a></li>
            <li><a href="#">Elokuvateatteri (Helsinki)</a></li>
          </ul>
        </li>


        <li><Link to="/contact">Contact us</Link></li>
        <li><Link to="/history">History</Link></li>
        <li><Link to="/Language">Language</Link></li>
      </ul>


      {/* Right: Action icons */}
      <div className="navbar__actions">
        <img src={searchIcon} alt="search" className="navbar__icon" />
        <img src={userIcon} alt="user" className="navbar__icon" />
      </div>
    </nav>
  );
}

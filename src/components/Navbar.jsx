import React, { useState, useEffect } from 'react';
import { NavLink } from "react-router-dom";
import Logo from '../assets/Logo/Georson.png';
import '../styles/Components.css';
import { FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
  const [isOpen, setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu  = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/",          label: "HOME" },
    { to: "/about",     label: "ABOUT US" },
    { to: "/services",  label: "SERVICES" },
    { to: "/products",  label: "PRODUCTS" },
    { to: "/industries",label: "INDUSTRIES" },
    { to: "/clients",   label: "CLIENTS" },
    { to: "/blog",      label: "BLOG" },
    { to: "/enquiry",   label: "ENQUIRY" },
  ];

  return (
    <header className={`navbar-container ${scrolled ? "scrolled" : ""}`}>
      {/* Logo */}
      <div className="navbar-left">
        <div className="navbar-logo-wrapper">
          <NavLink to="/" onClick={closeMenu}>
            <img src={Logo} alt="Georson Tech Pvt. Ltd" className="navbar-logo" />
          </NavLink>
        </div>
      </div>

      {/* Hamburger */}
      <button
        className="navbar-hamburger"
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Nav Links */}
      <nav className={`navbar-links ${isOpen ? 'active' : ''}`}>
        {navLinks.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            onClick={closeMenu}
            className={({ isActive }) => isActive ? "nav-active" : ""}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Overlay for mobile */}
      {isOpen && <div className="navbar-overlay" onClick={closeMenu} />}
    </header>
  );
}

export default Navbar;
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">Finance Tracker</div>

      {/* Hamburger for mobile */}
      <div
        className={`hamburger ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>

        {!user && (
          <>
            <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          </>
        )}

        {user && <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>}
      </div>
    </nav>
  );
}

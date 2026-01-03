// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ user }) {
  return (
    <nav className="navbar">
      <div className="logo">Finance Tracker</div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>

        {/* If there is NO user, show Register and Login */}
        {!user && (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}

        {/* If there IS a user, show Dashboard */}
        {user && <Link to="/dashboard">Dashboard</Link>}
      </div>
    </nav>
  );
}
import React, { useState } from "react";
import "../styles/Register.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (data.user) alert("Registered successfully!");
      else alert(data.error);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="register-page">
      <div className="register-wrapper">
        <div className="register-info">
          <h1>Welcome to Personal Finance Tracker</h1>
          <p>Join us and take control of your finances easily and securely.</p>
        </div>

        <div className="register-form-container">
          <form className="register-form" onSubmit={handleRegister}>
            <h2>Create Account</h2>

            <label>Name</label>
            <input
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Register</button>
            <p className="register-footer">
              Already have an account? <a href="/login">Login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

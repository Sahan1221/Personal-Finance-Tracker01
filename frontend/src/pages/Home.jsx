import React from "react";
import "../styles/Home.css";

export default function Home() {
  return (
    <div className="home-page">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Take Control of Your Finances</h1>
          <p>
            Track your income and expenses effortlessly. See your spending patterns and make smart decisions.
          </p>
          <a href="/register" className="btn-primary">Get Started</a>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose This App?</h2>
        <div className="features-cards">
          <div className="feature-card">
            <span role="img" aria-label="transactions">📝</span>
            <h3>Track Transactions</h3>
            <p>Record all your income and expenses easily with a few clicks.</p>
          </div>
          <div className="feature-card">
            <span role="img" aria-label="analytics">📊</span>
            <h3>Insights & Analytics</h3>
            <p>Visualize your spending with charts and improve your financial habits.</p>
          </div>
          <div className="feature-card">
            <span role="img" aria-label="security">🔒</span>
            <h3>Secure</h3>
            <p>All your data is protected with session-based security and best practices.</p>
          </div>
        </div>
      </section>

      
    </div>
  );
}

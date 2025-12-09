import React from "react";
import "../styles/About.css";

export default function About() {
  return (
    <div className="about-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Why Choose Personal Finance Tracker?</h1>
          <p>
            📝 Track Transactions – Record all income and expenses easily. <br />
            📊 Insights & Analytics – Visualize your spending with charts. <br />
            🔒 Secure – Your data is protected with session-based security.
          </p>
          <a href="/register" className="btn-primary">Get Started</a>
        </div>
      </section>

      <section className="about-section">
        <h2>About Personal Finance Tracker</h2>
        <p>
          This app helps you manage your income and expenses, giving you full control over your finances.
          Spendee helps hundreds of thousands of people worldwide to get their money into shape. 
        </p>
        <p>
          We believe managing finances should be as effortless as shopping online. Done anytime, anywhere, in just a few clicks.
        </p>
      </section>

      <section className="mission-section">
        <h2>Our Mission</h2>
        <p>
          Having a complete picture of your finances in one place makes them easier to manage. 
          Our mission is to help you leave your financial ghosts behind, overcome your fears, and treat yourself with financial wisdom.
        </p>
      </section>

      <section className="team-section">
        <h2>Meet The Team</h2>
        <p>“We have the experience, the skill and the will to make things happen.”</p>
      </section>

      <section className="contact-section">
        <h2>Get in Touch</h2>
        <form className="contact-form">
          <input type="text" placeholder="Your name" required />
          <input type="email" placeholder="Your email address" required />
          <textarea placeholder="Your message" required></textarea>
          <button type="submit">Send message</button>
        </form>
      </section>
    </div>
  );
}

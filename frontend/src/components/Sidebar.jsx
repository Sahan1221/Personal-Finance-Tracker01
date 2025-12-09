import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div style={{
      width: "220px",
      background: "#1a1a1a",
      color: "white",
      minHeight: "100vh",
      padding: "20px"
    }}>
      <h2>Finance</h2>
      <hr />

      <nav>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><Link style={{ color: "white" }} to="/">Dashboard</Link></li>
          <li><Link style={{ color: "white" }} to="/transactions">Transactions</Link></li>
          <li><Link style={{ color: "white" }} to="/reports">Reports</Link></li>
          <li><Link style={{ color: "white" }} to="/settings">Settings</Link></li>
        </ul>
      </nav>
    </div>
  );
}

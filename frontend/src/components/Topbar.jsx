import React from "react";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div style={{
      width: "100%",
      background: "#eeeeee",
      padding: "15px",
      display: "flex",
      justifyContent: "space-between"
    }}>
      <h3>Dashboard</h3>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div
      className="sidebar"
      style={{
        width: "220px",
        height: "100vh",
        background: "#1e293b",
        color: "#fff",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2
        className="logo"
        style={{
          marginBottom: "30px",
          textAlign: "center",
          color: "#38bdf8",
        }}
      >
        💸 Finance
      </h2>

      <nav
        className="nav-links"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <NavLink
          to="/dashboard"
          className="nav-item"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 15px",
            borderRadius: "10px",
            textDecoration: "none",
            color: isActive ? "#fff" : "#cbd5e1",
            background: isActive ? "#38bdf8" : "transparent",
          })}
        >
          <span>📊</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/analytics"
          className="nav-item"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 15px",
            borderRadius: "10px",
            textDecoration: "none",
            color: isActive ? "#fff" : "#cbd5e1",
            background: isActive ? "#38bdf8" : "transparent",
          })}
        >
          <span>📈</span>
          Analytics
        </NavLink>
      </nav>
    </div>
  );
}
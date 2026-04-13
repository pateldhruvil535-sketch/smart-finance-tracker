import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import CurrencySelector from "../common/CurrencySelector";

export default function Navbar() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [dark, setDark] = useState(false);

  // ✅ Load theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";

    const isDark = savedTheme === "dark";

    setDark(isDark);
    document.body.classList.toggle("dark", isDark);
  }, []);

  // ✅ Toggle Theme (FIXED)
  const toggleTheme = () => {
    setDark((prev) => {
      const newTheme = !prev;

      document.body.classList.toggle("dark", newTheme);
      localStorage.setItem("theme", newTheme ? "dark" : "light");

      return newTheme;
    });
  };

  // ✅ Logout
  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate("/login");
  };

  const handleNotification = () => {
    alert("🔔 No new notifications");
  };

  return (
    <div
      className="navbar"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 25px",
        background: dark ? "#1e293b" : "#ffffff",
        color: dark ? "#f1f5f9" : "#1e293b",
        borderBottom: "1px solid #e5e7eb",
        transition: "0.3s",
      }}
    >
      {/* LEFT */}
      <div
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/dashboard")}
      >
        <h2 style={{ margin: 0 }}>💰 Finance Tracker</h2>
        <p style={{ margin: 0, fontSize: "12px", opacity: 0.7 }}>
          Manage your money smartly
        </p>
      </div>

      {/* RIGHT */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        
        {/* 🌍 Currency */}
        <div
          style={{
            padding: "6px 10px",
            borderRadius: "8px",
            background: dark ? "#334155" : "#f1f5f9",
          }}
        >
          <CurrencySelector />
        </div>

        {/* 🌙 TOGGLE */}
        <button
          onClick={toggleTheme}
          style={{
            width: "45px",
            height: "22px",
            borderRadius: "20px",
            background: dark ? "#38bdf8" : "#cbd5e1",
            border: "none",
            position: "relative",
            cursor: "pointer",
            transition: "0.3s",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "3px",
              left: dark ? "23px" : "3px",
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              background: "#fff",
              transition: "0.3s",
            }}
          />
        </button>

        {/* 🔔 */}
        <button
          onClick={handleNotification}
          style={{
            fontSize: "18px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: dark ? "#fff" : "#000",
          }}
        >
          🔔
        </button>

        {/* 🚪 */}
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 14px",
            borderRadius: "8px",
            border: "none",
            background: "#ef4444",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
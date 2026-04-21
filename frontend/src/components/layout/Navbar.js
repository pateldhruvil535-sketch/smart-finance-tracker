import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import CurrencySelector from "../common/CurrencySelector";

export default function Navbar({ toggleSidebar }) {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [dark, setDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    const isDark = savedTheme === "dark";

    setDark(isDark);
    document.body.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    setDark((prev) => {
      const newTheme = !prev;
      document.body.classList.toggle("dark", newTheme);
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      return newTheme;
    });
  };

  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="premium-navbar">
      {/* LEFT */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
     <button onClick={toggleSidebar} className="menu-btn">
  ☰
</button>
        <div onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
          <h3 className="logo-text">💰 Finance Tracker</h3>
          <p className="subtitle">Manage your money smartly</p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="nav-actions">
        <div className="nav-pill">
          <CurrencySelector />
        </div>

        <button onClick={toggleTheme} className="theme-toggle">
          <span className={dark ? "active" : ""}></span>
        </button>

        <button className="icon-btn">🔔</button>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}
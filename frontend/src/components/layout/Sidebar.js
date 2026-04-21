import { NavLink } from "react-router-dom";

export default function Sidebar({ open, toggleSidebar }) {
  return (
    <>
      {/* OVERLAY */}
      {open && <div className="overlay" onClick={toggleSidebar}></div>}

      <aside className={`sidebar ${open ? "open" : ""}`}>
        
        {/* TOP BAR */}
        <div className="sidebar-header">
          <h2 className="sidebar-logo">💸 Finance</h2>

          {/* CLOSE BUTTON */}
          <button onClick={toggleSidebar} className="close-btn">
            ✖
          </button>
        </div>

        {/* NAV LINKS */}
        <nav>
          <NavLink to="/dashboard" className="nav-item" onClick={toggleSidebar}>
            📊 Dashboard
          </NavLink>

          <NavLink to="/analytics" className="nav-item" onClick={toggleSidebar}>
            📈 Analytics
          </NavLink>
        </nav>
      </aside>
    </>
  );
}
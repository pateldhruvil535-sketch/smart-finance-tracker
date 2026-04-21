import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => {
    setOpen(prev => !prev);
  };

  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar open={open} toggleSidebar={toggleSidebar} />

      <div className="main-content">
        {children}
      </div>
    </>
  );
}
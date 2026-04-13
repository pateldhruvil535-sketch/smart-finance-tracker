import React from "react";

function Card({ children }) {
  return (
    <div
      style={{
        background: "#1e293b",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "20px",
      }}
    >
      {children}
    </div>
  );
}

export default Card;
import React, { useContext } from "react";
import { CurrencyContext } from "../context/CurrencyContext";
import { formatCurrency } from "../../utils/currency";

function BudgetProgress({ spent = 0, limit = 1 }) {
  const { currency } = useContext(CurrencyContext);

  // ✅ Safe percentage
  const percentage = limit > 0 ? (spent / limit) * 100 : 0;
  const capped = Math.min(percentage, 100);

  // 🎨 Color logic
  const getColor = () => {
    if (percentage > 100) return "#ef4444";
    if (percentage > 75) return "#f59e0b";
    return "#22c55e";
  };

  // 🧠 Status text
  const getStatus = () => {
    if (percentage > 100) return "Over Budget 🚨";
    if (percentage > 75) return "Almost Limit ⚠️";
    return "On Track ✅";
  };

  // 💱 Format values
  const formattedSpent = formatCurrency(spent, currency);
  const formattedLimit = formatCurrency(limit, currency);
  const remaining = Math.max(limit - spent, 0);
  const formattedRemaining = formatCurrency(remaining, currency);

  return (
    <div
      style={{
        background: "#ffffff",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
      }}
    >
      {/* 🔥 HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <h4 style={{ margin: 0, color: "#1e293b" }}>
          💳 Budget Usage
        </h4>

        <span
          style={{
            color: getColor(),
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          {getStatus()}
        </span>
      </div>

      {/* 💰 AMOUNT */}
      <div
        style={{
          fontSize: "18px",
          fontWeight: "600",
          marginBottom: "14px",
          color: "#334155",
        }}
      >
        {formattedSpent} / {formattedLimit}
      </div>

      {/* 📊 PROGRESS BAR */}
      <div
        style={{
          width: "100%",
          height: "12px",
          background: "#e2e8f0",
          borderRadius: "999px",
          overflow: "hidden",
          marginBottom: "12px",
        }}
      >
        <div
          style={{
            width: `${capped}%`,
            height: "100%",
            borderRadius: "999px",
            background: `linear-gradient(90deg, ${getColor()}, #6366f1)`,
            transition: "width 0.6s ease",
          }}
        />
      </div>

      {/* 📉 FOOTER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "13px",
          color: "#64748b",
        }}
      >
        <span>{percentage.toFixed(1)}% used</span>

        <span>
          {percentage > 100
            ? `Exceeded by ${formatCurrency(spent - limit, currency)}`
            : `${formattedRemaining} left`}
        </span>
      </div>
    </div>
  );
}

export default BudgetProgress;
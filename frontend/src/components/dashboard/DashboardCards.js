import { useContext } from "react";
import { CurrencyContext } from "../context/CurrencyContext";
import { formatCurrency } from "../../utils/currency";

export default function DashboardCards({ income = 0, expense = 0 }) {
  const { currency } = useContext(CurrencyContext);

 const balance = (income * 100 - expense * 100) / 100;
  
  const containerStyle = {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    justifyContent: "space-between",
  };

  const cardStyle = {
    flex: "1 1 250px",
    padding: "25px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    background: "#ffffff",
  };

  const titleStyle = {
    fontSize: "18px",
    marginBottom: "10px",
    color: "#555",
  };

  const amountStyle = {
    fontSize: "24px",
    fontWeight: "bold",
  };

  return (
    <div style={containerStyle}>
      {/* Balance */}
      <div style={{ ...cardStyle, background: "#f5f7ff" }}>
        <h3 style={titleStyle}>Balance</h3>
        <p style={{ ...amountStyle, color: "#333" }}>
          {formatCurrency(balance, currency)}
        </p>
      </div>

      {/* Income */}
      <div style={{ ...cardStyle, background: "#e6fffa" }}>
        <h3 style={titleStyle}>Income</h3>
        <p style={{ ...amountStyle, color: "#00a86b" }}>
          {formatCurrency(income, currency)}
        </p>
      </div>

      {/* Expense */}
      <div style={{ ...cardStyle, background: "#fff1f0" }}>
        <h3 style={titleStyle}>Expense</h3>
        <p style={{ ...amountStyle, color: "#e63946" }}>
          {formatCurrency(expense, currency)}
        </p>
      </div>
    </div>
  );
}
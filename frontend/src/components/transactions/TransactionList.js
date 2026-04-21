import { useContext } from "react";
import { CurrencyContext } from "../context/CurrencyContext"; // ✅ FIXED
import { formatCurrency } from "../../utils/currency";
import API from "../../services/api";

export default function TransactionList({ transactions, fetchTransactions }) {
  const { currency, convert } = useContext(CurrencyContext); // ✅ USE convert

  const del = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // ✅ Safe UTC date formatting
  const formatDate = (date) => {
    if (!date) return "";

    const d = new Date(date);

    const day = String(d.getUTCDate()).padStart(2, "0");
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const year = d.getUTCFullYear();

    return `${day}-${month}-${year}`;
  };

  if (!transactions.length) {
    return (
      <div className="card">
        <h3>Transactions</h3>
        <p>No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>Transactions</h3>

  {transactions.map((t) => (
  <div key={t._id} className="transaction">
    {/* LEFT SIDE */}
    <div>
      <strong>{t.title}</strong>
      <br />
      <small>{formatDate(t.date)}</small>
    </div>

    {/* RIGHT SIDE */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px"
      }}
    >
      <span
        style={{
          color: t.type === "income" ? "#22c55e" : "#ef4444",
          fontWeight: "500"
        }}
      >
        {formatCurrency(convert(t.amount), currency)}
      </span>

      <button onClick={() => del(t._id)}>Delete</button>
    </div>
  </div>
))}
    </div>
  );
}
import { useEffect, useState, useMemo, useContext } from "react";
import API from "../services/api";

import { CurrencyContext } from "../components/context/CurrencyContext";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import DashboardCards from "../components/dashboard/DashboardCards";
import ExpenseCharts from "../components/dashboard/ExpenseCharts";
import PredictionChart from "../components/dashboard/PredictionChart";
import CategoryBudgets from "../components/dashboard/CategoryBudgets"; // ✅ NEW

import AISuggestions from "../components/ai/AISuggestions";
import AIChat from "../components/ai/AIChat";

import TransactionForm from "../components/transactions/TransactionForm";
import TransactionList from "../components/transactions/TransactionList";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { convert, convertTo } = useContext(CurrencyContext);

  // 📥 Fetch transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/transactions");
      setTransactions(res.data || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // 💰 Converted totals (HIGH PRECISION FIX)
  const { income, expense } = useMemo(() => {
    const incomePaise = transactions
      .filter((t) => t.type === "income")
      .reduce((a, b) => a + Math.round(convert(b.amount || 0) * 100), 0);

    const expensePaise = transactions
      .filter((t) => t.type === "expense")
      .reduce((a, b) => a + Math.round(convert(b.amount || 0) * 100), 0);

    return {
      income: incomePaise / 100,
      expense: expensePaise / 100,
    };
  }, [transactions, convert]);

  // 🎨 Exchange rate UI
  const rateStyle = {
    fontSize: "13px",
    color: "#475569",
    background: "#f8fafc",
    padding: "6px 10px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0"
  };

  return (
    <div className="app">
      <Sidebar />

      <div className="container">
        <Navbar />

        {/* 🔥 HEADER */} 
        <h3 className="page-title">💸 Dashboard Overview</h3>

        {/* 💱 LIVE RATES */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "15px",
            flexWrap: "wrap"
          }}
        >
          <span style={rateStyle}>
            ₹ → $ : {convertTo(1, "USD")?.toFixed(4)} USD
          </span>

          <span style={rateStyle}>
            ₹ → € : {convertTo(1, "EUR")?.toFixed(4)} EUR
          </span>

          <span style={rateStyle}>
            ₹ → £ : {convertTo(1, "GBP")?.toFixed(4)} GBP
          </span>
        </div>

        {/* ❌ ERROR */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* ⏳ LOADING */}
        {loading && <p>Loading...</p>}

        {!loading && (
          <>
            {/* 🔥 CARDS */}
            <section className="section">
              <DashboardCards income={income} expense={expense} />
            </section>

            {/* 🔥 CATEGORY BUDGET (NEW 🔥🔥🔥) */}
            <section className="section">
              <div className="section-header">
                <h3>🎯 Budget Tracking</h3>
              </div>

              <CategoryBudgets transactions={transactions} />
            </section>

            {/* 🔥 CHARTS */}
            <section className="section">
              <div className="section-header">
                <h3>📊 Financial Analytics</h3>
              </div>

              <div className="grid-2">
                <ExpenseCharts income={income} expense={expense} />
                <PredictionChart transactions={transactions} />
              </div>
            </section>

            {/* 🔥 AI */}
            <section className="section">
             

              <div className="grid-2">
                <AISuggestions transactions={transactions} />
                <AIChat transactions={transactions} />
              </div>
            </section>

            {/* 🔥 TRANSACTIONS */}
            <section className="section">
              <div className="section-header">
                <h3>💳 Transactions</h3>
              </div>

              <div className="grid-2">
                <TransactionForm fetchTransactions={fetchTransactions} />
                <TransactionList
                  transactions={transactions}
                  fetchTransactions={fetchTransactions}
                />
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
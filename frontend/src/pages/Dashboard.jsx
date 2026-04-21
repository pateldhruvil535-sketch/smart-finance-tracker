import { useEffect, useState, useMemo, useContext } from "react";
import API from "../services/api";

import { CurrencyContext } from "../components/context/CurrencyContext";

import DashboardCards from "../components/dashboard/DashboardCards";
import ExpenseCharts from "../components/dashboard/ExpenseCharts";
import PredictionChart from "../components/dashboard/PredictionChart";
import CategoryBudgets from "../components/dashboard/CategoryBudgets";

import AISuggestions from "../components/ai/AISuggestions";
import AIChat from "../components/ai/AIChat";

import TransactionForm from "../components/transactions/TransactionForm";
import TransactionList from "../components/transactions/TransactionList";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // 💰 Totals
  const { income, expense } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((a, b) => a + convert(b.amount || 0), 0);

    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((a, b) => a + convert(b.amount || 0), 0);

    return { income, expense };
  }, [transactions, convert]);

  // 📄 EXPORT PDF
  const exportPDF = async () => {
    const element = document.getElementById("dashboard-report");
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 0, 0, 210, 295);
    pdf.save("dashboard-report.pdf");
  };

  return (
    <div className="dashboard" id="dashboard-report">
      
      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h2>💸 Dashboard Overview</h2>
          <p className="sub-text">Manage and track your finances</p>
        </div>
        <br></br>
        <button className="export-btn" onClick={exportPDF}>
          📤 Export
        </button>
      </div>

      {/* 💱 RATES */}
      <div className="rates">
        <span>₹ → $ {convertTo(1, "USD")?.toFixed(2)}</span>
        <span>₹ → € {convertTo(1, "EUR")?.toFixed(2)}</span>
        <span>₹ → £ {convertTo(1, "GBP")?.toFixed(2)}</span>
      </div>

      {/* ERROR / LOADING */}
      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Loading...</p>}

      {!loading && (
        <>
          <section className="section">
            <DashboardCards income={income} expense={expense} />
          </section>

          <section className="section">
            <h3>🎯 Budget Tracking</h3><br></br>
            <CategoryBudgets transactions={transactions} />
          </section>

          <section className="section">
            <h3>📊 Analytics</h3><br></br>
            <div className="grid-2">
              <ExpenseCharts income={income} expense={expense} />
              <PredictionChart transactions={transactions} />
            </div>
          </section>

          <section className="section">
            <div className="grid-2">
              <AISuggestions transactions={transactions} />
              <AIChat transactions={transactions} />
            </div>
          </section>

          <section className="section">
            <h3>💳 Transactions</h3> <br></br>
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
  );
}
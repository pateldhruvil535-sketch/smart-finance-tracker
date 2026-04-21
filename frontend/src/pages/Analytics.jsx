import { useEffect, useState, useContext } from "react";
import API from "../services/api";

import { CurrencyContext } from "../components/context/CurrencyContext";
import { formatCurrency } from "../utils/currency";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import { Doughnut, Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

export default function Analytics() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("month");

  const { convert, currency } = useContext(CurrencyContext);

  useEffect(() => {
    API.get("/transactions").then((res) =>
      setTransactions(res.data || [])
    );
  }, []);

  // FILTER
  const filtered = transactions.filter((t) => {
    const now = new Date();
    const date = new Date(t.date);

    if (filter === "week") {
      const d = new Date();
      d.setDate(now.getDate() - 7);
      return date >= d;
    }

    if (filter === "month") {
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }

    if (filter === "year") {
      return date.getFullYear() === now.getFullYear();
    }

    return true;
  });

  // CALCULATIONS
  const income = filtered
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + convert(b.amount), 0);

  const expense = filtered
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + convert(b.amount), 0);

  const balance = income - expense;

  const categoryMap = {};
  const dailyMap = {};
  const monthlyMap = {};

  filtered.forEach((t) => {
    const amt = convert(t.amount);

    if (t.type === "expense") {
      const key = t.category || "General";
      categoryMap[key] = (categoryMap[key] || 0) + amt;
    }

    const day = t.date.slice(0, 10);
    dailyMap[day] = (dailyMap[day] || 0) + amt;

    const month = t.date.slice(0, 7);
    if (!monthlyMap[month]) {
      monthlyMap[month] = { income: 0, expense: 0 };
    }

    if (t.type === "income") monthlyMap[month].income += amt;
    else monthlyMap[month].expense += amt;
  });

  const months = Object.keys(monthlyMap);

  const savingsRate = income ? ((income - expense) / income) * 100 : 0;
  const avgDaily = expense / (Object.keys(dailyMap).length || 1);

  // 🆕 WEEKDAY MAP (9th chart)
  const weekdayMap = {
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
  };

  filtered.forEach((t) => {
    if (t.type === "expense") {
      const day = new Date(t.date).toLocaleDateString("en-US", {
        weekday: "short",
      });
      weekdayMap[day] += convert(t.amount);
    }
  });

  // CHART DATA
  const doughnutData = {
    labels: ["Income", "Expense"],
    datasets: [
      { data: [income, expense], backgroundColor: ["#22c55e", "#ef4444"] },
    ],
  };

  const categoryData = {
    labels: Object.keys(categoryMap),
    datasets: [
      { data: Object.values(categoryMap), backgroundColor: "#6366f1" },
    ],
  };

  const monthlyTrend = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: months.map((m) => monthlyMap[m].income),
        borderColor: "#22c55e",
        tension: 0.4,
      },
      {
        label: "Expense",
        data: months.map((m) => monthlyMap[m].expense),
        borderColor: "#ef4444",
        tension: 0.4,
      },
    ],
  };

  const dailyTrend = {
    labels: Object.keys(dailyMap),
    datasets: [
      {
        label: "Daily",
        data: Object.values(dailyMap),
        borderColor: "#3b82f6",
        tension: 0.4,
      },
    ],
  };

  const savingsChart = {
    labels: ["Saved", "Spent"],
    datasets: [
      {
        data: [savingsRate, 100 - savingsRate],
        backgroundColor: ["#22c55e", "#ef4444"],
      },
    ],
  };

  const compareData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [income, expense],
        backgroundColor: ["#22c55e", "#ef4444"],
      },
    ],
  };

  const topCategories = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topCategoryData = {
    labels: topCategories.map((c) => c[0]),
    datasets: [
      {
        data: topCategories.map((c) => c[1]),
        backgroundColor: "#f59e0b",
      },
    ],
  };

  const cashFlow = {
    labels: months,
    datasets: [
      {
        label: "Inflow",
        data: months.map((m) => monthlyMap[m].income),
        backgroundColor: "#22c55e",
      },
      {
        label: "Outflow",
        data: months.map((m) => monthlyMap[m].expense),
        backgroundColor: "#ef4444",
      },
    ],
  };

  const weekdayData = {
    labels: Object.keys(weekdayMap),
    datasets: [
      {
        label: "Spending by Day",
        data: Object.values(weekdayMap),
        backgroundColor: "rgba(56,189,248,0.7)",
        borderRadius: 8,
      },
    ],
  };

  // PDF
  const exportPDF = async () => {
    const el = document.getElementById("report");
    const canvas = await html2canvas(el);
    const pdf = new jsPDF();

    const img = canvas.toDataURL("image/png");
    pdf.addImage(img, "PNG", 0, 0, 210, 295);
    pdf.save("finance-report.pdf");
  };

  return (
    <div className="app">
 

      <div className="container" id="report" style={container}>
    

        {/* HEADER */}
        <div style={{ ...header, padding: "10px" }}>
          <div>
            <h2 style={title}>📊 Financial Analytics</h2>
            <p style={subtitle}>
              Smart insights & performance tracking ({currency})
            </p>
          </div>

          <div style={actions}>
            {["week", "month", "year"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={filter === f ? activeBtn : btn}
              >
                {f}
              </button>
            ))}
            <button onClick={exportPDF} style={exportBtn}>
              📤 Export
            </button>
          </div>
        </div>

        {/* CARDS */}
        <div style={cards}>
          <Card title="Balance" value={balance} currency={currency} />
          <Card title="Income" value={income} currency={currency} />
          <Card title="Expense" value={expense} currency={currency} />
          <Card title="Avg Daily" value={avgDaily} currency={currency} />
        </div>

        {/* CHARTS */}
        <div style={grid}>
          <Chart title="Overview"><Doughnut data={doughnutData} /></Chart>
          <Chart title="Category"><Pie data={categoryData} /></Chart>
          <Chart title="Monthly Trend"><Line data={monthlyTrend} /></Chart>
          <Chart title="Daily Trend"><Line data={dailyTrend} /></Chart>
          <Chart title="Savings Rate"><Doughnut data={savingsChart} /></Chart>
          <Chart title="Comparison"><Bar data={compareData} /></Chart>
          <Chart title="Top Categories"><Bar data={topCategoryData} /></Chart>
          <Chart title="Cash Flow"><Bar data={cashFlow} /></Chart>
          <Chart title="Weekly Spending Pattern"><Bar data={weekdayData} /></Chart>
        </div>
      </div>
    </div>
  );
}

// COMPONENTS
const Card = ({ title, value, currency }) => (
  <div style={card}>
    <p style={cardLabel}>{title}</p>
    <h2 style={cardValue}>{formatCurrency(value, currency)}</h2>
  </div>
);

const Chart = ({ title, children }) => (
  <div style={chart}>
    <div style={chartHeader}>{title}</div>
    <div style={chartBody}>{children}</div>
  </div>
);

// STYLES
const container = {
  padding: "24px",
  maxWidth: "1400px",
  margin: "auto",
  background: "#020617",
  minHeight: "100vh",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap",
  marginBottom: 30,
};

const title = { color: "#fff", fontSize: 24 };
const subtitle = { color: "#94a3b8", fontSize: 13 };

const actions = { display: "flex", gap: 10 };

const btn = {
  padding: "8px 16px",
  background: "transparent",
  color: "#94a3b8",
  border: "1px solid #1e293b",
  borderRadius: 10,
  cursor: "pointer",
};

const activeBtn = { ...btn, background: "#6366f1", color: "#fff" };
const exportBtn = { ...btn, background: "#22c55e", color: "#fff" };

const cards = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
  gap: 20,
  marginBottom: 30,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))",
  gap: 22,
};

const card = {
  padding: 22,
  borderRadius: 18,
  background: "rgba(15,23,42,0.6)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.05)",
};

const cardLabel = { fontSize: 13, color: "#94a3b8" };
const cardValue = { fontSize: 24, fontWeight: "700", color: "#fff" };

const chart = {
  borderRadius: 18,
  background: "rgba(15,23,42,0.6)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.05)",
};

const chartHeader = {
  padding: "12px 16px",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
  color: "#e2e8f0",
};

const chartBody = {
  padding: 16,
  height: 260,
};
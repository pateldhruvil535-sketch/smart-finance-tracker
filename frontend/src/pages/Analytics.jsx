import { useEffect, useState, useContext } from "react";
import API from "../services/api";

import { CurrencyContext } from "../components/context/CurrencyContext";
import { formatCurrency } from "../utils/currency"; // ✅ IMPORTANT

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [transactions, setTransactions] = useState([]);

  const { convert, currency } = useContext(CurrencyContext); // ✅ use context

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions");
      setTransactions(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= CALCULATIONS =================
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + convert(b.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + convert(b.amount), 0);

  const balance = income - expense;
  const hasData = income > 0 || expense > 0;

  // ================= PIE =================
  const pieData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [income, expense],
        backgroundColor: ["#22c55e", "#ef4444"],
      },
    ],
  };

  // ================= CATEGORY =================
  const categoryMap = {};
  transactions.forEach((t) => {
    if (t.type === "expense") {
      const key = t.category || "General";
      categoryMap[key] =
        (categoryMap[key] || 0) + convert(t.amount); // ✅ conversion applied
    }
  });

  const barData = {
    labels: Object.keys(categoryMap),
    datasets: [
      {
        label: "Spending",
        data: Object.values(categoryMap),
        backgroundColor: "#6366f1",
        borderRadius: 10,
      },
    ],
  };

  return (
    <div className="app" style={{ display: "flex", background: "#f1f5f9" }}>
      <Sidebar />

      <div className="container" style={{ flex: 1, padding: "20px" }}>
        <Navbar />

        <h2 style={{ margin: "20px 0" }}>
          📊 Financial Analytics ({currency})
        </h2>

        {/* 🔥 CARDS */}
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div style={card("#e0f2fe")}>
            <p>Balance</p>
            <h2>{formatCurrency(balance, currency)}</h2>
          </div>

          <div style={card("#dcfce7")}>
            <p>Income</p>
            <h2>{formatCurrency(income, currency)}</h2>
          </div>

          <div style={card("#fee2e2")}>
            <p>Expense</p>
            <h2>{formatCurrency(expense, currency)}</h2>
          </div>
        </div>

        {/* 🔥 CHARTS */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "25px",
            flexWrap: "wrap",
          }}
        >
          {/* PIE */}
          <div style={chartCard}>
            <h3>Income vs Expense</h3>

            {!hasData ? (
              <p>No data available</p>
            ) : (
              <div style={{ position: "relative", height: "250px" }}>
                <Pie data={pieData} options={{ cutout: "70%" }} />

                {/* CENTER TEXT */}
                <div style={centerText}>
                  <p>Balance</p>
                  <h2>{formatCurrency(balance, currency)}</h2>
                </div>
              </div>
            )}
          </div>

          {/* BAR */}
          <div style={chartCard}>
            <h3>Category Breakdown</h3>

            {Object.keys(categoryMap).length === 0 ? (
              <p>No data available</p>
            ) : (
              <div style={{ height: "250px" }}>
                <Bar data={barData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 🎨 STYLES
const card = (bg) => ({
  flex: "1 1 250px",
  padding: "20px",
  borderRadius: "14px",
  background: bg,
  textAlign: "center",
});

const chartCard = {
  flex: "1 1 400px",
  padding: "20px",
  borderRadius: "16px",
  background: "#fff",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
};

const centerText = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  textAlign: "center",
};

export default Analytics;
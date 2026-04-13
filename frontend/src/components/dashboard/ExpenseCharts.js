import { useContext } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";

import { CurrencyContext } from "../context/CurrencyContext";
import { formatCurrency } from "../../utils/currency";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function ExpenseCharts({ income = 0, expense = 0 }) {
  const { currency } = useContext(CurrencyContext);

  const hasData = income > 0 || expense > 0;

  const balance = Number((income - expense).toFixed(2));

  // 💱 Format
  const format = (val) => formatCurrency(val, currency);

  // 📊 Percentages
  const total = income + expense;
  const incomePercent = total ? ((income / total) * 100).toFixed(1) : 0;
  const expensePercent = total ? ((expense / total) * 100).toFixed(1) : 0;

  // ================= PIE =================
  const pieData = {
    labels: [
      `Income (${incomePercent}%)`,
      `Expense (${expensePercent}%)`
    ],
    datasets: [
      {
        data: [income, expense],
        backgroundColor: ["#22c55e", "#ef4444"],
        borderWidth: 0,
        hoverOffset: 14
      }
    ]
  };

  // ================= BAR =================
  const barData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        label: "Amount",
        data: [income, expense],
        backgroundColor: ["#6366f1", "#ef4444"],
        borderRadius: 12,
        barThickness: 50
      }
    ]
  };

  // ================= OPTIONS =================
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1200,
      easing: "easeOutQuart"
    },
    plugins: {
      legend: {
        labels: {
          color: "#475569",
          font: { size: 13 }
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return format(context.raw);
          }
        }
      }
    }
  };

  const barOptions = {
    ...commonOptions,
    scales: {
      x: {
        ticks: { color: "#64748b" },
        grid: { display: false }
      },
      y: {
        ticks: {
          color: "#64748b",
          callback: (value) => format(value)
        },
        grid: { color: "#e2e8f0" }
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
      }}
    >
      {/* ================= PIE ================= */}
      <div
        style={{
          flex: "1 1 350px",
          background: "#ffffff",
          padding: "20px",
          borderRadius: "16px",
          boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
        }}
      >
        <h3 style={{ marginBottom: "15px", color: "#1e293b" }}>
          📊 Income vs Expense
        </h3>

        {!hasData ? (
          <p style={{ color: "#94a3b8" }}>No data available</p>
        ) : (
          <div style={{ position: "relative", height: "260px" }}>
            <Pie
              data={pieData}
              options={{
                ...commonOptions,
                cutout: "72%"
              }}
            />

            {/* 🔥 CENTER */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: "12px", color: "#64748b" }}>
                Balance
              </p>
              <h2
                style={{
                  color: balance >= 0 ? "#16a34a" : "#dc2626",
                  fontWeight: "600"
                }}
              >
                {format(balance)}
              </h2>
            </div>
          </div>
        )}
      </div>

      {/* ================= BAR ================= */}
      <div
        style={{
          flex: "1 1 350px",
          background: "#ffffff",
          padding: "20px",
          borderRadius: "16px",
          boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
        }}
      >
        <h3 style={{ marginBottom: "15px", color: "#1e293b" }}>
          📈 Overview
        </h3>

        {!hasData ? (
          <p style={{ color: "#94a3b8" }}>No data available</p>
        ) : (
          <div style={{ height: "260px" }}>
            <Bar data={barData} options={barOptions} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpenseCharts;
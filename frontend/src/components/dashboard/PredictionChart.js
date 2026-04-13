import { useContext } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

import { CurrencyContext } from "../context/CurrencyContext";
import { formatCurrency } from "../../utils/currency";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

function PredictionChart({ transactions = [] }) {
  const { currency, convert } = useContext(CurrencyContext);

  // ================= GROUP BY MONTH =================
  const monthlyMap = {};

  transactions.forEach((t) => {
    if (!t.date) return;

    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;

    if (!monthlyMap[key]) {
      monthlyMap[key] = {
        label: d.toLocaleString("default", {
          month: "short",
          year: "2-digit"
        }),
        income: 0,
        expense: 0
      };
    }

    const amount = convert ? convert(t.amount) : t.amount;

    if (t.type === "income") {
      monthlyMap[key].income += amount;
    } else {
      monthlyMap[key].expense += amount;
    }
  });

  // ================= SORT =================
  const sorted = Object.entries(monthlyMap).sort(
    (a, b) => {
      const [y1, m1] = a[0].split("-");
      const [y2, m2] = b[0].split("-");
      return new Date(y1, m1) - new Date(y2, m2);
    }
  );

  const labels = sorted.map((i) => i[1].label);
  const incomeArr = sorted.map((i) => i[1].income);
  const expenseArr = sorted.map((i) => i[1].expense);

  // ================= PREDICTION =================
  let futureLabels = [];
  let predictedExpense = [];

  if (expenseArr.length >= 2) {
    let growthRates = [];

    for (let i = 1; i < expenseArr.length; i++) {
      const prev = expenseArr[i - 1] || 1;
      const growth = (expenseArr[i] - prev) / prev;
      growthRates.push(growth);
    }

    let avgGrowth =
      growthRates.reduce((a, b) => a + b, 0) / growthRates.length;

    avgGrowth = Math.max(-0.5, Math.min(avgGrowth, 1));

    let last = expenseArr[expenseArr.length - 1];

    for (let i = 1; i <= 3; i++) {
      last = last * (1 + avgGrowth);
      predictedExpense.push(Math.round(last));
      futureLabels.push(`+${i}M`);
    }
  }

  const finalLabels =
    expenseArr.length >= 2
      ? [...labels, ...futureLabels]
      : labels;

  // ================= DATA =================
  const data = {
    labels: finalLabels,
    datasets: [
      {
        label: "Income",
        data: incomeArr,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 4
      },
      {
        label: "Expense",
        data: expenseArr,
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.1)",
        tension: 0.4,
        fill: true,
        pointRadius: 4
      },
      {
        label: "Predicted Expense",
        data:
          expenseArr.length >= 2
            ? [
                ...Array(expenseArr.length - 1).fill(null),
                expenseArr[expenseArr.length - 1],
                ...predictedExpense
              ]
            : [],
        borderColor: "#f59e0b",
        borderDash: [6, 6],
        tension: 0.4,
        pointRadius: 4
      }
    ]
  };

  // ================= OPTIONS =================
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1200
    },
    plugins: {
      legend: {
        labels: { color: "#475569" }
      },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            formatCurrency(ctx.raw || 0, currency)
        }
      }
    },
    scales: {
      x: {
        ticks: { color: "#64748b" },
        grid: { display: false }
      },
      y: {
        ticks: {
          color: "#64748b",
          callback: (val) =>
            formatCurrency(val, currency)
        },
        grid: { color: "#e2e8f0" }
      }
    }
  };

  // ================= TREND =================
  const trend =
    expenseArr.length >= 2
      ? expenseArr[expenseArr.length - 1] >
        expenseArr[expenseArr.length - 2]
        ? "increasing 📈"
        : "decreasing 📉"
      : null;

  return (
    <div
      style={{
        background: "#ffffff",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
      }}
    >
      <h3 style={{ marginBottom: "10px", color: "#1e293b" }}>
        🔮 Financial Trend & Prediction
      </h3>

      {expenseArr.length < 2 ? (
        <p style={{ color: "#94a3b8" }}>
          Add at least 2 months data
        </p>
      ) : (
        <>
          <div
            style={{
              marginBottom: "10px",
              fontSize: "14px",
              color: "#475569",
            }}
          >
            Expense trend is <b>{trend}</b>
          </div>

          <div style={{ height: "320px" }}>
            <Line data={data} options={options} />
          </div>
        </>
      )}
    </div>
  );
}

export default PredictionChart;
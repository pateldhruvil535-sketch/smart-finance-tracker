import { useState, useEffect, useContext } from "react";
import { CurrencyContext } from "../context/CurrencyContext";
import { formatCurrency } from "../../utils/currency";

function CategoryBudgets({ transactions = [] }) {
  const { currency } = useContext(CurrencyContext);

  // 📅 Current month key (IMPORTANT)
  const currentMonth = new Date().toISOString().slice(0, 7);

  const [budgets, setBudgets] = useState({});

  // 🔄 Load budgets
  useEffect(() => {
    const saved = localStorage.getItem("categoryBudgets");
    if (saved) setBudgets(JSON.parse(saved));
  }, []);

  // 💾 Save budgets
  const saveBudgets = (data) => {
    setBudgets(data);
    localStorage.setItem("categoryBudgets", JSON.stringify(data));
  };

  // ➕ Set budget
  const handleSetBudget = (category) => {
    const value = prompt(`Enter monthly budget for ${category}`);
    if (!value) return;

    const updated = {
      ...budgets,
      [currentMonth]: {
        ...(budgets[currentMonth] || {}),
        [category]: Number(value),
      },
    };

    saveBudgets(updated);
  };

  // 🧠 Calculate current month expenses
  const categorySpent = {};

  transactions.forEach((t) => {
    if (t.type === "expense" && t.date) {
      const month = new Date(t.date).toISOString().slice(0, 7);

      if (month === currentMonth) {
        const key = t.category || "General";
        categorySpent[key] =
          (categorySpent[key] || 0) + (t.amount || 0);
      }
    }
  });

  const categories = Object.keys(categorySpent);

  if (!categories.length) {
    return (
      <div className="card">
        <h3>🎯 Budget Tracking</h3>
        <p>No expense data for this month</p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#ffffff",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
      }}
    >
      <h3 style={{ marginBottom: "15px" }}>
        🎯 Monthly Budget ({currentMonth})
      </h3>

      {categories.map((cat) => {
        const spent = categorySpent[cat] || 0;
        const limit =
          budgets[currentMonth]?.[cat] || 0;

        const percent =
          limit > 0 ? (spent / limit) * 100 : 0;

        const capped = Math.min(percent, 100);

        // 🎨 COLORS
        const color =
          percent > 100
            ? "#ef4444"
            : percent > 75
            ? "#f59e0b"
            : "#22c55e";

        // 🧠 STATUS
        const status =
          percent > 100
            ? "Over Budget 🚨"
            : percent > 75
            ? "Almost Limit ⚠️"
            : "On Track ✅";

        return (
          <div
            key={cat}
            style={{
              marginBottom: "18px",
              paddingBottom: "10px",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            {/* HEADER */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "6px",
              }}
            >
              <strong>{cat}</strong>

              <button
                onClick={() => handleSetBudget(cat)}
                style={{
                  fontSize: "11px",
                  background: "#6366f1",
                  color: "#fff",
                  border: "none",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Set / Edit
              </button>
            </div>

            {/* STATUS */}
            <div
              style={{
                fontSize: "12px",
                color,
                marginBottom: "4px",
                fontWeight: "500",
              }}
            >
              {status}
            </div>

            {/* AMOUNT */}
            <div
              style={{
                fontSize: "13px",
                marginBottom: "6px",
                color: "#475569",
              }}
            >
              {formatCurrency(spent, currency)} /{" "}
              {limit
                ? formatCurrency(limit, currency)
                : "No limit"}
            </div>

            {/* BAR */}
            <div
              style={{
                height: "10px",
                background: "#e2e8f0",
                borderRadius: "999px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${capped}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${color}, #6366f1)`,
                  transition: "width 0.6s ease",
                }}
              />
            </div>

            {/* FOOTER */}
            <div
              style={{
                fontSize: "12px",
                marginTop: "4px",
                display: "flex",
                justifyContent: "space-between",
                color: "#64748b",
              }}
            >
              <span>{percent.toFixed(1)}%</span>

              <span>
                {percent > 100
                  ? `Exceeded by ${formatCurrency(
                      spent - limit,
                      currency
                    )}`
                  : `${formatCurrency(
                      Math.max(limit - spent, 0),
                      currency
                    )} left`}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CategoryBudgets;
import { useState, useEffect, useContext } from "react";
import { CurrencyContext } from "../context/CurrencyContext";
import { formatCurrency } from "../../utils/currency";

function CategoryBudgets({ transactions = [] }) {
  const { currency } = useContext(CurrencyContext);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const [budgets, setBudgets] = useState({});

  // 🔄 Load budgets
  useEffect(() => {
    const saved = localStorage.getItem("categoryBudgets");
    if (saved) setBudgets(JSON.parse(saved));
  }, []);

  // 💾 Save
  const saveBudgets = (data) => {
    setBudgets(data);
    localStorage.setItem("categoryBudgets", JSON.stringify(data));
  };

  // ➕ Manual budget
  const handleSetBudget = (category) => {
    const value = prompt(`Enter budget for ${category}`);
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

  // 🔄 Reset
  const resetBudget = () => {
    const updated = { ...budgets };
    delete updated[currentMonth];
    saveBudgets(updated);
  };

  // 🤖 Auto Budget (SMART RULE)
  const generateAutoBudget = () => {
    let income = transactions
      .filter((t) => t.type === "income")
      .reduce((a, b) => a + (b.amount || 0), 0);

    if (!income) return;

    const categorySpent = {};
    transactions.forEach((t) => {
      if (t.type === "expense") {
        const key = t.category || "General";
        categorySpent[key] =
          (categorySpent[key] || 0) + (t.amount || 0);
      }
    });

    const totalExpense = Object.values(categorySpent).reduce(
      (a, b) => a + b,
      0
    );

    const suggested = {};
    Object.keys(categorySpent).forEach((cat) => {
      const ratio = categorySpent[cat] / totalExpense;
      suggested[cat] = Math.round(income * ratio * 0.7);
    });

    saveBudgets({
      ...budgets,
      [currentMonth]: suggested,
    });
  };

  // 📊 Category Spend
  const categorySpent = {};
  transactions.forEach((t) => {
    if (t.type === "expense") {
      const key = t.category || "General";
      categorySpent[key] =
        (categorySpent[key] || 0) + (t.amount || 0);
    }
  });

  const categories = Object.keys(categorySpent);

  // 🔥 Top category
  const topCategory =
    categories.length > 0
      ? categories.reduce((a, b) =>
          categorySpent[a] > categorySpent[b] ? a : b
        )
      : null;

  if (!categories.length) {
    return (
      <div style={container}>
        <h3>🎯 Budget Tracking</h3>
        <p style={{ color: "#64748b" }}>
          No expense data available
        </p>
      </div>
    );
  }

  return (
    <div style={container}>
      {/* 🔥 HEADER */}
      <div style={header}>
        <h3>🎯 Monthly Budget ({currentMonth})</h3>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={generateAutoBudget} style={autoBtn}>
            🤖 Auto
          </button>

          <button onClick={resetBudget} style={resetBtn}>
            Reset
          </button>
        </div>
      </div>

      {/* 🔥 CATEGORY LIST */}
      {categories.map((cat) => {
        const spent = categorySpent[cat];
        const limit = budgets[currentMonth]?.[cat] || 0;

        const percent = limit ? (spent / limit) * 100 : 0;
        const capped = Math.min(percent, 100);

        const color =
          percent > 100
            ? "#ef4444"
            : percent > 75
            ? "#f59e0b"
            : "#22c55e";

        const remaining = Math.max(limit - spent, 0);

        return (
          <div key={cat} style={item}>
            {/* HEADER */}
            <div style={row}>
              <strong>
                {cat} {cat === topCategory && "🔥"}
              </strong>

              <button
                onClick={() => handleSetBudget(cat)}
                style={editBtn}
              >
                Edit
              </button>
            </div>

            {/* STATUS */}
            <div style={{ fontSize: "12px", color }}>
              {limit === 0
                ? "No budget set"
                : percent > 100
                ? "Over Budget 🚨"
                : percent > 75
                ? "Almost Limit ⚠️"
                : "On Track ✅"}
            </div>

            {/* AMOUNT */}
            <div style={amount}>
              {formatCurrency(spent, currency)} /{" "}
              {limit
                ? formatCurrency(limit, currency)
                : "Set limit"}
            </div>

            {/* BAR */}
            <div style={barBg}>
              <div
                style={{
                  width: `${capped}%`,
                  ...barFill(color),
                }}
              />
            </div>

            {/* FOOTER */}
            <div style={footer}>
              <span>{percent.toFixed(1)}%</span>

              <span>
                {limit
                  ? percent > 100
                    ? `Exceeded by ${formatCurrency(
                        spent - limit,
                        currency
                      )}`
                    : `${formatCurrency(
                        remaining,
                        currency
                      )} left`
                  : "Click Edit to set"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* 🎨 UI */
const container = {
  background: "#fff",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const autoBtn = {
  background: "#6366f1",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "8px",
  cursor: "pointer",
};

const resetBtn = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "8px",
  cursor: "pointer",
};

const item = {
  marginBottom: "18px",
  paddingBottom: "10px",
  borderBottom: "1px solid #f1f5f9",
};

const row = {
  display: "flex",
  justifyContent: "space-between",
};

const editBtn = {
  background: "#6366f1",
  color: "#fff",
  border: "none",
  padding: "4px 8px",
  borderRadius: "6px",
  cursor: "pointer",
};

const amount = {
  fontSize: "13px",
  margin: "6px 0",
  color: "#475569",
};

const barBg = {
  height: "10px",
  background: "#e2e8f0",
  borderRadius: "999px",
  overflow: "hidden",
};

const barFill = (color) => ({
  height: "100%",
  background: `linear-gradient(90deg, ${color}, #6366f1)`,
  transition: "width 0.5s ease",
});

const footer = {
  fontSize: "12px",
  display: "flex",
  justifyContent: "space-between",
  color: "#64748b",
};

export default CategoryBudgets;
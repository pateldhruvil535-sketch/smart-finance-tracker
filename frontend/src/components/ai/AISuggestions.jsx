import { useEffect, useState } from "react";

function AISuggestions({ transactions = [] }) {
  const [tips, setTips] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!transactions.length) {
      setTips([
        { text: "Start adding transactions to unlock AI insights", type: "info" }
      ]);
      setScore(0);
      return;
    }

    let income = transactions
      .filter((t) => t.type === "income")
      .reduce((a, b) => a + (b.amount || 0), 0);

    let expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((a, b) => a + (b.amount || 0), 0);

    let savings = income - expense;

    let suggestions = [];
    let healthScore = 100;

    // 🔥 Core Logic
    if (expense > income) {
      healthScore -= 40;
      suggestions.push({
        text: "You are spending more than you earn",
        type: "danger",
      });
    }

    if (expense > income * 0.7) {
      healthScore -= 20;
      suggestions.push({
        text: "Expenses are quite high, try reducing them",
        type: "warning",
      });
    }

    if (savings > income * 0.3) {
      healthScore += 10;
      suggestions.push({
        text: "Excellent savings habit! Keep it up",
        type: "success",
      });
    }

    if (savings <= 0) {
      suggestions.push({
        text: "No savings detected. Try saving at least 20% of income",
        type: "danger",
      });
    }

    // 🔥 Category Insight
    const categoryMap = {};
    transactions.forEach((t) => {
      if (t.type === "expense") {
        const key = t.category || "Other";
        categoryMap[key] =
          (categoryMap[key] || 0) + (t.amount || 0);
      }
    });

    let topCategory = null;
    if (Object.keys(categoryMap).length) {
      topCategory = Object.keys(categoryMap).reduce((a, b) =>
        categoryMap[a] > categoryMap[b] ? a : b
      );
    }

    if (topCategory) {
      suggestions.push({
        text: `Highest spending is on "${topCategory}"`,
        type: "info",
      });
    }

    // 🔥 Trend Analysis
    if (transactions.length >= 6) {
      const recent = transactions.slice(-3);
      const previous = transactions.slice(-6, -3);

      const recentExpense = recent
        .filter((t) => t.type === "expense")
        .reduce((a, b) => a + (b.amount || 0), 0);

      const prevExpense = previous
        .filter((t) => t.type === "expense")
        .reduce((a, b) => a + (b.amount || 0), 0);

      if (recentExpense > prevExpense) {
        healthScore -= 10;
        suggestions.push({
          text: "Your spending is increasing recently",
          type: "warning",
        });
      } else {
        suggestions.push({
          text: "Spending trend is stable or decreasing",
          type: "success",
        });
      }
    }

    // 🔥 Transaction Behavior
    if (transactions.length > 30) {
      suggestions.push({
        text: "You have many transactions. Consider budgeting strictly",
        type: "info",
      });
    }

    if (transactions.length < 5) {
      suggestions.push({
        text: "Add more transactions for better insights",
        type: "info",
      });
    }

    // 🔥 Final Score Clamp
    healthScore = Math.max(0, Math.min(100, healthScore));

    if (!suggestions.length) {
      suggestions.push({
        text: "Everything looks balanced. Keep tracking!",
        type: "success",
      });
    }

    setScore(healthScore);
    setTips(suggestions);
  }, [transactions]);

  // 🎨 Styles
  const getStyle = (type) => {
    switch (type) {
      case "danger":
        return { borderLeft: "4px solid #ef4444" };
      case "warning":
        return { borderLeft: "4px solid #f59e0b" };
      case "success":
        return { borderLeft: "4px solid #22c55e" };
      default:
        return { borderLeft: "4px solid #3b82f6" };
    }
  };

  const scoreColor =
    score > 75 ? "#22c55e" : score > 50 ? "#f59e0b" : "#ef4444";

return (
  <div className="ai-container fade-in">
    <h3 className="ai-title">🤖 AI Financial Insights</h3>

    {/* 🔥 SCORE */}
    <div className="score-card">
      <div className="score-circle">
        <span style={{ color: scoreColor }}>{score}</span>
      </div>

      <div className="score-info">
        <h4>Financial Health</h4>
        <p>
          {score > 75
            ? "Excellent 💚"
            : score > 50
            ? "Needs Improvement ⚠️"
            : "High Risk 🚨"}
        </p>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${score}%`,
              background: scoreColor,
            }}
          />
        </div>
      </div>
    </div>

    {/* 🔥 TIPS */}
    <div className="tips-container">
      {tips.map((tip, i) => (
        <div key={i} className={`tip-card ${tip.type}`}>
          <span className="tip-icon">
            {tip.type === "danger" && "🚨"}
            {tip.type === "warning" && "⚠️"}
            {tip.type === "success" && "✅"}
            {tip.type === "info" && "💡"}
          </span>

          <p>{tip.text}</p>
        </div>
      ))}
    </div>
  </div>

  );
}

export default AISuggestions;
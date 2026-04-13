import React from "react";

function InsightsPanel({ insights }) {
  if (!insights) return null;

  const isPositive = insights.percentageChange >= 0;

  return (
    <div className="card fade-in">
      <h3 className="insights-title">📊 Insights Overview</h3>

      {/* 🔥 GRID */}
      <div className="insights-grid">

        <div className="insight-box">
          <p>Total Spent</p>
          <h4>₹{insights.totalSpent}</h4>
        </div>

        <div className="insight-box">
          <p>Top Category</p>
          <h4>{insights.topCategory}</h4>
        </div>

        <div className="insight-box">
          <p>This Month</p>
          <h4>₹{insights.thisMonthTotal}</h4>
        </div>

        <div className="insight-box">
          <p>Last Month</p>
          <h4>₹{insights.lastMonthTotal}</h4>
        </div>

        <div className="insight-box">
          <p>Change</p>
          <h4 className={isPositive ? "negative" : "positive"}>
            {insights.percentageChange}% {isPositive ? "📈" : "📉"}
          </h4>
        </div>

      </div>

      {/* 🔥 ALERTS */}
      {insights.alerts?.length > 0 && (
        <div className="alerts">
          {insights.alerts.map((a, i) => (
            <p key={i}>⚠️ {a}</p>
          ))}
        </div>
      )}

      {/* 🔥 SMART MESSAGE */}
      <div className="insight-message">
        {insights.message}
      </div>
    </div>
  );
}

export default InsightsPanel;
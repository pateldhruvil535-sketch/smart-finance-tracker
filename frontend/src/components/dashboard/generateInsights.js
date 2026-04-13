export function generateInsights(transactions = []) {
  if (!transactions.length) return null;

  const income = transactions
    .filter(t => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

  const now = new Date();
  const thisMonth = now.getMonth();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;

  let thisMonthTotal = 0;
  let lastMonthTotal = 0;

  transactions.forEach(t => {
    const d = new Date(t.date);
    if (t.type === "expense") {
      if (d.getMonth() === thisMonth) thisMonthTotal += t.amount;
      if (d.getMonth() === lastMonth) lastMonthTotal += t.amount;
    }
  });

  const percentageChange =
    lastMonthTotal === 0
      ? 100
      : Number(
          (((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(1)
        );

  const categoryMap = {};
  transactions.forEach(t => {
    if (t.type === "expense") {
      const key = t.category || "General";
      categoryMap[key] = (categoryMap[key] || 0) + t.amount;
    }
  });

  const topCategory =
    Object.keys(categoryMap).length > 0
      ? Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0][0]
      : "N/A";

  const alerts = [];

  if (expense > income) {
    alerts.push("You are spending more than your income!");
  }

  if (percentageChange > 20) {
    alerts.push("Spending increased significantly this month.");
  }

  let message = "";

  if (expense === 0) {
    message = "Start tracking expenses to get insights.";
  } else if (expense < income * 0.5) {
    message = "Excellent saving habit!";
  } else if (expense < income) {
    message = "You are managing okay, try to save more.";
  } else {
    message = "Expenses exceed income. Reduce spending.";
  }

  return {
    totalSpent: expense,
    topCategory,
    thisMonthTotal,
    lastMonthTotal,
    percentageChange,
    alerts,
    message,
  };
}
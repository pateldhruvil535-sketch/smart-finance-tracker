const calculateAnalytics = (transactions = []) => {
  let income = 0, expense = 0;
  const map = {};

  transactions.forEach(t => {
    if (t.type === "income") income += t.amount;
    else {
      expense += t.amount;
      map[t.category] = (map[t.category] || 0) + t.amount;
    }
  });

  const balance = income - expense;

  const topCategory = Object.keys(map).length
    ? Object.keys(map).reduce((a, b) => map[a] > map[b] ? a : b)
    : "None";

  return { income, expense, balance, topCategory, map };
};

module.exports = calculateAnalytics;
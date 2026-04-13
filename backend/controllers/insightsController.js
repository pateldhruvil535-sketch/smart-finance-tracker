const Transaction = require("../models/Transaction");
const calculateAnalytics = require("../utils/analytics");

exports.getInsights = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user._id
    });

    const data = calculateAnalytics(transactions);

    // ================= SMART SUGGESTIONS =================
    const suggestions = [];

    // 1. Overspending check
    if (data.expense > data.income) {
      suggestions.push("⚠️ You are spending more than you earn. Try to reduce expenses.");
    }

    // 2. Savings suggestion
    const savings = data.income - data.expense;
    if (savings > 0) {
      suggestions.push(`💰 Good job! You saved ₹${savings}. Consider investing.`);
    } else {
      suggestions.push("❗ No savings detected. Try to save at least 20% of income.");
    }

    // 3. Top spending category
    const topCategory = Object.entries(data.categoryMap || {})
      .sort((a, b) => b[1] - a[1])[0];

    if (topCategory) {
      suggestions.push(
        `📊 Highest spending is on "${topCategory[0]}". Try to control it.`
      );
    }

    // 4. Too many expenses
    if (transactions.length > 20) {
      suggestions.push("🧾 You have many transactions. Consider budgeting.");
    }

    // 5. Healthy ratio
    if (data.income > 0 && data.expense / data.income < 0.5) {
      suggestions.push("✅ Excellent! Your spending is under control.");
    }

    res.json({
      ...data,
      suggestions
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
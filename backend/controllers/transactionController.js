const Budget = require("../models/Budget");
const transactionRepo = require("../repositories/transactionRepository");

// ➕ Add Transaction
exports.addTransaction = async (req, res) => {
  try {
    let { title, amount, type, category, date } = req.body;

    if (!title || !amount || !type || !date) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Default category
    if (!category) {
      category = "Other";
    }

    // ✅ Safe date conversion
    const safeDate = new Date(date + "T00:00:00.000Z");

    if (isNaN(safeDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const transaction = await transactionRepo.createTransaction({
      user: req.user._id,
      title,
      amount,
      type,
      category,
      date: safeDate
    });

    // 🔥 Budget check
    let alert = null;

    if (type === "expense") {
      const totalSpent = await transactionRepo.getTotalByCategory(
        req.user._id,
        category
      );

      const budget = await Budget.findOne({
        user: req.user._id,
        category
      });

      if (budget && totalSpent > budget.limit) {
        alert = `⚠️ Budget exceeded for ${category}`;
      }
    }

    res.json({ transaction, alert });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// 📥 Get Transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await transactionRepo.getTransactionsByUser(
      req.user._id
    );

    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// ❌ Delete Transaction
exports.deleteTransaction = async (req, res) => {
  try {
    await transactionRepo.deleteTransaction(
      req.params.id,
      req.user._id
    );

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
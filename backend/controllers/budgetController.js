const Budget = require("../models/Budget");

// ================= SET / CREATE =================
exports.setBudget = async (req, res) => {
  try {
    const { category, limit } = req.body;

    if (!category || !limit) {
      return res.status(400).json({ message: "Category and limit required" });
    }

    let budget = await Budget.findOne({
      user: req.user._id,
      category
    });

    if (budget) {
      budget.limit = limit;
      await budget.save();
    } else {
      budget = await Budget.create({
        user: req.user._id,
        category,
        limit
      });
    }

    res.json(budget);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET =================
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({
      user: req.user._id
    });

    res.json(budgets);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= DELETE =================
exports.deleteBudget = async (req, res) => {
  try {
    const deleted = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!deleted) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json({ message: "Budget deleted" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
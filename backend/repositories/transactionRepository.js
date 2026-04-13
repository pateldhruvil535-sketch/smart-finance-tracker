const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");

// ➕ Create transaction
exports.createTransaction = async (data) => {
  return await Transaction.create(data);
};

// 📥 Get all transactions by user
exports.getTransactionsByUser = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid userId");
  }

  return await Transaction.find({ user: userId })
    .sort({ date: -1 });
};

// ❌ Delete transaction
exports.deleteTransaction = async (id, userId) => {
  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    throw new Error("Invalid ID");
  }

  const deleted = await Transaction.findOneAndDelete({
    _id: id,
    user: userId
  });

  if (!deleted) {
    throw new Error("Transaction not found");
  }

  return deleted;
};

// 📊 Monthly total by category
exports.getTotalByCategory = async (userId, category) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid userId");
  }

  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);

  const result = await Transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        category,
        type: "expense",
        date: { $gte: startOfMonth }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" }
      }
    }
  ]);

  return result[0]?.total || 0;
};
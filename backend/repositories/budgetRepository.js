const Budget = require("../models/Budget");
const mongoose = require("mongoose");

// Create or update budget
exports.upsertBudget = async (userId, category, limit) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid userId");
  }

  return await Budget.findOneAndUpdate(
    { user: userId, category },
    { limit },
    { new: true, upsert: true, runValidators: true }
  );
};

// Get all budgets for user
exports.getBudgetsByUser = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid userId");
  }

  return await Budget.find({ user: userId });
};

// Delete budget
exports.deleteBudget = async (id, userId) => {
  if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid ID");
  }

  return await Budget.findOneAndDelete({
    _id: id,
    user: userId
  });
};

// Get budget by category
exports.getBudgetByCategory = async (userId, category) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid userId");
  }

  return await Budget.findOne({
    user: userId,
    category
  });
};
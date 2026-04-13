const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    limit: {
      type: Number,
      required: true,
      min: [0, "Limit must be positive"]
    }
  },
  { timestamps: true }
);

// ✅ Unique budget per user per category
BudgetSchema.index({ user: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("Budget", BudgetSchema);
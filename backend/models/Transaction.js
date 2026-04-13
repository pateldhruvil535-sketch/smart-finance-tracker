const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  amount: {
    type: Number,
    required: true,
    min: 0
  },

  type: {
    type: String,
    enum: ["income", "expense"],
    required: true
  },

  category: {
    type: String,
    default: "Other",
    trim: true
  },

  // stored in UTC
  date: {
    type: Date,
    required: true,
    index: true
  }

}, { timestamps: true });

// Indexes for performance
schema.index({ user: 1, category: 1, type: 1 });
schema.index({ user: 1, date: -1 }); // useful for sorting & filtering

module.exports = mongoose.model("Transaction", schema);
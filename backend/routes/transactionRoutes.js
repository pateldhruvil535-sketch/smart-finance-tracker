const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addTransaction,
  getTransactions,
  deleteTransaction
} = require("../controllers/transactionController");

// 🔐 Protect all routes
router.use(authMiddleware);

// 📌 Routes
router.route("/")
  .get(getTransactions)
  .post(addTransaction);

router.delete("/:id", deleteTransaction);

module.exports = router;
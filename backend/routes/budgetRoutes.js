const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  setBudget,
  getBudgets,
  deleteBudget
} = require("../controllers/budgetController");

// 🔥 Apply auth to all routes
router.use(authMiddleware);

router.route("/")
  .get(getBudgets)
  .post(setBudget);

router.delete("/:id", deleteBudget);

module.exports = router;
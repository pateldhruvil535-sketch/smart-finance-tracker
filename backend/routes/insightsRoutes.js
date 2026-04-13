const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getInsights } = require("../controllers/insightsController");

// 🔥 Protect all routes
router.use(authMiddleware);

router.get("/", getInsights);

module.exports = router;
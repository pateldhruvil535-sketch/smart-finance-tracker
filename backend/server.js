const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const logger = require("./utils/logger");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Root route (ADD THIS)
app.get("/", (req, res) => {
  res.send("Smart Finance API is running 🚀");
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/budgets", require("./routes/budgetRoutes"));
app.use("/api/insights", require("./routes/insightsRoutes"));

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => logger.info("MongoDB Connected"))
  .catch(err => logger.error(err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on ${PORT}`));
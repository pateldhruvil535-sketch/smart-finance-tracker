const cron = require("node-cron");
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");

cron.schedule("0 0 * * *", async () => {
  try {
    const start = new Date();
    start.setDate(1);
    start.setHours(0,0,0,0);

    const budgets = await Budget.find();

    for (const b of budgets) {
      const result = await Transaction.aggregate([
        {
          $match: {
            user: b.user,
            category: b.category,
            type: "expense",
            date: { $gte: start }
          }
        },
        {
          $group: { _id: null, total: { $sum: "$amount" } }
        }
      ]);

      const spent = result[0]?.total || 0;

      if (spent > b.limit) {
        console.log(`⚠️ ${b.category} exceeded`);
      }
    }

  } catch (err) {
    console.error(err);
  }
}, { timezone: "Asia/Kolkata" });
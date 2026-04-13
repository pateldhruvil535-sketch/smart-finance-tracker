const Joi = require("joi");

// ================= CREATE / UPDATE BUDGET =================
exports.budgetSchema = Joi.object({
  category: Joi.string().required()
    .messages({
      "string.empty": "Category is required"
    }),

  limit: Joi.number().positive().required()
    .messages({
      "number.base": "Limit must be a number",
      "number.positive": "Limit must be greater than 0"
    })
});
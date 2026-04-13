const Joi = require("joi");

// ================= CREATE TRANSACTION =================
exports.transactionSchema = Joi.object({
  title: Joi.string().min(2).required()
    .messages({
      "string.empty": "Title is required"
    }),

  amount: Joi.number().positive().required()
    .messages({
      "number.base": "Amount must be a number",
      "number.positive": "Amount must be greater than 0"
    }),

  type: Joi.string().valid("income", "expense").required()
    .messages({
      "any.only": "Type must be income or expense"
    }),

  category: Joi.string().optional()
});
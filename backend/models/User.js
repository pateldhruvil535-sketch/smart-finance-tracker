const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"]
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false // 🔥 hide password by default
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
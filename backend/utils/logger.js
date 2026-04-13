const { createLogger, format, transports } = require("winston");
const fs = require("fs");
const path = require("path");

// ✅ Ensure logs folder exists
const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",

  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }), // ✅ capture stack
    format.printf((info) => {
      return `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message} ${
        info.stack || ""
      }`;
    })
  ),

  transports: [
    new transports.Console(),

    new transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error"
    }),

    new transports.File({
      filename: path.join(logDir, "combined.log"),
      format: format.json() // ✅ structured logs
    })
  ]
});

module.exports = logger;
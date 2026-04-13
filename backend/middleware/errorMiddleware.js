const errorMiddleware = (err, req, res, next) => {
  console.error("ERROR:", err);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Server Error";

  // MongoDB invalid ID
  if (err.name === "CastError") {
    message = "Resource not found";
    statusCode = 404;
  }

  // Duplicate key
  if (err.code === 11000) {
    message = "Duplicate field value entered";
    statusCode = 400;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    message = "Invalid token";
    statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    message = "Token expired";
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
};

module.exports = errorMiddleware;
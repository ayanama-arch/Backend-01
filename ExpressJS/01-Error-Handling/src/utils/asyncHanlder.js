const errorHanlderMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Send response with appropriate format
  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error",
  });
};

const TryCatch = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { TryCatch, errorHanlderMiddleware };

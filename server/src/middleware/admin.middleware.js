const AppError = require("../utils/AppError");

const adminOnly = (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Authentication required", 401));
  }

  if (req.user.role !== "admin") {
    return next(new AppError("Admin access required", 403));
  }

  next();
};

module.exports = adminOnly;

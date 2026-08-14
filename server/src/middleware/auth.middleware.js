const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const AppError = require("../utils/AppError");

const protect = async (req, res, next) => {
  try {
    // =========================
    // 1. GET TOKEN FROM COOKIE
    // =========================

    const token = req.cookies.token;

    if (!token) {
      return next(new AppError("Not authenticated. Please login.", 401));
    }

    // =========================
    // 2. VERIFY JWT
    // =========================

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // =========================
    // 3. FIND USER
    // =========================

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError("User no longer exists.", 401));
    }

    // =========================
    // 4. CHECK ACCOUNT STATUS
    // =========================

    if (!user.isActive) {
      return next(new AppError("Your account has been deactivated.", 403));
    }

    // =========================
    // 5. ATTACH USER
    // =========================

    req.user = user;

    // =========================
    // 6. CONTINUE
    // =========================

    next();
  } catch (error) {
    // Invalid token
    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Invalid authentication token.", 401));
    }

    // Expired token
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Authentication token expired.", 401));
    }

    next(error);
  }
};

module.exports = protect;

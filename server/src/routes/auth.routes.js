const express = require("express");

const router = express.Router();

const validate = require("../middleware/validate.middleware");
const protect = require("../middleware/auth.middleware");

const { registerSchema, loginSchema } = require("../validators/auth.validator");

const {
  register,
  login,
  getCurrentUser,
  logout
} = require("../controllers/auth.controller");

// =========================
// REGISTER
// =========================
router.post("/register", validate(registerSchema), register);

// =========================
// LOGIN
// =========================

router.post("/login", validate(loginSchema), login);

// =========================
// CURRENT USER
// =========================
router.get("/me", protect, getCurrentUser);

router.post("/logout", logout);

module.exports = router;

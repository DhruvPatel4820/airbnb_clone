const catchAsync = require("../utils/catchAsync");
const { registerUser, loginUser } = require("../services/auth.service");

const sendTokenResponse = require("../utils/sendTokenResponse");
const cookieOptions = require("../config/cookie");

// =========================
// REGISTER
// =========================

exports.register = catchAsync(async (req, res) => {
  const user = await registerUser(req.body);

  sendTokenResponse(user, 201, res, "User registered successfully");
});

// =========================
// LOGIN
// =========================

exports.login = catchAsync(async (req, res) => {
  const user = await loginUser(req.body);

  sendTokenResponse(user, 200, res, "Login successful");
});

// =========================
// GET CURRENT USER
// =========================

exports.getCurrentUser = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Current user fetched successfully",
    data: req.user,
  });
});

// =========================
// LOGOUT
// =========================

exports.logout = catchAsync(async (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: cookieOptions.httpOnly,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
    })
    .status(200)
    .json({
      success: true,
      message: "Logout successful",
    });
});

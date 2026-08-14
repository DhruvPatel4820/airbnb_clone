const generateToken = require("./generateToken");
const cookieOptions = require("../config/cookie");

const sendTokenResponse = (user, statusCode, res, message) => {
  const token = generateToken(user._id);

  res.status(statusCode).cookie("token", token, cookieOptions).json({
    success: true,
    message,
    data: user,
  });
};

module.exports = sendTokenResponse;

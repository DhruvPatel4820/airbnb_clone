const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = err.statusCode || 500;

  let message = err.message || "Internal Server Error";

  // =========================
  // MULTER ERRORS
  // =========================

  if (err instanceof multer.MulterError) {
    statusCode = 400;

    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        message = "Each image must be smaller than 5MB.";
        break;

      case "LIMIT_FILE_COUNT":
        message = "You can upload maximum 5 images.";
        break;

      case "LIMIT_UNEXPECTED_FILE":
        message = "Only image files are allowed.";
        break;

      case "LIMIT_FIELD_COUNT":
        message = "Too many form fields.";
        break;

      case "LIMIT_FIELD_SIZE":
        message = "Form field is too large.";
        break;

      case "LIMIT_PART_COUNT":
        message = "Too many multipart form parts.";
        break;

      default:
        message = "Invalid file upload.";
    }
  }

  // =========================
  // MONGOOSE CAST ERROR
  // =========================

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // =========================
  // MONGOOSE VALIDATION ERROR
  // =========================

  if (err.name === "ValidationError") {
    statusCode = 400;

    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
  }

  // =========================
  // MONGOOSE DUPLICATE KEY
  // =========================

  if (err.code === 11000) {
    statusCode = 409;

    const field = Object.keys(err.keyPattern || {})[0] || "field";

    message = `${field} already exists`;
  }

  // =========================
  // RESPONSE
  // =========================

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;

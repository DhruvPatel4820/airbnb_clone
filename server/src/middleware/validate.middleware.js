const AppError = require("../utils/AppError");

const validate = (schema) => {
  return (req, res, next) => {
    // =========================
    // PARSE LOCATION
    // =========================

    if (typeof req.body.location === "string") {
      try {
        req.body.location = JSON.parse(req.body.location);
      } catch (error) {
        return next(new AppError("Invalid location data", 400));
      }
    }

    // =========================
    // PARSE AMENITIES
    // =========================

    if (typeof req.body.amenities === "string") {
      try {
        req.body.amenities = JSON.parse(req.body.amenities);
      } catch (error) {
        return next(new AppError("Invalid amenities data", 400));
      }
    }

    // =========================
    // VALIDATE
    // =========================

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const message = error.details.map((detail) => detail.message).join(", ");

      return next(new AppError(message, 400));
    }

    req.body = value;

    next();
  };
};

module.exports = validate;

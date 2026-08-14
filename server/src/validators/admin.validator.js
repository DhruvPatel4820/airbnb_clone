const Joi = require("joi");

// =========================
// UPDATE USER STATUS
// =========================

const updateUserStatusSchema = Joi.object({
  isActive: Joi.boolean().required(),
});

// =========================
// UPDATE LISTING STATUS
// =========================

const updateListingStatusSchema = Joi.object({
  isActive: Joi.boolean().required(),
});

module.exports = {
  updateUserStatusSchema,
  updateListingStatusSchema,
};

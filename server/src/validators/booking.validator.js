const Joi = require("joi");

const createBookingSchema = Joi.object({
  listingId: Joi.string().hex().length(24).required(),

  checkIn: Joi.date().iso().required(),

  checkOut: Joi.date().iso().required(),

  guests: Joi.number().integer().min(1).required(),
})
  .custom((value, helpers) => {
    const checkIn = new Date(value.checkIn);
    const checkOut = new Date(value.checkOut);

    if (checkOut <= checkIn) {
      return helpers.error("any.invalid");
    }

    return value;
  })
  .messages({
    "any.invalid": "Check-out date must be after check-in date",
  });

const updateBookingStatusSchema = Joi.object({
  status: Joi.string().valid("confirmed", "cancelled", "completed").required(),
});
module.exports = {
  createBookingSchema,
  updateBookingStatusSchema,
};

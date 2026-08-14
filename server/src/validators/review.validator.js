const Joi = require("joi");

const createReviewSchema = Joi.object({
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required(),

  comment: Joi.string()
    .min(5)
    .max(1000)
    .required(),
});


const updateReviewSchema = Joi.object({
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5),

  comment: Joi.string()
    .min(5)
    .max(1000),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required",
  });


module.exports = {
  createReviewSchema,
  updateReviewSchema,
};
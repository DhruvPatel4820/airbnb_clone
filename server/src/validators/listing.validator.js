const Joi = require("joi");

// =========================
// COMMON
// =========================

const locationSchema = Joi.object({
  city: Joi.string().min(2).max(50).required(),

  state: Joi.string().min(2).max(50).required(),

  country: Joi.string().min(2).max(50).required(),
});

// =========================
// CREATE LISTING
// =========================

const createListingSchema = Joi.object({
  title: Joi.string().min(5).max(100).required(),

  description: Joi.string().min(20).max(2000).required(),

  price: Joi.number().positive().required(),

  location: locationSchema.required(),

  propertyType: Joi.string()
    .valid("house", "apartment", "villa", "hotel", "guesthouse", "other")
    .required(),

  guests: Joi.number().integer().min(1).required(),

  bedrooms: Joi.number().integer().min(0).required(),

  bathrooms: Joi.number().integer().min(0).required(),

  amenities: Joi.alternatives()
    .try(Joi.array().items(Joi.string().trim()), Joi.string())
    .default([]),
});

// =========================
// UPDATE LISTING
// =========================

const updateListingSchema = Joi.object({
  title: Joi.string().min(5).max(100),

  description: Joi.string().min(20).max(2000),

  price: Joi.number().positive(),

  location: locationSchema,

  propertyType: Joi.string().valid(
    "house",
    "apartment",
    "villa",
    "hotel",
    "guesthouse",
    "other",
  ),

  guests: Joi.number().integer().min(1),

  bedrooms: Joi.number().integer().min(0),

  bathrooms: Joi.number().integer().min(0),

  amenities: Joi.alternatives().try(
    Joi.array().items(Joi.string().trim()),
    Joi.string(),
  ),

  existingImages: Joi.alternatives().try(
    Joi.array().items(Joi.string().uri()),
    Joi.string().uri(),
  ),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required for update",
  });

module.exports = {
  createListingSchema,
  updateListingSchema,
};

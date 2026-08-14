const Joi = require("joi");

const registerSchema = Joi.object({

    fullName: Joi.string()
        .min(3)
        .max(50)
        .required(),

    username: Joi.string()
        .min(3)
        .max(20)
        .required(),

    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .min(8)
        .required()

});
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .required(),
});
module.exports = {
    registerSchema,
    loginSchema
};
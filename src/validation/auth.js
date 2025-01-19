import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  city: Joi.string(),
  exp: Joi.number(),
  stream: Joi.string(),
  tel: Joi.string(),
  type: Joi.string().valid('client', 'lawyer'),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  announcements: Joi.array().items(Joi.object()),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const sendResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});

import Joi from 'joi';

export const createAnnouncementSchema = Joi.object({
  author: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
    'any.required': 'Username is required',
  }),
  price: Joi.number().integer().required(),
  type: Joi.string().valid('client', 'lawyer').required(),
  title: Joi.string().required(),
  comment: Joi.string().required(),
  tel: Joi.string().required(),
});

export const updateAnnouncementSchema = Joi.object({
  author: Joi.string().min(3).max(30).messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
    'any.required': 'Username is required',
  }),
  price: Joi.number().integer().min(6).max(16),
  type: Joi.string().valid('client', 'lawyer'),
  title: Joi.string(),
  comment: Joi.string(),
  tel: Joi.string(),
});

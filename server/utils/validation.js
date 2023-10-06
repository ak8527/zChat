import Joi from 'joi';

export const loginSchema = Joi.object().keys({
  email: Joi.string().trim().lowercase().email().normalize().required(),
  password: Joi.string().min(6).alphanum().required(),
  remember: Joi.boolean().required(),
});

export const signupSchema = Joi.object().keys({
  username: Joi.string().trim().min(4).max(20).required(),
  email: Joi.string().trim().lowercase().email().normalize().required(),
  password: Joi.string().min(6).alphanum().required(),
});

export const emailSchema = Joi.object().keys({
  email: Joi.string().trim().lowercase().normalize().email().required(),
});

export const passwordSchema = Joi.object().keys({
  password: Joi.string().min(6).alphanum().required(),
});

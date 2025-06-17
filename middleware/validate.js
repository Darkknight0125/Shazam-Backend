import Joi from 'joi';

export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

export const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const threadSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  contentType: Joi.string().valid('movie', 'series', 'anime').required(),
});

export const postSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required(),
});

export const playlistSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500),
  content: Joi.array().items(
    Joi.object({
      contentId: Joi.string().required(),
      type: Joi.string().valid('movie', 'series', 'anime').required(),
    })
  ),
  isPublic: Joi.boolean(),
});
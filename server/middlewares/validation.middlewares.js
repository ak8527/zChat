const validate = (schema) => (req, res, next) => {
  const { value, error } = schema.validate(req.body);
  if (error)
    return res
      .status(422)
      .json({ error: true, data: { message: error?.details[0]?.message } });

  req.body = value;
  next();
};

export default validate;

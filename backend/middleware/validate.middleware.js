module.exports = (schema) => (req, res, next) => {
  const { value, error } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    return res.status(400).json({
      errors: error.details.map(e => e.message)
    });
  }

  req.body = value;
  next();
};
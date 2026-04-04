const { body, validationResult } = require('express-validator');
const validate = {};

// Movie Validation Rules
validate.movieRules = [
  body('title').notEmpty().withMessage('Movie Title required.'),
  body('releaseYear').notEmpty().withMessage('Movie releaseYear required.'),
  body('genre').isArray({ min: 1 }).withMessage('Movie genre must be a non-empty array.'),
  body('genre.*').isString().notEmpty().withMessage('Each movie genre must be a non-empty string.'),
  body('rating').notEmpty().withMessage('Movie rating required.'),
];

// A middleware to handle the validation result
validate.handleValidationErrors = (req, res, next) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If there are errors, return a 400 status with the error details
    return res.status(400).json({
      code: 'VALIDATION_ERROR',
      message: 'Validation failed.',
      details: errors.array(),
    });
  }
  next(); // Pass control to the next handler (controller)
};

module.exports = validate;

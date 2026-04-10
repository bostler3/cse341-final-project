const { body, validationResult } = require('express-validator');
const validate = {};

// User Validation Rules
validate.userRules = [
  body('displayName').notEmpty().withMessage('Display name required.'),
  body('email')
    .notEmpty()
    .withMessage('Email required.')
    .bail()
    .isEmail()
    .withMessage('Email must be a valid email address.'),
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

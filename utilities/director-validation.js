const { body, validationResult } = require('express-validator');
const validate = {};

// Director Validation Rules
validate.directorRules = [
  body('firstName').notEmpty().withMessage('First name required.'),
  body('lastName').notEmpty().withMessage('Last name required.'),
  body('birthDate')
    .notEmpty()
    .withMessage('BirthDate required.')
    .bail()
    .isISO8601()
    .withMessage('BirthDate must be a valid date (YYYY-MM-DD).'),
  body('nationality').notEmpty().withMessage('Nationality required.'),
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

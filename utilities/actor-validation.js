const { body, validationResult } = require("express-validator");
const validate = {}

// Actor Validation Rules
validate.actorRules = [
    body("firstName").notEmpty().withMessage("First name required."),
    body("lastName").notEmpty().withMessage("Last name required."), 
    body("birthdate").notEmpty().withMessage("Birthdate required."), 
    body("nationality").notEmpty().withMessage("Nationality required.") 
];

// A middleware to handle the validation result
validate.handleValidationErrors = (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // If there are errors, return a 400 status with the error details
        return res.status(400).json({ errors: errors.array() });
    }
    next(); // Pass control to the next handler (controller)
};

module.exports = validate

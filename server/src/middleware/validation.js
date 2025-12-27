const { body, validationResult } = require('express-validator');

// Validation rules for contact form
const contactValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .escape(),

  body('mobileNumber')
    .trim()
    .notEmpty().withMessage('Mobile number is required')
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/).withMessage('Invalid mobile number format'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters')
    .escape()
];

// Validation rules for admin login
const loginValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 50 }).withMessage('Invalid username'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Invalid password')
];

// Validation rules for updating contact status
const updateContactValidation = [
  body('status')
    .optional()
    .isIn(['new', 'read', 'replied', 'archived']).withMessage('Invalid status value'),

  body('message')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters')
    .escape()
];

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors.array().map(err => err.msg)
    });
  }
  next();
};

module.exports = {
  contactValidation,
  loginValidation,
  updateContactValidation,
  validate
};

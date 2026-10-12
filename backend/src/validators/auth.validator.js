'use strict'

const { body, validationResult } = require('express-validator')

// ── Reusable field rules ─────────────────────────────────────

const emailRule = body('email')
  .trim()
  .notEmpty().withMessage('Email is required.')
  .isEmail().withMessage('Enter a valid email address.')
  .normalizeEmail()

const passwordRule = (min = 8) =>
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min }).withMessage(`Password must be at least ${min} characters.`)

const nameRule = (field, label) =>
  body(field)
    .trim()
    .notEmpty().withMessage(`${label} is required.`)
    .isLength({ min: 2 }).withMessage(`${label} must be at least 2 characters.`)
    .isLength({ max: 50 }).withMessage(`${label} cannot exceed 50 characters.`)
    .matches(/^[a-zA-Z\s'-]+$/).withMessage(`${label} contains invalid characters.`)

// ── Validator sets ───────────────────────────────────────────

const signupValidator = [
  nameRule('firstName', 'First name'),
  nameRule('lastName', 'Last name'),
  emailRule,
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required.')
    .matches(/^\+?[\d\s\-().]{7,15}$/).withMessage('Enter a valid phone number.'),
  passwordRule(8),
  body('confirmPassword')
    .notEmpty().withMessage('Please confirm your password.')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match.')
      }
      return true
    }),
]

const loginValidator = [
  emailRule,
  body('password').notEmpty().withMessage('Password is required.'),
]

const refreshValidator = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required.'),
]

// ── Middleware: run validationResult and return 422 on failure ─

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: 'fail',
      message: 'Validation failed.',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    })
  }
  next()
}

module.exports = {
  signupValidator,
  loginValidator,
  refreshValidator,
  validate,
}

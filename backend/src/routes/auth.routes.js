'use strict'

const { Router } = require('express')
const authController = require('../controllers/auth.controller')
const { authenticate } = require('../middlewares/authenticate')
const { authLimiter } = require('../middlewares/rateLimiter')
const {
  signupValidator,
  loginValidator,
  refreshValidator,
  validate,
} = require('../validators/auth.validator')

const router = Router()

/**
 * @route   POST /api/v1/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/signup',
  authLimiter,
  signupValidator,
  validate,
  authController.signup
)

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user and return tokens
 * @access  Public
 */
router.post(
  '/login',
  authLimiter,
  loginValidator,
  validate,
  authController.login
)

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Rotate access + refresh tokens
 * @access  Public (uses httpOnly cookie or body)
 */
router.post(
  '/refresh-token',
  refreshValidator,
  validate,
  authController.refreshToken
)

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Revoke refresh token and clear cookie
 * @access  Private
 */
router.post('/logout', authenticate, authController.logout)

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, authController.getMe)

module.exports = router

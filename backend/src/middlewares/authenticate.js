'use strict'

const AppError = require('../utils/AppError')
const { verifyAccessToken } = require('../utils/jwt')
const User = require('../models/User.model')
const catchAsync = require('../utils/catchAsync')

/**
 * Protect private routes.
 * Expects: Authorization: Bearer <accessToken>
 */
const authenticate = catchAsync(async (req, _res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication required. Please log in.', 401))
  }

  const token = authHeader.split(' ')[1]

  let payload
  try {
    payload = verifyAccessToken(token)
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError'
        ? 'Your session has expired. Please log in again.'
        : 'Invalid token. Please log in again.'
    return next(new AppError(message, 401))
  }

  const user = await User.findById(payload.sub)
  if (!user) {
    return next(new AppError('The account belonging to this token no longer exists.', 401))
  }

  if (!user.isActive) {
    return next(new AppError('Your account has been deactivated.', 403))
  }

  req.user = { id: user._id.toString(), role: user.role }
  next()
})

/**
 * Restrict route access to certain roles.
 * Must be used after `authenticate`.
 *
 * @param  {...string} roles  e.g. 'admin'
 */
const authorize = (...roles) =>
  (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403))
    }
    next()
  }

module.exports = { authenticate, authorize }

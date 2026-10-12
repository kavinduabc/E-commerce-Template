'use strict'

const User = require('../models/User.model')
const AppError = require('../utils/AppError')
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt')

/**
 * Register a new user.
 * Throws AppError 409 if the email is already taken.
 *
 * @param {{ firstName, lastName, email, phone, password }} data
 * @returns {{ user, accessToken, refreshToken }}
 */
const register = async ({ firstName, lastName, email, phone, password }) => {
  const existing = await User.findOne({ email })
  if (existing) {
    throw new AppError('An account with this email already exists.', 409)
  }

  const user = await User.create({ firstName, lastName, email, phone, password })

  const accessToken = signAccessToken(user._id.toString())
  const refreshToken = signRefreshToken(user._id.toString())

  // Persist hashed refresh token (raw token is returned to client)
  user.refreshToken = refreshToken
  await user.save({ validateBeforeSave: false })

  return { user, accessToken, refreshToken }
}

/**
 * Authenticate an existing user.
 * Throws AppError 401 on bad credentials or inactive account.
 *
 * @param {{ email, password }} data
 * @returns {{ user, accessToken, refreshToken }}
 */
const login = async ({ email, password }) => {
  // Explicitly select password (it is excluded by default)
  const user = await User.findOne({ email }).select('+password +refreshToken')

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password.', 401)
  }

  if (!user.isActive) {
    throw new AppError('Your account has been deactivated. Contact support.', 403)
  }

  const accessToken = signAccessToken(user._id.toString())
  const refreshToken = signRefreshToken(user._id.toString())

  user.refreshToken = refreshToken
  await user.save({ validateBeforeSave: false })

  return { user, accessToken, refreshToken }
}

/**
 * Issue a new access token using a valid refresh token.
 * Throws AppError 401 if the token is missing, invalid, or rotated.
 *
 * @param {string} token  The refresh token sent by the client
 * @returns {{ accessToken, refreshToken }}
 */
const refreshTokens = async (token) => {
  let payload
  try {
    payload = verifyRefreshToken(token)
  } catch {
    throw new AppError('Invalid or expired refresh token.', 401)
  }

  const user = await User.findById(payload.sub).select('+refreshToken')
  if (!user || user.refreshToken !== token) {
    // Possible token reuse — invalidate stored token
    if (user) {
      user.refreshToken = undefined
      await user.save({ validateBeforeSave: false })
    }
    throw new AppError('Refresh token has been revoked. Please log in again.', 401)
  }

  // Rotate tokens
  const newAccessToken = signAccessToken(user._id.toString())
  const newRefreshToken = signRefreshToken(user._id.toString())

  user.refreshToken = newRefreshToken
  await user.save({ validateBeforeSave: false })

  return { accessToken: newAccessToken, refreshToken: newRefreshToken }
}

/**
 * Revoke the stored refresh token, effectively logging the user out.
 *
 * @param {string} userId
 */
const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } })
}

/**
 * Return a user's public profile by ID.
 * Throws AppError 404 if not found.
 *
 * @param {string} userId
 * @returns {User}
 */
const getMe = async (userId) => {
  const user = await User.findById(userId)
  if (!user) throw new AppError('User not found.', 404)
  return user
}

module.exports = { register, login, refreshTokens, logout, getMe }

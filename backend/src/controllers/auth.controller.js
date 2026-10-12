'use strict'

const authService = require('../services/auth.service')
const catchAsync = require('../utils/catchAsync')

// ── Helpers ──────────────────────────────────────────────────

/**
 * Send token response: access token in JSON body,
 * refresh token in an httpOnly secure cookie.
 */
const sendTokenResponse = (res, statusCode, user, accessToken, refreshToken) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
  }

  res.cookie('refreshToken', refreshToken, cookieOptions)

  res.status(statusCode).json({
    status: 'success',
    data: {
      user: user.toPublicJSON(),
      accessToken,
    },
  })
}

// ── POST /api/v1/auth/signup ─────────────────────────────────

const signup = catchAsync(async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body
  const { user, accessToken, refreshToken } = await authService.register({
    firstName,
    lastName,
    email,
    phone,
    password,
  })
  sendTokenResponse(res, 201, user, accessToken, refreshToken)
})

// ── POST /api/v1/auth/login ──────────────────────────────────

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body
  const { user, accessToken, refreshToken } = await authService.login({
    email,
    password,
  })
  sendTokenResponse(res, 200, user, accessToken, refreshToken)
})

// ── POST /api/v1/auth/refresh-token ─────────────────────────

const refreshToken = catchAsync(async (req, res) => {
  // Prefer cookie, fall back to body (for non-browser clients)
  const token = req.cookies?.refreshToken || req.body?.refreshToken
  const { accessToken, refreshToken: newRefreshToken } =
    await authService.refreshTokens(token)

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  }
  res.cookie('refreshToken', newRefreshToken, cookieOptions)

  res.status(200).json({
    status: 'success',
    data: { accessToken },
  })
})

// ── POST /api/v1/auth/logout ─────────────────────────────────

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.user.id)
  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict' })
  res.status(200).json({ status: 'success', message: 'Logged out successfully.' })
})

// ── GET /api/v1/auth/me ──────────────────────────────────────

const getMe = catchAsync(async (req, res) => {
  const user = await authService.getMe(req.user.id)
  res.status(200).json({
    status: 'success',
    data: { user: user.toPublicJSON() },
  })
})

module.exports = { signup, login, refreshToken, logout, getMe }

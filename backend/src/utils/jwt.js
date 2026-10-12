'use strict'

const jwt = require('jsonwebtoken')
const {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN,
} = require('../config/env')

/**
 * Sign a short-lived access token.
 * @param {string} userId
 * @returns {string}
 */
const signAccessToken = (userId) =>
  jwt.sign({ sub: userId, type: 'access' }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })

/**
 * Sign a long-lived refresh token.
 * @param {string} userId
 * @returns {string}
 */
const signRefreshToken = (userId) =>
  jwt.sign({ sub: userId, type: 'refresh' }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  })

/**
 * Verify and decode an access token.
 * Throws JsonWebTokenError / TokenExpiredError on failure.
 * @param {string} token
 * @returns {{ sub: string }}
 */
const verifyAccessToken = (token) => jwt.verify(token, JWT_SECRET)

/**
 * Verify and decode a refresh token.
 * @param {string} token
 * @returns {{ sub: string }}
 */
const verifyRefreshToken = (token) => jwt.verify(token, JWT_REFRESH_SECRET)

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
}

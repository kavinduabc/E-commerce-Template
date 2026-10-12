'use strict'

const rateLimit = require('express-rate-limit')

/**
 * Strict limiter for auth endpoints — prevents brute-force attacks.
 * 10 requests per 15 minutes per IP.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
  skip: () => process.env.NODE_ENV === 'test',
})

/**
 * General API limiter — 100 requests per 15 minutes.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many requests. Please slow down.',
  },
  skip: () => process.env.NODE_ENV === 'test',
})

module.exports = { authLimiter, apiLimiter }

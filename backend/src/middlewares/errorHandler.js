'use strict'

const { NODE_ENV } = require('../config/env')

/**
 * Map specific Mongoose / JWT error types to friendly AppErrors.
 */
const normalizeError = (err) => {
  // Mongoose duplicate key (e.g. unique email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return { statusCode: 409, message: `This ${field} is already registered.` }
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message)
    return { statusCode: 422, message: messages.join(' ') }
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return { statusCode: 400, message: `Invalid ${err.path}: ${err.value}` }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return { statusCode: 401, message: 'Invalid token. Please log in again.' }
  }
  if (err.name === 'TokenExpiredError') {
    return { statusCode: 401, message: 'Your session has expired. Please log in again.' }
  }

  return null
}

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Something went wrong. Please try again later.'

  const normalized = normalizeError(err)
  if (normalized) {
    statusCode = normalized.statusCode
    message = normalized.message
  }

  // Log stack trace in development only
  if (NODE_ENV === 'development') {
    console.error(`[ERROR] ${statusCode} – ${message}`)
    console.error(err.stack)
  }

  res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'fail',
    message,
    // Expose stack only in dev
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  })
}

module.exports = errorHandler

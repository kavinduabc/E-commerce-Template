'use strict'

/**
 * Operational error with an HTTP status code.
 * All intentional API errors should use this class so
 * the global error handler can distinguish them from
 * unexpected programming errors.
 */
class AppError extends Error {
  /**
   * @param {string} message  Human-readable message sent to the client
   * @param {number} statusCode  HTTP status code (e.g. 400, 401, 404)
   */
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error'
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = AppError

'use strict'

const AppError = require('../utils/AppError')

/**
 * Catch-all for undefined routes.
 */
const notFound = (req, _res, next) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found.`, 404))
}

module.exports = notFound

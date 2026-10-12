'use strict'

/**
 * Wraps an async route handler and forwards any rejected promise
 * to Express's next(err) — eliminates try/catch boilerplate.
 *
 * @param {Function} fn  Async (req, res, next) handler
 * @returns {Function}
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

module.exports = catchAsync

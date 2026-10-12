/**
 * Auth API service — all calls to the backend auth endpoints.
 * Base URL is read from the Vite env variable VITE_API_URL.
 */

const BASE = import.meta.env.VITE_API_URL

/**
 * Generic fetch wrapper.
 * Throws a plain Error with `error.message` set to the server's message.
 */
async function request(endpoint, options = {}) {
  const res = await fetch(`${BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // send/receive httpOnly cookies
    ...options,
  })

  const data = await res.json()

  if (!res.ok) {
    const err = new Error(data.message || 'Something went wrong.')
    err.errors = data.errors || [] // validation field errors
    err.status = res.status
    throw err
  }

  return data
}

/**
 * POST /auth/signup
 * @param {{ firstName, lastName, email, phone, password, confirmPassword }} body
 * @returns {{ data: { user, accessToken } }}
 */
export const signupAPI = (body) =>
  request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(body),
  })

/**
 * POST /auth/login
 * @param {{ email, password }} body
 * @returns {{ data: { user, accessToken } }}
 */
export const loginAPI = (body) =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  })

/**
 * POST /auth/logout  (requires Bearer token in header)
 * @param {string} accessToken
 */
export const logoutAPI = (accessToken) =>
  request('/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

/**
 * GET /auth/me  (requires Bearer token)
 * @param {string} accessToken
 * @returns {{ data: { user } }}
 */
export const getMeAPI = (accessToken) =>
  request('/auth/me', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

/**
 * POST /auth/refresh-token  (uses httpOnly cookie automatically)
 * @returns {{ data: { accessToken } }}
 */
export const refreshTokenAPI = () =>
  request('/auth/refresh-token', { method: 'POST' })

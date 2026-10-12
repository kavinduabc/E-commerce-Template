'use strict'

const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')

const { CLIENT_URL, NODE_ENV } = require('./config/env')
const authRoutes = require('./routes/auth.routes')
const errorHandler = require('./middlewares/errorHandler')
const notFound = require('./middlewares/notFound')

const app = express()

// ── Security headers ────────────────────────────────────────
app.use(helmet())

// ── CORS ────────────────────────────────────────────────────
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// ── Body parsers ────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// ── HTTP logging (dev only) ─────────────────────────────────
if (NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// ── Health check ────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── API routes ──────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes)

// ── 404 & global error handler ──────────────────────────────
app.use(notFound)
app.use(errorHandler)

module.exports = app

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const authRoutes  = require('./routes/authRoutes')
const queryRoutes = require('./routes/queryRoutes')
const quizRoutes  = require('./routes/quizRoutes')

const app = express()

// ── Rate limiting ────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later.' }
})

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { message: 'Too many AI requests, please wait a moment.' }
})

app.use('/api/', limiter)
app.use('/api/query/ask', aiLimiter)

// ── Request logging ──────────────────────────────────────────────
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`)
  })
  next()
})

app.use(express.json())
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}))

app.use('/api/auth',  authRoutes)
app.use('/api/query', queryRoutes)
app.use('/api/quiz',  quizRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'StudyGenie API is running' })
})

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas')
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  })

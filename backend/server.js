const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const authRoutes  = require('./routes/authRoutes')
const queryRoutes = require('./routes/queryRoutes')
const quizRoutes  = require('./routes/quizRoutes')

const app = express()

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

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes  = require('./routes/authRoutes');
const queryRoutes = require('./routes/queryRoutes');
const quizRoutes  = require('./routes/quizRoutes');

const app = express();

// Handle OPTIONS preflight before anything else
app.options('*', cors());

app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      'http://localhost:5173',
      'https://studygenie-sable.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean)
    if (!origin || allowed.includes(origin) ||
        (origin && origin.endsWith('.vercel.app'))) {
      callback(null, true)
    } else {
      callback(new Error('CORS blocked: ' + origin))
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}))

app.use(express.json());

// Routes
app.use('/api/auth',  authRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/quiz',  quizRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'StudyGenie API is running' });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

startServer();

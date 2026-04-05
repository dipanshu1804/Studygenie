const OpenAI = require('openai');
const Query = require('../models/Query');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are StudyGenie, an expert academic tutor. When a student asks a question:
1. Provide a clear, structured explanation
2. Break down complex concepts into simple steps
3. Use examples where helpful
4. Format your response using markdown (headings, bullet points, code blocks for programming topics)
5. Keep explanations thorough but concise
6. End with a brief summary or key takeaway`;

// POST /api/query/ask
const askQuestion = async (req, res) => {
  const { question, subject, context } = req.body;

  if (!question || !question.trim()) {
    return res.status(400).json({ message: 'Question cannot be empty' });
  }
  if (!subject) {
    return res.status(400).json({ message: 'Subject is required' });
  }

  // Build system prompt — prepend conversation context for follow-up questions
  const systemPrompt = context
    ? `${SYSTEM_PROMPT}\n\n--- Conversation so far ---\n${context.trim()}\n--- End of context ---\nNow answer the following follow-up question in relation to the above context:`
    : SYSTEM_PROMPT;

  let aiResponse;
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Subject: ${subject}\n\nQuestion: ${question.trim()}` },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });
    aiResponse = completion.choices[0].message.content;
  } catch (err) {
    if (err.status === 401) {
      return res.status(500).json({ message: 'Invalid AI configuration' });
    }
    if (err.status === 429) {
      return res.status(429).json({ message: 'AI service busy, try again' });
    }
    return res.status(500).json({ message: 'Failed to get AI response' });
  }

  let savedQuery = null;
  let newStreak = null;

  if (req.user) {
    try {
      savedQuery = await Query.create({
        userId: req.user._id,
        question: question.trim(),
        subject,
        response: aiResponse,
      });
    } catch {
      return res.status(500).json({ message: 'Failed to save response' });
    }

    // Streak calculation (only for original questions, not follow-ups)
    if (!context) {
      try {
        const User = require('../models/User');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastActive = req.user.lastActiveDate ? new Date(req.user.lastActiveDate) : null;
        if (lastActive) lastActive.setHours(0, 0, 0, 0);

        const diffDays = lastActive
          ? Math.round((today - lastActive) / (1000 * 60 * 60 * 24))
          : null;

        if (diffDays === null || diffDays > 1) {
          newStreak = 1;
        } else if (diffDays === 1) {
          newStreak = (req.user.streak || 0) + 1;
        } else {
          newStreak = req.user.streak || 1; // same day — keep
        }

        await User.findByIdAndUpdate(req.user._id, {
          streak: newStreak,
          lastActiveDate: today,
        });
      } catch {
        // Non-critical — don't fail the request over streak errors
      }
    }
  }

  res.json({
    response: aiResponse,
    queryId: savedQuery ? savedQuery._id : null,
    streak: newStreak,
  });
};

// GET /api/query/history
const getHistory = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const queries = await Query.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-__v');
    res.json({ queries });
  } catch {
    res.status(500).json({ message: 'Failed to load history' });
  }
};

// DELETE /api/query/:id
const deleteQuery = async (req, res) => {
  try {
    const query = await Query.findOne({ _id: req.params.id, userId: req.user._id });
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }
    await query.deleteOne();
    res.json({ message: 'Query deleted successfully' });
  } catch {
    res.status(500).json({ message: 'Failed to delete query' });
  }
};

// PATCH /api/query/:id/bookmark
const toggleBookmark = async (req, res) => {
  try {
    const query = await Query.findOne({ _id: req.params.id, userId: req.user._id });
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }
    query.isBookmarked = !query.isBookmarked;
    await query.save();
    res.json({ isBookmarked: query.isBookmarked });
  } catch {
    res.status(500).json({ message: 'Failed to update bookmark' });
  }
};

// PATCH /api/query/:id/rate
const rateQuery = async (req, res) => {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    const query = await Query.findOne({ _id: req.params.id, userId: req.user._id });
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }
    query.rating = rating;
    await query.save();
    res.json({ rating: query.rating });
  } catch {
    res.status(500).json({ message: 'Failed to save rating' });
  }
};

module.exports = { askQuestion, getHistory, deleteQuery, toggleBookmark, rateQuery };

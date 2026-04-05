const OpenAI = require('openai');
const Query = require('../models/Query');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const subjectPrompts = {
  Mathematics: 'You are an expert Mathematics tutor. Provide clear, step-by-step solutions with explanations for each step. Use numbered steps, show all working, and explain the reasoning behind each step. If relevant, mention the formula or theorem used.',
  Programming: 'You are an expert Programming tutor. Provide clear code explanations with well-commented code examples. Break down complex concepts step by step. Explain what each part of the code does and why. Include example output where relevant.',
  Science: 'You are an expert Science tutor. Explain scientific concepts clearly with real-world examples. Use step-by-step explanations and relate concepts to everyday phenomena where possible.',
  Physics: 'You are an expert Physics tutor. Explain physics concepts with clear derivations, formulas, and practical examples. Show step-by-step solutions for numerical problems.',
  Chemistry: 'You are an expert Chemistry tutor. Explain chemical concepts, reactions, and equations step by step. Include balanced equations and explain the underlying principles.',
  Biology: 'You are an expert Biology tutor. Explain biological concepts clearly with examples. Describe processes step by step and relate them to real biological systems.',
  History: 'You are an expert History tutor. Provide comprehensive, well-structured explanations of historical events, causes, and consequences. Present information chronologically and contextually.',
  English: 'You are an expert English Language and Literature tutor. Provide clear explanations of grammar rules, literary concepts, and writing techniques with examples.',
  General: 'You are a knowledgeable academic tutor. Provide clear, structured, and comprehensive explanations for student queries. Break down complex topics into understandable steps with relevant examples.'
};

// POST /api/query/ask
const askQuestion = async (req, res) => {
  try {
    const { question, subject } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ message: 'Question is required' });
    }
    if (!subject) {
      return res.status(400).json({ message: 'Subject is required' });
    }

    const systemPrompt = subjectPrompts[subject] || subjectPrompts['General'];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question.trim() }
      ],
      max_tokens: 1500,
      temperature: 0.7
    });

    const response = completion.choices[0].message.content;

    // Save to DB only if user is authenticated
    let savedQuery = null;
    if (req.userId) {
      savedQuery = await Query.create({
        userId: req.userId,
        question: question.trim(),
        subject,
        response
      });
    }

    res.json({
      id: savedQuery?._id || null,
      question: question.trim(),
      subject,
      response,
      createdAt: savedQuery?.createdAt || new Date()
    });
  } catch (err) {
    console.error('Ask question error:', err);
    if (err.status === 401) {
      return res.status(500).json({ message: 'Invalid OpenAI API key. Please check your configuration.' });
    }
    if (err.status === 429) {
      return res.status(429).json({ message: 'AI service is busy. Please try again in a moment.' });
    }
    res.status(500).json({ message: 'Failed to generate response. Please try again.' });
  }
};

// GET /api/query/history
const getHistory = async (req, res) => {
  try {
    const queries = await Query.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ queries });
  } catch (err) {
    console.error('Get history error:', err);
    res.status(500).json({ message: 'Failed to fetch history' });
  }
};

// DELETE /api/query/:id
const deleteQuery = async (req, res) => {
  try {
    const query = await Query.findOne({ _id: req.params.id, userId: req.userId });
    if (!query) {
      return res.status(404).json({ message: 'Query not found' });
    }
    await Query.findByIdAndDelete(req.params.id);
    res.json({ message: 'Query deleted successfully' });
  } catch (err) {
    console.error('Delete query error:', err);
    res.status(500).json({ message: 'Failed to delete query' });
  }
};

// PATCH /api/query/:id/bookmark
const toggleBookmark = async (req, res) => {
  try {
    const query = await Query.findOne({ _id: req.params.id, userId: req.userId });
    if (!query) return res.status(404).json({ message: 'Query not found' });
    query.isBookmarked = !query.isBookmarked;
    await query.save();
    res.json({ isBookmarked: query.isBookmarked });
  } catch (err) {
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
    const query = await Query.findOne({ _id: req.params.id, userId: req.userId });
    if (!query) return res.status(404).json({ message: 'Query not found' });
    query.rating = rating;
    await query.save();
    res.json({ rating: query.rating });
  } catch (err) {
    res.status(500).json({ message: 'Failed to rate query' });
  }
};

module.exports = { askQuestion, getHistory, deleteQuery, toggleBookmark, rateQuery };

const jwt    = require('jsonwebtoken');
const User   = require('../models/User');
const Query  = require('../models/Query');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userPayload = (user) => ({
  id:     user._id,
  name:   user.name,
  email:  user.email,
  streak: user.streak ?? 0,
});

// ── POST /api/auth/register ──────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });
    if (name.trim().length < 2)
      return res.status(400).json({ message: 'Name must be at least 2 characters' });
    if (!EMAIL_REGEX.test(email))
      return res.status(400).json({ message: 'Please enter a valid email address' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name: name.trim(), email, password });
    res.status(201).json({ token: generateToken(user._id), user: userPayload(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/auth/login ─────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });
    if (!EMAIL_REGEX.test(email))
      return res.status(400).json({ message: 'Please enter a valid email address' });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    res.json({ token: generateToken(user._id), user: userPayload(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/auth/me ─────────────────────────────────────────────
const getMe = async (req, res) => {
  res.json({ user: userPayload(req.user) });
};

// ── PATCH /api/auth/profile ──────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length < 2)
      return res.status(400).json({ message: 'Name must be at least 2 characters' });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: name.trim() },
      { new: true }
    );
    res.json({ user: userPayload(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── PATCH /api/auth/password ─────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: 'All fields are required' });
    if (newPassword.length < 6)
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    if (currentPassword === newPassword)
      return res.status(400).json({ message: 'New password must differ from current password' });

    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch)
      return res.status(401).json({ message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/auth/stats ──────────────────────────────────────────
const getUserStats = async (req, res) => {
  try {
    const userId  = req.user._id;
    const queries = await Query.find({ userId });

    const totalQuestions = queries.length;
    const bookmarked     = queries.filter((q) => q.isBookmarked).length;
    const ratedQueries   = queries.filter((q) => q.rating != null);
    const avgRating      = ratedQueries.length
      ? parseFloat(
          (ratedQueries.reduce((s, q) => s + q.rating, 0) / ratedQueries.length).toFixed(1)
        )
      : null;

    // Subject breakdown
    const subjectBreakdown = {};
    queries.forEach((q) => {
      subjectBreakdown[q.subject] = (subjectBreakdown[q.subject] || 0) + 1;
    });

    res.json({
      totalQuestions,
      bookmarked,
      rated:    ratedQueries.length,
      avgRating,
      streak:   req.user.streak ?? 0,
      joinedDate: req.user.createdAt,
      subjectBreakdown,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, getMe, updateProfile, changePassword, getUserStats };

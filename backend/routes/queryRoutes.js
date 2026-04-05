const express = require('express');
const router = express.Router();
const { askQuestion, getHistory, deleteQuery, toggleBookmark, rateQuery } = require('../controllers/queryController');
const { requireAuth, optionalAuth } = require('../middleware/authMiddleware');

router.post('/ask', optionalAuth, askQuestion);
router.get('/history', requireAuth, getHistory);
router.delete('/:id', requireAuth, deleteQuery);
router.patch('/:id/bookmark', requireAuth, toggleBookmark);
router.patch('/:id/rate', requireAuth, rateQuery);

module.exports = router;

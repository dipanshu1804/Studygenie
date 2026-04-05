const express = require('express');
const router  = express.Router();
const {
  askQuestion, getHistory,
  deleteQuery, deleteAllQueries,
  toggleBookmark, rateQuery,
} = require('../controllers/queryController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

router.post('/ask',          optionalAuth, askQuestion);
router.get('/history',       protect,      getHistory);
router.delete('/all',        protect,      deleteAllQueries);
router.delete('/:id',        protect,      deleteQuery);
router.patch('/:id/bookmark', protect,     toggleBookmark);
router.patch('/:id/rate',    protect,      rateQuery);

module.exports = router;

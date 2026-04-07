const mongoose = require('mongoose');

const querySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      enum: [
        'Mathematics',
        'Programming',
        'Science',
        'Physics',
        'Chemistry',
        'Biology',
        'History',
        'English',
        'General',
      ],
    },
    response: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    isBookmarked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

querySchema.index({ userId: 1, createdAt: -1 })
querySchema.index({ subject: 1 })

module.exports = mongoose.model('Query', querySchema);

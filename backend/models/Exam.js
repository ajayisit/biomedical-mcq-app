const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    selectedOption: Number,
    isCorrect: Boolean
  }],
  score: {
    type: Number,
    default: 0
  },
  totalQuestions: Number,
  timeStarted: Date,
  timeEnded: Date,
  timeSpent: Number, // in seconds
  passed: Boolean,
  status: {
    type: String,
    enum: ['in_progress', 'completed'],
    default: 'in_progress'
  }
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
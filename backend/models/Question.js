const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  explanation: String,
  topic: {
    type: String,
    enum: ['research_methodology', 'biostatistics', 'epidemiology', 'ethics', 'literature_review'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  source: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Question', questionSchema);
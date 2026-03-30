const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const Question = require('../models/Question');

// Start new exam
router.post('/start', async (req, res) => {
  try {
    const { topic, difficulty, numberOfQuestions = 10 } = req.body;
    
    // Build query
    let query = {};
    if (topic) query.topic = topic;
    if (difficulty) query.difficulty = difficulty;
    
    // Get random questions
    const questions = await Question.aggregate([
      { $match: query },
      { $sample: { size: numberOfQuestions } }
    ]);
    
    const exam = new Exam({
      questions: questions.map(q => q._id),
      totalQuestions: questions.length,
      timeStarted: new Date(),
      status: 'in_progress'
    });
    
    await exam.save();
    
    // Don't send correct answers to client
    const questionsForClient = questions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options.map(opt => ({ text: opt.text, _id: opt._id })),
      topic: q.topic,
      difficulty: q.difficulty
    }));
    
    res.json({
      examId: exam._id,
      questions: questionsForClient,
      totalQuestions: questions.length,
      timeStarted: exam.timeStarted
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit answer
router.post('/:examId/answer', async (req, res) => {
  try {
    const { examId } = req.params;
    const { questionId, selectedOption } = req.body;
    
    const exam = await Exam.findById(examId);
    const question = await Question.findById(questionId);
    
    // Check if answer is correct
    const isCorrect = question.options[selectedOption]?.isCorrect || false;
    
    // Update exam
    const existingAnswerIndex = exam.answers.findIndex(
      a => a.questionId.toString() === questionId
    );
    
    if (existingAnswerIndex >= 0) {
      // Update existing answer
      exam.answers[existingAnswerIndex] = {
        questionId,
        selectedOption,
        isCorrect
      };
    } else {
      // Add new answer
      exam.answers.push({
        questionId,
        selectedOption,
        isCorrect
      });
    }
    
    // Recalculate score
    const correctAnswers = exam.answers.filter(a => a.isCorrect).length;
    exam.score = (correctAnswers / exam.totalQuestions) * 100;
    
    await exam.save();
    
    res.json({ 
      success: true, 
      isCorrect,
      score: exam.score
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit exam
router.post('/:examId/submit', async (req, res) => {
  try {
    const { examId } = req.params;
    
    const exam = await Exam.findById(examId)
      .populate('questions');
    
    exam.timeEnded = new Date();
    exam.timeSpent = Math.floor((exam.timeEnded - exam.timeStarted) / 1000);
    exam.passed = exam.score >= 50;
    exam.status = 'completed';
    
    await exam.save();
    
    // Get correct answers for review
    const questionsWithAnswers = await Promise.all(
      exam.questions.map(async (q) => {
        const question = await Question.findById(q);
        const userAnswer = exam.answers.find(
          a => a.questionId.toString() === q._id.toString()
        );
        
        return {
          _id: question._id,
          questionText: question.questionText,
          options: question.options,
          userAnswer: userAnswer ? userAnswer.selectedOption : null,
          isCorrect: userAnswer ? userAnswer.isCorrect : false,
          explanation: question.explanation
        };
      })
    );
    
    res.json({
      examId: exam._id,
      score: exam.score,
      passed: exam.passed,
      totalQuestions: exam.totalQuestions,
      correctAnswers: exam.answers.filter(a => a.isCorrect).length,
      timeSpent: exam.timeSpent,
      questions: questionsWithAnswers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get exam results
router.get('/:examId/results', async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId)
      .populate('questions');
    
    const questionsWithAnswers = await Promise.all(
      exam.questions.map(async (q) => {
        const question = await Question.findById(q);
        const userAnswer = exam.answers.find(
          a => a.questionId.toString() === q._id.toString()
        );
        
        return {
          _id: question._id,
          questionText: question.questionText,
          options: question.options,
          userAnswer: userAnswer ? userAnswer.selectedOption : null,
          isCorrect: userAnswer ? userAnswer.isCorrect : false,
          explanation: question.explanation
        };
      })
    );
    
    res.json({
      examId: exam._id,
      score: exam.score,
      passed: exam.passed,
      totalQuestions: exam.totalQuestions,
      correctAnswers: exam.answers.filter(a => a.isCorrect).length,
      timeSpent: exam.timeSpent,
      questions: questionsWithAnswers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// ========== Configuration ==========
// In a real project, use environment variable: process.env.ADMIN_API_KEY
const ADMIN_API_KEY = 'my-secret-key-123';

// Middleware to check API key
function checkApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (apiKey === ADMIN_API_KEY) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

// ========== Routes ==========

// GET total count of questions
router.get('/questions/count', checkApiKey, async (req, res) => {
    try {
        const count = await Question.countDocuments();
        res.json({ count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get count' });
    }
});

// GET all questions
router.get('/questions', checkApiKey, async (req, res) => {
    try {
        const questions = await Question.find().sort({ createdAt: -1 });
        res.json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});

// GET single question by ID
router.get('/questions/:id', checkApiKey, async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) return res.status(404).json({ error: 'Question not found' });
        res.json(question);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch question' });
    }
});

// POST add a single question
router.post('/questions', checkApiKey, async (req, res) => {
    try {
        const { questionText, options, explanation, topic, difficulty } = req.body;

        // Basic validation
        if (!questionText || !options || !Array.isArray(options) || options.length < 2) {
            return res.status(400).json({ error: 'Invalid question data' });
        }

        // Check if question already exists
        const existing = await Question.findOne({ questionText });
        if (existing) {
            return res.status(409).json({ error: 'Question already exists' });
        }

        const newQuestion = new Question({
            questionText,
            options,
            explanation,
            topic,
            difficulty
        });
        await newQuestion.save();
        res.status(201).json(newQuestion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add question' });
    }
});

// POST bulk add from JSON array
router.post('/questions/bulk', checkApiKey, async (req, res) => {
    try {
        let questions = req.body;

        // Allow both array directly or object with a 'questions' array
        if (questions.questions && Array.isArray(questions.questions)) {
            questions = questions.questions;
        }
        if (!Array.isArray(questions)) {
            return res.status(400).json({ error: 'Expected an array of questions' });
        }

        let added = 0;
        let skipped = 0;

        for (const q of questions) {
            const existing = await Question.findOne({ questionText: q.questionText });
            if (!existing) {
                await Question.create(q);
                added++;
            } else {
                skipped++;
            }
        }

        res.json({ added, skipped, total: questions.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add questions' });
    }
});

// PUT update a question
router.put('/questions/:id', checkApiKey, async (req, res) => {
    try {
        const { questionText, options, explanation, topic, difficulty } = req.body;
        const updated = await Question.findByIdAndUpdate(
            req.params.id,
            { questionText, options, explanation, topic, difficulty },
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ error: 'Question not found' });
        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update question' });
    }
});

// DELETE a question
router.delete('/questions/:id', checkApiKey, async (req, res) => {
    try {
        const deleted = await Question.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Question not found' });
        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete question' });
    }
});

module.exports = router;
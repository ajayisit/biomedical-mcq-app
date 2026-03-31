const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const examRoutes = require('./routes/examRoutes');
const QuestionScraper = require('./utils/questionScraper');

const app = express();
const adminRoutes = require('./routes/adminRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/biomedical-mcq')
  .then(async () => {
    console.log('Connected to MongoDB');
    await QuestionScraper.initializeQuestions();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/exams', examRoutes);
app.use('/api/admin', adminRoutes);

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
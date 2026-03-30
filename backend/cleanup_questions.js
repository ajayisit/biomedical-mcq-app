const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/biomedical-mcq');

const questionSchema = new mongoose.Schema({
  questionText: String,
  options: [{ text: String, isCorrect: Boolean }],
  explanation: String,
  topic: String,
  difficulty: String
});

const Question = mongoose.model('Question', questionSchema);

async function cleanup() {
  try {
    console.log('🔍 Finding invalid questions...');

    // Find questions with less than 2 options
    const invalid = await Question.find({
      $or: [
        { options: { $size: 0 } },
        { options: { $size: 1 } },
        { options: { $exists: false } }
      ]
    });

    console.log(`Found ${invalid.length} invalid questions.`);

    if (invalid.length > 0) {
      console.log('Deleting...');
      const result = await Question.deleteMany({
        $or: [
          { options: { $size: 0 } },
          { options: { $size: 1 } },
          { options: { $exists: false } }
        ]
      });
      console.log(`✅ Deleted ${result.deletedCount} questions.`);
    } else {
      console.log('No invalid questions found.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

cleanup();
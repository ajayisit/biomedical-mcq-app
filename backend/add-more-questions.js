const mongoose = require('mongoose');

// Define schema
const questionSchema = new mongoose.Schema({
  questionText: String,
  options: [{ text: String, isCorrect: Boolean }],
  explanation: String,
  topic: String,
  difficulty: String
});

const Question = mongoose.model('Question', questionSchema);

// ADD YOUR NEW QUESTIONS HERE
const newQuestions = [
  {
    questionText: "What is the difference between Type I and Type II errors?",
    options: [
      { text: "Type I is false positive, Type II is false negative", isCorrect: true },
      { text: "Type I is false negative, Type II is false positive", isCorrect: false },
      { text: "Both are the same", isCorrect: false },
      { text: "Neither exists in statistics", isCorrect: false }
    ],
    explanation: "Type I error (false positive) rejects a true null hypothesis. Type II error (false negative) fails to reject a false null hypothesis.",
    topic: "biostatistics",
    difficulty: "hard"
  },
  {
    questionText: "What is the purpose of a pilot study?",
    options: [
      { text: "To test the feasibility of a larger study", isCorrect: true },
      { text: "To publish research findings", isCorrect: false },
      { text: "To replace the main study", isCorrect: false },
      { text: "To analyze final data", isCorrect: false }
    ],
    explanation: "Pilot studies test procedures, assess feasibility, and help refine methods before a larger study.",
    topic: "research_methodology",
    difficulty: "easy"
  },
  {
    questionText: "What is the Hawthorne Effect?",
    options: [
      { text: "People change their behavior when they know they're being observed", isCorrect: true },
      { text: "A statistical error in data analysis", isCorrect: false },
      { text: "A type of sampling bias", isCorrect: false },
      { text: "An ethical violation in research", isCorrect: false }
    ],
    explanation: "The Hawthorne Effect refers to individuals modifying their behavior in response to being observed.",
    topic: "research_methodology",
    difficulty: "medium"
  },
  {
    questionText: "What is a confounding variable?",
    options: [
      { text: "A variable that influences both the independent and dependent variables", isCorrect: true },
      { text: "The main variable being studied", isCorrect: false },
      { text: "A variable that has no effect on the study", isCorrect: false },
      { text: "The outcome variable", isCorrect: false }
    ],
    explanation: "Confounding variables are extraneous factors that are associated with both the exposure and outcome, potentially distorting the true relationship.",
    topic: "epidemiology",
    difficulty: "hard"
  },
  {
    questionText: "What is the purpose of peer review in scientific publishing?",
    options: [
      { text: "To validate and improve the quality of research before publication", isCorrect: true },
      { text: "To increase publication speed", isCorrect: false },
      { text: "To reduce the number of publications", isCorrect: false },
      { text: "To promote specific authors", isCorrect: false }
    ],
    explanation: "Peer review ensures quality, validity, and credibility of research by having experts evaluate it before publication.",
    topic: "literature_review",
    difficulty: "easy"
  },
  {
    questionText: "What does 'validity' refer to in research?",
    options: [
      { text: "The extent to which a test measures what it claims to measure", isCorrect: true },
      { text: "The consistency of measurement", isCorrect: false },
      { text: "The sample size of the study", isCorrect: false },
      { text: "The statistical power of the test", isCorrect: false }
    ],
    explanation: "Validity indicates whether a tool or method actually measures what it is intended to measure.",
    topic: "research_methodology",
    difficulty: "medium"
  },
  {
    questionText: "What is the difference between incidence and prevalence?",
    options: [
      { text: "Incidence is new cases, prevalence is total existing cases", isCorrect: true },
      { text: "Incidence is total cases, prevalence is new cases", isCorrect: false },
      { text: "Both mean the same thing", isCorrect: false },
      { text: "Incidence is for chronic diseases only", isCorrect: false }
    ],
    explanation: "Incidence measures new cases over time, while prevalence measures all existing cases at a point in time.",
    topic: "epidemiology",
    difficulty: "medium"
  },
  {
    questionText: "What is the purpose of blinding in clinical trials?",
    options: [
      { text: "To prevent bias from knowledge of treatment assignment", isCorrect: true },
      { text: "To hide the study purpose from participants", isCorrect: false },
      { text: "To increase sample size", isCorrect: false },
      { text: "To reduce costs", isCorrect: false }
    ],
    explanation: "Blinding prevents conscious or unconscious bias by keeping participants, investigators, or analysts unaware of treatment assignments.",
    topic: "research_methodology",
    difficulty: "medium"
  },
  {
    questionText: "What is a case-control study?",
    options: [
      { text: "A study that compares individuals with a condition to those without", isCorrect: true },
      { text: "A study that follows individuals over time", isCorrect: false },
      { text: "A study that randomly assigns treatments", isCorrect: false },
      { text: "A study that only looks at one individual", isCorrect: false }
    ],
    explanation: "Case-control studies compare people with a disease (cases) to those without (controls) to identify risk factors.",
    topic: "epidemiology",
    difficulty: "easy"
  },
  {
    questionText: "What is the significance of a 95% confidence interval?",
    options: [
      { text: "We are 95% confident the true population parameter lies within this interval", isCorrect: true },
      { text: "There's a 95% chance the sample is representative", isCorrect: false },
      { text: "95% of the data falls within this range", isCorrect: false },
      { text: "The p-value is 0.05", isCorrect: false }
    ],
    explanation: "A 95% confidence interval means that if you repeated the study many times, 95% of the intervals would contain the true population parameter.",
    topic: "biostatistics",
    difficulty: "hard"
  }
];

async function addMoreQuestions() {
  try {
    await mongoose.connect('mongodb://localhost:27017/biomedical-mcq');
    console.log('✅ Connected to MongoDB');
    
    // Check current count
    const beforeCount = await Question.countDocuments();
    console.log(`📊 Questions before: ${beforeCount}`);
    
    // Add new questions
    const result = await Question.insertMany(newQuestions);
    console.log(`✅ Added ${result.length} new questions`);
    
    // Check new count
    const afterCount = await Question.countDocuments();
    console.log(`📊 Questions now: ${afterCount}`);
    console.log(`📈 Total added: ${afterCount - beforeCount}`);
    
    console.log('🎉 Success! Restart your backend to see new questions.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 11000) {
      console.log('⚠️ Some questions might already exist. Check for duplicates.');
    }
    process.exit(1);
  }
}

addMoreQuestions();
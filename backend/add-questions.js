const mongoose = require('mongoose');

// Define schema directly
const questionSchema = new mongoose.Schema({
  questionText: String,
  options: [{ text: String, isCorrect: Boolean }],
  explanation: String,
  topic: String,
  difficulty: String
});

const Question = mongoose.model('Question', questionSchema);

const additionalQuestions = [
  {
    questionText: "What is the purpose of a placebo in clinical trials?",
    options: [
      { text: "To reduce the cost of the trial", isCorrect: false },
      { text: "To measure the true effect of the treatment by controlling for the placebo effect", isCorrect: true },
      { text: "To increase the sample size", isCorrect: false },
      { text: "To make the trial last longer", isCorrect: false }
    ],
    explanation: "A placebo helps control for the placebo effect, allowing researchers to measure the true effect of the treatment.",
    topic: "research_methodology",
    difficulty: "medium"
  },
  {
    questionText: "What does 'intention-to-treat' analysis mean?",
    options: [
      { text: "Analyzing only patients who completed the study", isCorrect: false },
      { text: "Analyzing patients based on the treatment they were assigned, regardless of what they actually received", isCorrect: true },
      { text: "Analyzing only patients who took all medications", isCorrect: false },
      { text: "Analyzing patients after they withdraw from the study", isCorrect: false }
    ],
    explanation: "Intention-to-treat analysis includes all participants as originally assigned, preserving the benefits of randomization.",
    topic: "biostatistics",
    difficulty: "hard"
  },
  {
    questionText: "What is the main advantage of a cohort study?",
    options: [
      { text: "Can establish temporal sequence between exposure and outcome", isCorrect: true },
      { text: "Inexpensive to conduct", isCorrect: false },
      { text: "Requires small sample size", isCorrect: false },
      { text: "Short duration", isCorrect: false }
    ],
    explanation: "Cohort studies follow participants over time, allowing researchers to see whether exposure precedes the outcome.",
    topic: "epidemiology",
    difficulty: "medium"
  },
  {
    questionText: "What is the Belmont Report known for?",
    options: [
      { text: "Establishing statistical methods", isCorrect: false },
      { text: "Outlining ethical principles for research with human subjects", isCorrect: true },
      { text: "Creating the first clinical trial", isCorrect: false },
      { text: "Defining research methodology", isCorrect: false }
    ],
    explanation: "The Belmont Report established three ethical principles: respect for persons, beneficence, and justice.",
    topic: "ethics",
    difficulty: "easy"
  },
  {
    questionText: "What does 'power' refer to in statistical analysis?",
    options: [
      { text: "The probability of correctly rejecting a false null hypothesis", isCorrect: true },
      { text: "The sample size of the study", isCorrect: false },
      { text: "The effect size of the treatment", isCorrect: false },
      { text: "The significance level of the test", isCorrect: false }
    ],
    explanation: "Power is the probability that a study will detect an effect when there is an effect to be detected.",
    topic: "biostatistics",
    difficulty: "hard"
  },
  {
    questionText: "What is publication bias?",
    options: [
      { text: "Publishing only positive results", isCorrect: true },
      { text: "Publishing all study results", isCorrect: false },
      { text: "Publishing only negative results", isCorrect: false },
      { text: "Not publishing any results", isCorrect: false }
    ],
    explanation: "Publication bias occurs when studies with positive results are more likely to be published than those with null or negative results.",
    topic: "research_methodology",
    difficulty: "medium"
  },
  {
    questionText: "What is the role of an Institutional Review Board (IRB)?",
    options: [
      { text: "To fund research projects", isCorrect: false },
      { text: "To protect the rights and welfare of human research subjects", isCorrect: true },
      { text: "To analyze research data", isCorrect: false },
      { text: "To publish research findings", isCorrect: false }
    ],
    explanation: "IRBs review research protocols to ensure ethical standards are met and participants are protected.",
    topic: "ethics",
    difficulty: "easy"
  },
  {
    questionText: "What is a meta-analysis?",
    options: [
      { text: "A statistical technique that combines results from multiple studies", isCorrect: true },
      { text: "A review of a single study", isCorrect: false },
      { text: "A type of observational study", isCorrect: false },
      { text: "A laboratory experiment", isCorrect: false }
    ],
    explanation: "Meta-analysis statistically combines results from multiple studies to increase power and precision.",
    topic: "literature_review",
    difficulty: "medium"
  },
  {
    questionText: "What is the difference between correlation and causation?",
    options: [
      { text: "They mean the same thing", isCorrect: false },
      { text: "Correlation implies a relationship, but causation requires evidence that one variable directly affects another", isCorrect: true },
      { text: "Causation implies correlation", isCorrect: false },
      { text: "Correlation is stronger than causation", isCorrect: false }
    ],
    explanation: "Correlation indicates an association, but causation requires establishing that changes in one variable directly cause changes in another.",
    topic: "epidemiology",
    difficulty: "medium"
  },
  {
    questionText: "What is the null hypothesis?",
    options: [
      { text: "The hypothesis that there is an effect", isCorrect: false },
      { text: "The hypothesis that there is no effect or no difference", isCorrect: true },
      { text: "The hypothesis that proves causation", isCorrect: false },
      { text: "The hypothesis that is always accepted", isCorrect: false }
    ],
    explanation: "The null hypothesis assumes no relationship between variables or no difference between groups.",
    topic: "biostatistics",
    difficulty: "easy"
  }
];

async function addQuestions() {
  try {
    await mongoose.connect('mongodb://localhost:27017/biomedical-mcq');
    console.log('✅ Connected to MongoDB');
    
    // Check existing questions
    const existingCount = await Question.countDocuments();
    console.log(`📊 Existing questions: ${existingCount}`);
    
    // Add new questions
    const result = await Question.insertMany(additionalQuestions);
    console.log(`✅ Added ${result.length} new questions`);
    
    const newCount = await Question.countDocuments();
    console.log(`📊 Total questions now: ${newCount}`);
    
    console.log('🎉 Done! You can now restart your backend and take exams with more variety!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding questions:', error.message);
    process.exit(1);
  }
}

addQuestions();
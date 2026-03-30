const fs = require('fs');

// Get input and output filenames from command line arguments
const inputFile = process.argv[2];
const outputFile = process.argv[3];

if (!inputFile || !outputFile) {
  console.error('Usage: node transform_questions.js <input.json> <output.json>');
  process.exit(1);
}

// Check if input file exists
if (!fs.existsSync(inputFile)) {
  console.error(`Input file "${inputFile}" not found.`);
  process.exit(1);
}

// Read the input JSON
const rawData = fs.readFileSync(inputFile, 'utf8');
let questions;
try {
  questions = JSON.parse(rawData);
} catch (err) {
  console.error('Invalid JSON file:', err.message);
  process.exit(1);
}

if (!Array.isArray(questions)) {
  console.error('Input must be an array of questions.');
  process.exit(1);
}

// Mapping for topics
const topicMap = {
  "Introduction to Health Research": "research_methodology",
  "Sampling": "research_methodology",
  "Study Protocol": "research_methodology",
  "Research Ethics & Regulation": "ethics",
  "Study Design": "research_methodology",
  "Literature Review": "literature_review",
  "Study Designs": "research_methodology",
  "Bias & Confounding": "epidemiology",
  "Sample Size": "biostatistics",
  "Research Process": "research_methodology",
  "Research Question & Objectives": "research_methodology",
  "Scientific Writing": "literature_review",
  "Epidemiology Measures": "epidemiology"
};

// Mapping for difficulty levels
const difficultyMap = {
  "Basic": "easy",
  "Intermediate": "medium",
  "Advanced": "hard"
};

const transformed = [];

for (const q of questions) {
  // Skip if missing essential fields
  if (!q.question || !q.options || !q.answer) {
    console.warn(`Skipping question with missing fields: ${q.question ? q.question.substring(0, 50) : '?'}...`);
    continue;
  }

  const answerLetter = q.answer.toLowerCase().trim();
  const answerIndex = answerLetter.charCodeAt(0) - 97;

  const optionsObj = q.options.map((opt, idx) => ({
    text: opt,
    isCorrect: (idx === answerIndex)
  }));

  // Map topic
  let topic = topicMap[q.topic];
  if (!topic) {
    // Fallback: try to infer from question text
    const text = q.question.toLowerCase();
    if (text.includes('ethics') || text.includes('consent')) topic = 'ethics';
    else if (text.includes('statistic') || text.includes('p-value')) topic = 'biostatistics';
    else if (text.includes('epidemi') || text.includes('cohort')) topic = 'epidemiology';
    else if (text.includes('literature') || text.includes('review')) topic = 'literature_review';
    else topic = 'research_methodology';
  }

  // Map difficulty
  let difficulty = difficultyMap[q.difficulty];
  if (!difficulty) difficulty = 'medium';

  transformed.push({
    questionText: q.question,
    options: optionsObj,
    explanation: q.explanation || '',
    topic: topic,
    difficulty: difficulty
  });
}

// Write the output
fs.writeFileSync(outputFile, JSON.stringify(transformed, null, 2));
console.log(`✅ Transformed ${transformed.length} questions.`);
console.log(`Output written to: ${outputFile}`);
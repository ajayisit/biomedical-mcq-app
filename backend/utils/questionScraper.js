const axios = require('axios');
const cheerio = require('cheerio');
const Question = require('../models/Question');

class QuestionScraper {
  // Sample biomedical research questions (you can add more sources)
  static sampleQuestions = [
    {
      questionText: "What is the primary purpose of randomization in clinical trials?",
      options: [
        { text: "To ensure equal group sizes", isCorrect: false },
        { text: "To eliminate selection bias", isCorrect: true },
        { text: "To reduce the cost of the trial", isCorrect: false },
        { text: "To make analysis easier", isCorrect: false }
      ],
      explanation: "Randomization helps eliminate selection bias by ensuring that participant characteristics are balanced between groups.",
      topic: "research_methodology",
      difficulty: "medium"
    },
    {
      questionText: "Which statistical test is most appropriate for comparing means between two independent groups?",
      options: [
        { text: "Paired t-test", isCorrect: false },
        { text: "Chi-square test", isCorrect: false },
        { text: "Independent samples t-test", isCorrect: true },
        { text: "ANOVA", isCorrect: false }
      ],
      explanation: "Independent samples t-test is used to compare means between two unrelated groups.",
      topic: "biostatistics",
      difficulty: "medium"
    },
    {
      questionText: "What is a p-value?",
      options: [
        { text: "The probability that the null hypothesis is true", isCorrect: false },
        { text: "The probability of observing the data, given that the null hypothesis is true", isCorrect: true },
        { text: "The probability of making a Type II error", isCorrect: false },
        { text: "The effect size of the study", isCorrect: false }
      ],
      explanation: "A p-value is the probability of obtaining test results at least as extreme as the observed results, assuming the null hypothesis is true.",
      topic: "biostatistics",
      difficulty: "hard"
    },
    {
      questionText: "Which study design is best for establishing causality?",
      options: [
        { text: "Cross-sectional study", isCorrect: false },
        { text: "Case-control study", isCorrect: false },
        { text: "Randomized controlled trial", isCorrect: true },
        { text: "Cohort study", isCorrect: false }
      ],
      explanation: "Randomized controlled trials are considered the gold standard for establishing causality due to randomization and control.",
      topic: "epidemiology",
      difficulty: "medium"
    },
    {
      questionText: "What is informed consent in research ethics?",
      options: [
        { text: "Getting permission from the institution", isCorrect: false },
        { text: "Participants agreeing without knowing details", isCorrect: false },
        { text: "Voluntary agreement after understanding all relevant aspects", isCorrect: true },
        { text: "Written agreement only", isCorrect: false }
      ],
      explanation: "Informed consent means participants voluntarily agree to participate after understanding all relevant aspects of the research.",
      topic: "ethics",
      difficulty: "easy"
    },
    {
      questionText: "What is a systematic review?",
      options: [
        { text: "A review of a single study", isCorrect: false },
        { text: "A comprehensive review of all available evidence on a topic", isCorrect: true },
        { text: "A review conducted by a single author", isCorrect: false },
        { text: "A review without a methodology", isCorrect: false }
      ],
      explanation: "A systematic review comprehensively collects and analyzes all available evidence on a specific research question.",
      topic: "literature_review",
      difficulty: "medium"
    },
    {
      questionText: "What does 'blinding' in clinical trials prevent?",
      options: [
        { text: "Selection bias", isCorrect: false },
        { text: "Performance and detection bias", isCorrect: true },
        { text: "Attrition bias", isCorrect: false },
        { text: "Reporting bias", isCorrect: false }
      ],
      explanation: "Blinding prevents performance bias (knowledge of intervention affecting behavior) and detection bias (knowledge affecting outcome assessment).",
      topic: "research_methodology",
      difficulty: "medium"
    },
    {
      questionText: "What is the main advantage of a crossover design?",
      options: [
        { text: "Each participant serves as their own control", isCorrect: true },
        { text: "Requires fewer participants than parallel design", isCorrect: false },
        { text: "Eliminates carryover effects", isCorrect: false },
        { text: "Shorter study duration", isCorrect: false }
      ],
      explanation: "In crossover designs, each participant receives all interventions, serving as their own control, reducing variability.",
      topic: "research_methodology",
      difficulty: "hard"
    },
    {
      questionText: "Which measure is used to express the strength of association in case-control studies?",
      options: [
        { text: "Relative risk", isCorrect: false },
        { text: "Odds ratio", isCorrect: true },
        { text: "Risk difference", isCorrect: false },
        { text: "Attributable risk", isCorrect: false }
      ],
      explanation: "Odds ratio is used in case-control studies as incidence rates cannot be calculated directly.",
      topic: "epidemiology",
      difficulty: "hard"
    },
    {
      questionText: "What is the purpose of a control group?",
      options: [
        { text: "To receive the experimental treatment", isCorrect: false },
        { text: "To provide a baseline for comparison", isCorrect: true },
        { text: "To increase sample size", isCorrect: false },
        { text: "To monitor side effects", isCorrect: false }
      ],
      explanation: "A control group provides a baseline to compare the effects of the intervention against no intervention or a standard treatment.",
      topic: "research_methodology",
      difficulty: "easy"
    }
  ];

  static async initializeQuestions() {
    try {
      const count = await Question.countDocuments();
      if (count === 0) {
        await Question.insertMany(this.sampleQuestions);
        console.log('Sample questions initialized');
      }
    } catch (error) {
      console.error('Error initializing questions:', error);
    }
  }

  // You can extend this to scrape from online sources
  static async scrapeFromSource(url) {
    // Implementation for web scraping would go here
    // Be respectful of robots.txt and terms of service
  }
}

module.exports = QuestionScraper;
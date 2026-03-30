import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results } = location.state || {};
  const [showAnswers, setShowAnswers] = useState(false);

  if (!results) {
    navigate('/');
    return null;
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 1rem'
    },
    content: {
      maxWidth: '900px',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '1rem',
      textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
    },
    passBadge: (passed) => ({
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.75rem 1.5rem',
      borderRadius: '9999px',
      backgroundColor: passed ? '#d1fae5' : '#fee2e2',
      color: passed ? '#065f46' : '#991b1b',
      fontWeight: 'bold',
      fontSize: '1.125rem'
    }),
    scoreCard: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      padding: '2rem',
      marginBottom: '2rem'
    },
    scoreGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1.5rem',
      textAlign: 'center'
    },
    scoreItem: {
      borderRight: '1px solid #e5e7eb'
    },
    scoreValue: (color) => ({
      fontSize: '3rem',
      fontWeight: 'bold',
      color: color || '#4f46e5',
      marginBottom: '0.5rem'
    }),
    scoreLabel: {
      color: '#6b7280',
      fontSize: '0.875rem'
    },
    scoreSubtext: {
      fontSize: '0.75rem',
      color: '#9ca3af',
      marginTop: '0.25rem'
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      marginBottom: '2rem',
      flexWrap: 'wrap'
    },
    primaryButton: {
      backgroundColor: '#4f46e5',
      color: 'white',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      fontSize: '1rem'
    },
    secondaryButton: {
      backgroundColor: '#e5e7eb',
      color: '#374151',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      fontSize: '1rem'
    },
    reviewSection: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      padding: '1.5rem'
    },
    reviewTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '1.5rem'
    },
    questionItem: {
      borderBottom: '1px solid #e5e7eb',
      paddingBottom: '1.5rem',
      marginBottom: '1.5rem'
    },
    questionHeader: {
      display: 'flex',
      alignItems: 'start',
      marginBottom: '1rem'
    },
    statusIcon: (isCorrect) => ({
      fontSize: '1.5rem',
      marginRight: '0.75rem',
      color: isCorrect ? '#10b981' : '#ef4444'
    }),
    questionText: {
      fontWeight: '600',
      color: '#111827',
      fontSize: '1rem',
      flex: 1
    },
    optionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '0.75rem',
      marginBottom: '1rem'
    },
    optionBox: (isUserAnswer, isCorrect, isTheCorrectAnswer) => {
      let bgColor = '#f9fafb';
      let borderColor = '#e5e7eb';
      
      if (isUserAnswer && isCorrect) {
        bgColor = '#d1fae5';
        borderColor = '#10b981';
      } else if (isUserAnswer && !isCorrect) {
        bgColor = '#fee2e2';
        borderColor = '#ef4444';
      } else if (isTheCorrectAnswer) {
        bgColor = '#d1fae5';
        borderColor = '#10b981';
      }
      
      return {
        padding: '0.75rem',
        borderRadius: '0.5rem',
        border: `1px solid ${borderColor}`,
        backgroundColor: bgColor
      };
    },
    explanationBox: {
      backgroundColor: '#eff6ff',
      padding: '1rem',
      borderRadius: '0.5rem',
      marginTop: '0.5rem'
    },
    explanationTitle: {
      fontWeight: 'bold',
      color: '#1e40af',
      marginBottom: '0.25rem'
    },
    explanationText: {
      color: '#1e3a8a',
      marginTop: '0.25rem'
    }
  };

  // Remove border from last item in grid
  const getScoreItemStyle = (index) => {
    if (index === 1) return {};
    return { ...styles.scoreItem, borderRight: index === 0 ? '1px solid #e5e7eb' : 'none' };
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Exam Results</h1>
          <div style={styles.passBadge(results.passed)}>
            {results.passed ? '🎉 Congratulations! You Passed!' : '📚 Better Luck Next Time'}
          </div>
        </div>

        {/* Score Card */}
        <div style={styles.scoreCard}>
          <div style={styles.scoreGrid}>
            <div>
              <div style={styles.scoreValue('#4f46e5')}>
                {results.score.toFixed(1)}%
              </div>
              <div style={styles.scoreLabel}>Final Score</div>
              <div style={styles.scoreSubtext}>(50% required to pass)</div>
            </div>
            
            <div>
              <div style={styles.scoreValue('#10b981')}>
                {results.correctAnswers}/{results.totalQuestions}
              </div>
              <div style={styles.scoreLabel}>Correct Answers</div>
            </div>
            
            <div>
              <div style={styles.scoreValue('#374151')}>
                {formatTime(results.timeSpent)}
              </div>
              <div style={styles.scoreLabel}>Time Taken</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.buttonGroup}>
          <button
            onClick={() => setShowAnswers(!showAnswers)}
            style={styles.primaryButton}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#4338ca'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#4f46e5'}
          >
            {showAnswers ? 'Hide Answers' : '📖 Review Answers'}
          </button>
          <button
            onClick={() => navigate('/')}
            style={styles.secondaryButton}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#d1d5db'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#e5e7eb'}
          >
            Take Another Exam
          </button>
        </div>

        {/* Answers Review */}
        {showAnswers && (
          <div style={styles.reviewSection}>
            <h2 style={styles.reviewTitle}>Detailed Review</h2>
            {results.questions.map((q, idx) => (
              <div key={q._id} style={styles.questionItem}>
                <div style={styles.questionHeader}>
                  <div style={styles.statusIcon(q.isCorrect)}>
                    {q.isCorrect ? '✓' : '✗'}
                  </div>
                  <div style={styles.questionText}>
                    <strong>Q{idx + 1}.</strong> {q.questionText}
                  </div>
                </div>
                
                <div style={styles.optionsGrid}>
                  {q.options.map((opt, optIdx) => {
                    const isUserAnswer = optIdx === q.userAnswer;
                    const isCorrectAnswer = opt.isCorrect;
                    
                    return (
                      <div
                        key={optIdx}
                        style={styles.optionBox(isUserAnswer, q.isCorrect, isCorrectAnswer)}
                      >
                        <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt.text}
                        {isCorrectAnswer && <span style={{ marginLeft: '0.5rem', color: '#10b981' }}>✓ (Correct Answer)</span>}
                        {isUserAnswer && !q.isCorrect && <span style={{ marginLeft: '0.5rem', color: '#ef4444' }}>✗ (Your Answer)</span>}
                      </div>
                    );
                  })}
                </div>
                
                {q.explanation && (
                  <div style={styles.explanationBox}>
                    <div style={styles.explanationTitle}>📝 Explanation:</div>
                    <div style={styles.explanationText}>{q.explanation}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
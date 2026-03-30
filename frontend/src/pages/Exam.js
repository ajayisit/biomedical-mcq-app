import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Exam = () => {
  const { examId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { examData } = location.state || {};
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(3600);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!examData) {
      navigate('/');
    }
  }, [examData, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = async (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));

    try {
      await axios.post(`http://localhost:5000/api/exams/${examId}/answer`, {
        questionId,
        selectedOption: optionIndex
      });
    } catch (error) {
      toast.error('Failed to save answer');
    }
  };

  const toggleReview = () => {
    const questionId = examData.questions[currentQuestion]._id;
    setMarkedForReview(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    if (window.confirm('Are you sure you want to submit the exam?')) {
      try {
        setSubmitting(true);
        const response = await axios.post(`http://localhost:5000/api/exams/${examId}/submit`);
        navigate(`/results/${examId}`, { state: { results: response.data }, replace: true });
      } catch (error) {
        toast.error('Failed to submit exam');
        setSubmitting(false);
      }
    }
  };

  if (!examData) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;

  const currentQ = examData.questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / examData.totalQuestions) * 100;

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f3f4f6'
    },
    header: {
      backgroundColor: 'white',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 10
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#312e81'
    },
    questionBadge: {
      backgroundColor: '#e0e7ff',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      color: '#3730a3',
      fontWeight: '500'
    },
    timer: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#dc2626'
    },
    submitButton: {
      backgroundColor: '#059669',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500'
    },
    progressBar: {
      height: '4px',
      backgroundColor: '#e5e7eb'
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#4f46e5',
      transition: 'width 0.3s',
      width: `${progress}%`
    },
    mainContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1rem'
    },
    twoColumnLayout: {
      display: 'flex',
      gap: '1.5rem',
      flexWrap: 'wrap'
    },
    questionArea: {
      flex: '3',
      minWidth: '250px'
    },
    questionCard: {
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      padding: '1.5rem'
    },
    questionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'start',
      marginBottom: '1rem',
      flexWrap: 'wrap',
      gap: '0.5rem'
    },
    topicBadge: {
      padding: '0.25rem 0.75rem',
      backgroundColor: '#e0e7ff',
      color: '#3730a3',
      borderRadius: '9999px',
      fontSize: '0.875rem'
    },
    reviewButton: {
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      backgroundColor: '#f3f4f6',
      color: '#374151'
    },
    questionText: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '1.5rem'
    },
    optionsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    },
    optionLabel: (isSelected) => ({
      display: 'flex',
      alignItems: 'center',
      padding: '1rem',
      border: `2px solid ${isSelected ? '#4f46e5' : '#e5e7eb'}`,
      borderRadius: '0.5rem',
      cursor: 'pointer',
      backgroundColor: isSelected ? '#eef2ff' : 'white',
      transition: 'all 0.2s'
    }),
    radioInput: {
      width: '1rem',
      height: '1rem',
      marginRight: '0.75rem',
      cursor: 'pointer'
    },
    optionText: {
      color: '#374151'
    },
    navigatorArea: {
      flex: '1',
      minWidth: '200px'
    },
    navigatorCard: {
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      padding: '1rem',
      position: 'sticky',
      top: '6rem'
    },
    navigatorTitle: {
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '0.75rem'
    },
    navigatorGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '0.5rem',
      marginBottom: '1rem'
    },
    navButton: (isAnswered, isMarked, isCurrent) => ({
      backgroundColor: isMarked ? '#fcd34d' : (isAnswered ? '#10b981' : '#e5e7eb'),
      color: 'white',
      width: '2.5rem',
      height: '2.5rem',
      borderRadius: '0.5rem',
      fontWeight: '500',
      border: isCurrent ? '2px solid #4f46e5' : 'none',
      cursor: 'pointer'
    }),
    legend: {
      marginTop: '1rem',
      fontSize: '0.875rem'
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '0.5rem'
    },
    legendColor: (color) => ({
      width: '1rem',
      height: '1rem',
      backgroundColor: color,
      borderRadius: '0.25rem',
      marginRight: '0.5rem'
    }),
    navButtons: {
      marginTop: '1rem',
      display: 'flex',
      gap: '0.5rem'
    },
    navPrevNext: {
      flex: 1,
      padding: '0.5rem',
      backgroundColor: '#e5e7eb',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <h1 style={styles.title}>MCQ Exam</h1>
            <div style={styles.questionBadge}>
              Q{currentQuestion + 1}/{examData.totalQuestions}
            </div>
          </div>
          
          <div style={styles.headerLeft}>
            <div style={styles.timer}>⏱️ {formatTime(timeLeft)}</div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={styles.submitButton}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#047857'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#059669'}
            >
              {submitting ? 'Submitting...' : 'Submit Exam'}
            </button>
          </div>
        </div>
        <div style={styles.progressBar}>
          <div style={styles.progressFill}></div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.twoColumnLayout}>
          {/* Question Area */}
          <div style={styles.questionArea}>
            <div style={styles.questionCard}>
              <div style={styles.questionHeader}>
                <span style={styles.topicBadge}>
                  {currentQ.topic?.replace('_', ' ').toUpperCase()}
                </span>
                <button
                  onClick={toggleReview}
                  style={{
                    ...styles.reviewButton,
                    backgroundColor: markedForReview.has(currentQ._id) ? '#fef3c7' : '#f3f4f6',
                    color: markedForReview.has(currentQ._id) ? '#92400e' : '#374151'
                  }}
                >
                  {markedForReview.has(currentQ._id) ? '✓ Marked for Review' : '📌 Mark for Review'}
                </button>
              </div>
              
              <h2 style={styles.questionText}>
                {currentQuestion + 1}. {currentQ.questionText}
              </h2>
              
              <div style={styles.optionsList}>
                {currentQ.options.map((option, idx) => (
                  <label
                    key={idx}
                    style={styles.optionLabel(answers[currentQ._id] === idx)}
                    onMouseEnter={(e) => {
                      if (answers[currentQ._id] !== idx) {
                        e.currentTarget.style.borderColor = '#a5b4fc';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (answers[currentQ._id] !== idx) {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                      }
                    }}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQ._id}`}
                      checked={answers[currentQ._id] === idx}
                      onChange={() => handleAnswerSelect(currentQ._id, idx)}
                      style={styles.radioInput}
                    />
                    <span style={styles.optionText}>
                      <strong>{String.fromCharCode(65 + idx)}.</strong> {option.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Navigator Area */}
          <div style={styles.navigatorArea}>
            <div style={styles.navigatorCard}>
              <h3 style={styles.navigatorTitle}>Question Navigator</h3>
              <div style={styles.navigatorGrid}>
                {examData.questions.map((q, idx) => {
                  const isAnswered = answers[q._id] !== undefined;
                  const isMarked = markedForReview.has(q._id);
                  const isCurrent = currentQuestion === idx;
                  
                  return (
                    <button
                      key={q._id}
                      onClick={() => setCurrentQuestion(idx)}
                      style={styles.navButton(isAnswered, isMarked, isCurrent)}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
              
              <div style={styles.legend}>
                <div style={styles.legendItem}>
                  <div style={styles.legendColor('#10b981')}></div>
                  <span>Answered</span>
                </div>
                <div style={styles.legendItem}>
                  <div style={styles.legendColor('#fcd34d')}></div>
                  <span>Marked for Review</span>
                </div>
                <div style={styles.legendItem}>
                  <div style={styles.legendColor('#e5e7eb')}></div>
                  <span>Not Answered</span>
                </div>
              </div>

              <div style={styles.navButtons}>
                <button
                  onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestion === 0}
                  style={styles.navPrevNext}
                >
                  ← Previous
                </button>
                <button
                  onClick={() => setCurrentQuestion(prev => Math.min(examData.totalQuestions - 1, prev + 1))}
                  disabled={currentQuestion === examData.totalQuestions - 1}
                  style={styles.navPrevNext}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exam;
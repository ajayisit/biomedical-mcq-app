import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const ExamSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    difficulty: '',
    numberOfQuestions: 10
  });
  const [customNumber, setCustomNumber] = useState(false);
  const [customValue, setCustomValue] = useState(10);
  const [customRaw, setCustomRaw] = useState('10');
  const customInputRef = useRef(null);

  const topics = [
    { value: '', label: 'All Topics' },
    { value: 'research_methodology', label: 'Research Methodology' },
    { value: 'biostatistics', label: 'Biostatistics' },
    { value: 'epidemiology', label: 'Epidemiology' },
    { value: 'ethics', label: 'Research Ethics' },
    { value: 'literature_review', label: 'Literature Review' }
  ];

  const difficulties = [
    { value: '', label: 'All Levels' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const questionCountOptions = [10, 25, 50, 75, 100];

  useEffect(() => {
    if (customNumber && customInputRef.current) {
      customInputRef.current.focus();
      setCustomRaw(formData.numberOfQuestions.toString());
      setCustomValue(formData.numberOfQuestions);
    }
  }, [customNumber, formData.numberOfQuestions]);

  const handleNumberChange = (e) => {
    const val = e.target.value;
    if (val === 'custom') {
      setCustomNumber(true);
    } else {
      setCustomNumber(false);
      setFormData({ ...formData, numberOfQuestions: parseInt(val) });
    }
  };

  const handleCustomChange = (e) => {
    const raw = e.target.value;
    setCustomRaw(raw);
    // Only update the actual number if the raw value is a valid integer within range
    const num = parseInt(raw, 10);
    if (!isNaN(num) && num >= 5 && num <= 100) {
      setCustomValue(num);
      setFormData({ ...formData, numberOfQuestions: num });
    }
  };

  const handleCustomBlur = () => {
    let num = parseInt(customRaw, 10);
    if (isNaN(num) || num < 5) num = 5;
    if (num > 100) num = 100;
    setCustomRaw(num.toString());
    setCustomValue(num);
    setFormData({ ...formData, numberOfQuestions: num });
  };

  const handleStartExam = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/exams/start', formData);
      if (response.data.warning) {
        toast(response.data.warning, { icon: '⚠️' });
      }
      navigate(`/exam/${response.data.examId}`, { state: { examData: response.data } });
    } catch (error) {
      toast.error('Failed to start exam. Please make sure the backend server is running.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const pageStyles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      padding: '2rem',
      width: '100%',
      maxWidth: '28rem'
    },
    title: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '2rem',
      color: '#1e1b4b'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '0.5rem'
    },
    select: {
      width: '100%',
      padding: '0.5rem 1rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      backgroundColor: 'white'
    },
    input: {
      width: '100%',
      padding: '0.5rem 1rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      marginTop: '0.5rem'
    },
    helperText: {
      fontSize: '0.75rem',
      color: '#6b7280',
      marginTop: '0.25rem',
      marginLeft: '0.25rem'
    },
    rulesBox: {
      backgroundColor: '#eff6ff',
      padding: '1rem',
      borderRadius: '0.5rem',
      marginBottom: '1.5rem'
    },
    rulesTitle: {
      fontWeight: 'bold',
      color: '#1e40af',
      marginBottom: '0.5rem'
    },
    rulesList: {
      fontSize: '0.875rem',
      color: '#2563eb',
      listStyle: 'disc',
      paddingLeft: '1.25rem'
    },
    ruleItem: {
      marginBottom: '0.25rem'
    },
    button: {
      width: '100%',
      backgroundColor: loading ? '#9ca3af' : '#4f46e5',
      color: 'white',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      fontWeight: 'bold',
      border: 'none',
      cursor: loading ? 'not-allowed' : 'pointer',
      transition: 'background-color 0.2s'
    }
  };

  return (
    <div style={pageStyles.container}>
      <div style={pageStyles.card}>
        <h1 style={pageStyles.title}>
          Biomedical Research MCQ Exam
        </h1>

        <div>
          <div style={pageStyles.formGroup}>
            <label style={pageStyles.label}>Select Topic</label>
            <select
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              style={pageStyles.select}
            >
              {topics.map(topic => (
                <option key={topic.value} value={topic.value}>
                  {topic.label}
                </option>
              ))}
            </select>
          </div>

          <div style={pageStyles.formGroup}>
            <label style={pageStyles.label}>Difficulty Level</label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              style={pageStyles.select}
            >
              {difficulties.map(diff => (
                <option key={diff.value} value={diff.value}>
                  {diff.label}
                </option>
              ))}
            </select>
          </div>

          <div style={pageStyles.formGroup}>
            <label style={pageStyles.label}>Number of Questions (5-100)</label>
            <select
              value={customNumber ? 'custom' : formData.numberOfQuestions}
              onChange={handleNumberChange}
              style={pageStyles.select}
            >
              {questionCountOptions.map(num => (
                <option key={num} value={num}>{num} questions</option>
              ))}
              <option value="custom">Custom...</option>
            </select>
            {customNumber && (
              <>
                <div style={{ marginTop: '0.5rem' }}>
                  <input
                    ref={customInputRef}
                    type="number"
                    min="5"
                    max="100"
                    value={customRaw}
                    onChange={handleCustomChange}
                    onBlur={handleCustomBlur}
                    style={pageStyles.input}
                    placeholder="5-100"
                  />
                </div>
                <div style={pageStyles.helperText}>
                  Enter any number between 5 and 100 (press Enter or click away to apply)
                </div>
              </>
            )}
          </div>

          <div style={pageStyles.rulesBox}>
            <h3 style={pageStyles.rulesTitle}>Exam Rules:</h3>
            <ul style={pageStyles.rulesList}>
              <li style={pageStyles.ruleItem}>✓ Timer starts once you begin</li>
              <li style={pageStyles.ruleItem}>✓ You can review questions anytime</li>
              <li style={pageStyles.ruleItem}>✓ Minimum 50% score required to pass</li>
              <li style={pageStyles.ruleItem}>✓ Submit only when you're done</li>
            </ul>
          </div>

          <button
            onClick={handleStartExam}
            disabled={loading}
            style={pageStyles.button}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.backgroundColor = '#4338ca';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.backgroundColor = '#4f46e5';
            }}
          >
            {loading ? 'Starting Exam...' : 'Start Exam'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamSetup;
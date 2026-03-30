import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Admin = () => {
    // API key state
    const [apiKey, setApiKey] = useState('');
    const [enteredKey, setEnteredKey] = useState('');
    const [questions, setQuestions] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);

    // Single question form state
    const [newQuestion, setNewQuestion] = useState({
        questionText: '',
        options: [{ text: '', isCorrect: false }],
        explanation: '',
        topic: 'research_methodology',
        difficulty: 'medium'
    });

    // Bulk import state
    const [jsonFile, setJsonFile] = useState(null);

    // ---------- Data fetching ----------
    const fetchQuestions = useCallback(async () => {
        if (!apiKey) return;
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/admin/questions', {
                headers: { 'x-api-key': apiKey }
            });
            setQuestions(res.data);
        } catch (err) {
            toast.error('Failed to fetch questions');
        } finally {
            setLoading(false);
        }
    }, [apiKey]);

    const fetchCount = useCallback(async () => {
        if (!apiKey) return;
        try {
            const res = await axios.get('http://localhost:5000/api/admin/questions/count', {
                headers: { 'x-api-key': apiKey }
            });
            setTotalCount(res.data.count);
        } catch (err) {
            console.error('Failed to fetch count:', err);
        }
    }, [apiKey]);

    const refreshData = () => {
        fetchQuestions();
        fetchCount();
    };

    // Load API key when button clicked
    const loadApiKey = () => {
        if (enteredKey.trim()) {
            setApiKey(enteredKey);
        } else {
            toast.error('Please enter an API key');
        }
    };

    // Effect to load data after apiKey is set
    useEffect(() => {
        if (apiKey) {
            refreshData();
        }
    }, [apiKey, fetchQuestions, fetchCount]);

    // ---------- Single Question Handlers ----------
    const addOption = () => {
        setNewQuestion({
            ...newQuestion,
            options: [...newQuestion.options, { text: '', isCorrect: false }]
        });
    };
    const removeOption = (index) => {
        const newOptions = newQuestion.options.filter((_, i) => i !== index);
        setNewQuestion({ ...newQuestion, options: newOptions });
    };
    const updateOption = (index, field, value) => {
        const newOptions = [...newQuestion.options];
        newOptions[index][field] = value;
        setNewQuestion({ ...newQuestion, options: newOptions });
    };
    const handleSubmitSingle = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/admin/questions', newQuestion, {
                headers: { 'x-api-key': apiKey }
            });
            toast.success('Question added!');
            setNewQuestion({
                questionText: '',
                options: [{ text: '', isCorrect: false }],
                explanation: '',
                topic: 'research_methodology',
                difficulty: 'medium'
            });
            refreshData();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to add question');
        } finally {
            setLoading(false);
        }
    };

    // ---------- Delete Handler ----------
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this question?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/questions/${id}`, {
                headers: { 'x-api-key': apiKey }
            });
            toast.success('Question deleted');
            refreshData();
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    // ---------- Edit Handlers ----------
    const startEdit = (q) => {
        setEditingQuestion({ ...q });
    };
    const updateEditField = (field, value) => {
        setEditingQuestion({ ...editingQuestion, [field]: value });
    };
    const updateEditOption = (index, field, value) => {
        const newOptions = [...editingQuestion.options];
        newOptions[index][field] = value;
        setEditingQuestion({ ...editingQuestion, options: newOptions });
    };
    const addEditOption = () => {
        setEditingQuestion({
            ...editingQuestion,
            options: [...editingQuestion.options, { text: '', isCorrect: false }]
        });
    };
    const removeEditOption = (index) => {
        const newOptions = editingQuestion.options.filter((_, i) => i !== index);
        setEditingQuestion({ ...editingQuestion, options: newOptions });
    };
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(`http://localhost:5000/api/admin/questions/${editingQuestion._id}`, editingQuestion, {
                headers: { 'x-api-key': apiKey }
            });
            toast.success('Question updated');
            setEditingQuestion(null);
            refreshData();
        } catch (err) {
            toast.error('Update failed');
        } finally {
            setLoading(false);
        }
    };
    const cancelEdit = () => {
        setEditingQuestion(null);
    };

    // ---------- Bulk Import Handlers ----------
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    let parsed = JSON.parse(ev.target.result);
                    if (parsed.questions && Array.isArray(parsed.questions)) {
                        parsed = parsed.questions;
                    } else if (!Array.isArray(parsed)) {
                        toast.error('JSON must be an array of questions or an object with a "questions" array');
                        setJsonFile(null);
                        return;
                    }
                    setJsonFile(parsed);
                    toast.success(`Loaded ${parsed.length} questions`);
                } catch (err) {
                    toast.error('Invalid JSON file');
                    setJsonFile(null);
                }
            };
            reader.readAsText(file);
        }
    };
    const handleBulkUpload = async () => {
        if (!apiKey) {
            toast.error('Please load the API key first');
            return;
        }
        if (!jsonFile) {
            toast.error('Please select a JSON file');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/admin/questions/bulk', jsonFile, {
                headers: { 'x-api-key': apiKey }
            });
            toast.success(`Added ${response.data.added} questions, skipped ${response.data.skipped}`);
            setJsonFile(null);
            document.getElementById('jsonFileInput').value = '';
            refreshData();
        } catch (err) {
            console.error(err.response?.data);
            toast.error(err.response?.data?.error || 'Bulk upload failed');
        } finally {
            setLoading(false);
        }
    };

    // ---------- Render ----------
    const styles = {
        container: { maxWidth: '1200px', margin: '2rem auto', padding: '1rem' },
        apiRow: { marginBottom: '1rem' },
        apiInput: { marginRight: '0.5rem', padding: '0.5rem', width: '250px' },
        countBox: { backgroundColor: '#e0e7ff', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', fontWeight: 'bold' },
        formGroup: { marginBottom: '1.5rem' },
        label: { display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' },
        input: { width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '1rem' },
        textarea: { width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '1rem', fontFamily: 'inherit' },
        select: { width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', fontSize: '1rem', backgroundColor: 'white' },
        button: { backgroundColor: '#4f46e5', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' },
        questionItem: { border: '1px solid #ccc', margin: '10px 0', padding: '10px', borderRadius: '5px' },
        flexRow: { display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' },
    };

    return (
        <div style={styles.container}>
            <h1>Admin Panel</h1>
            <div style={styles.apiRow}>
                <label htmlFor="apiKeyInput">API Key: </label>
                <input
                    id="apiKeyInput"
                    type="text"
                    value={enteredKey}
                    onChange={(e) => setEnteredKey(e.target.value)}
                    autoComplete="off"
                    style={styles.apiInput}
                />
                <button onClick={loadApiKey} disabled={loading} style={styles.button}>
                    Load
                </button>
            </div>

            {!apiKey && <p>Enter the API key and click "Load" to access admin functions.</p>}

            {apiKey && (
                <>
                    <div style={styles.countBox}>
                        📊 Total questions in database: <strong>{totalCount}</strong>
                    </div>
                    <hr />

                    {/* ========== ADD SINGLE QUESTION ========== */}
                    <h2>Add Single Question</h2>
                    <form onSubmit={handleSubmitSingle}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Question Text:</label>
                            <textarea
                                value={newQuestion.questionText}
                                onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
                                rows="3"
                                style={styles.textarea}
                                required
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Options:</label>
                            {newQuestion.options.map((opt, idx) => (
                                <div key={idx} style={styles.flexRow}>
                                    <input
                                        type="text"
                                        value={opt.text}
                                        onChange={(e) => updateOption(idx, 'text', e.target.value)}
                                        placeholder={`Option ${idx + 1}`}
                                        style={{ flex: 1, padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
                                        required
                                    />
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={opt.isCorrect}
                                            onChange={(e) => updateOption(idx, 'isCorrect', e.target.checked)}
                                        /> Correct
                                    </label>
                                    {newQuestion.options.length > 2 && (
                                        <button type="button" onClick={() => removeOption(idx)}>✖</button>
                                    )}
                                </div>
                            ))}
                            <button type="button" onClick={addOption} style={styles.button}>+ Add Option</button>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Explanation:</label>
                            <textarea
                                value={newQuestion.explanation}
                                onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                                rows="2"
                                style={styles.textarea}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Topic:</label>
                            <select
                                value={newQuestion.topic}
                                onChange={(e) => setNewQuestion({ ...newQuestion, topic: e.target.value })}
                                style={styles.select}
                            >
                                <option value="research_methodology">Research Methodology</option>
                                <option value="biostatistics">Biostatistics</option>
                                <option value="epidemiology">Epidemiology</option>
                                <option value="ethics">Ethics</option>
                                <option value="literature_review">Literature Review</option>
                            </select>
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Difficulty:</label>
                            <select
                                value={newQuestion.difficulty}
                                onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                                style={styles.select}
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                        <button type="submit" disabled={loading} style={styles.button}>
                            Add Question
                        </button>
                    </form>

                    <hr />

                    {/* ========== BULK IMPORT ========== */}
                    <h2>Bulk Import from JSON</h2>
                    <p>Upload a JSON file containing an array of question objects (same structure as single question).</p>
                    <input
                        type="file"
                        id="jsonFileInput"
                        accept=".json"
                        onChange={handleFileChange}
                        disabled={loading}
                    />
                    {jsonFile && (
                        <div>
                            <p>File loaded: {jsonFile.length} questions found.</p>
                            <button onClick={handleBulkUpload} disabled={loading} style={styles.button}>
                                Import {jsonFile.length} questions
                            </button>
                        </div>
                    )}

                    <hr />

                    {/* ========== MANAGE QUESTIONS ========== */}
                    <h2>Manage Questions</h2>
                    {loading && <p>Loading...</p>}
                    {!loading && questions.length === 0 && <p>No questions found.</p>}
                    {questions.map((q) => (
                        <div key={q._id} style={styles.questionItem}>
                            <div><strong>{q.questionText}</strong></div>
                            <div>Topic: {q.topic} | Difficulty: {q.difficulty}</div>
                            <div>
                                <button onClick={() => startEdit(q)} style={{ marginRight: '10px' }}>Edit</button>
                                <button onClick={() => handleDelete(q._id)} style={{ backgroundColor: '#f44336', color: 'white' }}>Delete</button>
                            </div>
                        </div>
                    ))}
                </>
            )}

            {/* ========== EDIT MODAL ========== */}
            {editingQuestion && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', maxWidth: '800px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2>Edit Question</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Question Text:</label>
                                <textarea
                                    value={editingQuestion.questionText}
                                    onChange={(e) => updateEditField('questionText', e.target.value)}
                                    rows="3"
                                    style={styles.textarea}
                                    required
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Options:</label>
                                {editingQuestion.options.map((opt, idx) => (
                                    <div key={idx} style={styles.flexRow}>
                                        <input
                                            type="text"
                                            value={opt.text}
                                            onChange={(e) => updateEditOption(idx, 'text', e.target.value)}
                                            placeholder={`Option ${idx + 1}`}
                                            style={{ flex: 1, padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
                                            required
                                        />
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={opt.isCorrect}
                                                onChange={(e) => updateEditOption(idx, 'isCorrect', e.target.checked)}
                                            /> Correct
                                        </label>
                                        {editingQuestion.options.length > 2 && (
                                            <button type="button" onClick={() => removeEditOption(idx)}>✖</button>
                                        )}
                                    </div>
                                ))}
                                <button type="button" onClick={addEditOption} style={styles.button}>+ Add Option</button>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Explanation:</label>
                                <textarea
                                    value={editingQuestion.explanation}
                                    onChange={(e) => updateEditField('explanation', e.target.value)}
                                    rows="2"
                                    style={styles.textarea}
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Topic:</label>
                                <select
                                    value={editingQuestion.topic}
                                    onChange={(e) => updateEditField('topic', e.target.value)}
                                    style={styles.select}
                                >
                                    <option value="research_methodology">Research Methodology</option>
                                    <option value="biostatistics">Biostatistics</option>
                                    <option value="epidemiology">Epidemiology</option>
                                    <option value="ethics">Ethics</option>
                                    <option value="literature_review">Literature Review</option>
                                </select>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Difficulty:</label>
                                <select
                                    value={editingQuestion.difficulty}
                                    onChange={(e) => updateEditField('difficulty', e.target.value)}
                                    style={styles.select}
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                            <div>
                                <button type="submit" disabled={loading} style={styles.button}>Update</button>
                                <button type="button" onClick={cancelEdit} style={{ marginLeft: '10px', backgroundColor: '#9ca3af' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
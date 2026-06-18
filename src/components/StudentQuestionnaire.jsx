import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import './TutoringForm.css';

export const StudentQuestionnaire = () => {
    const [questionnaires, setQuestionnaires] = useState([]);
    const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
    const [answers, setAnswers] = useState({});
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadQuestionnaires();
    }, []);

    const loadQuestionnaires = async () => {
        setLoading(true);
        try {
            const data = await api.getQuestionnaires();
            setQuestionnaires(data);
        } catch (error) {
            console.error('Error loading questionnaires:', error);
            alert('Error loading questionnaires');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            await api.submitQuestionnaire({
                questionnaire_id: selectedQuestionnaire.id,
                answers: answers
            });
            setStatus('success');
            setSelectedQuestionnaire(null);
            setAnswers({});
            alert('Questionnaire submitted successfully');
            setTimeout(() => setStatus(null), 3000);
        } catch (error) {
            setStatus('error');
            console.error('Error submitting questionnaire:', error);
            alert('Error submitting questionnaire');
        }
    };

    return (
        <div className="glass-panel" style={{ maxWidth: '800px' }}>
            <div className="form-header">
                <h1>📋 Student Questionnaire</h1>
                <p>Complete your tutoring evaluation and feedback</p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#94A3B8' }}>
                    ⏳ Loading questionnaires...
                </div>
            ) : !selectedQuestionnaire ? (
                <div>
                    <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>📚 Available Questionnaires</h3>
                    {questionnaires.length === 0 ? (
                        <p style={{ color: '#94A3B8', textAlign: 'center' }}>
                            No questionnaires available at this time.
                        </p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {questionnaires.map(q => (
                                <div key={q.id} style={{
                                    background: 'rgba(15, 23, 42, 0.4)',
                                    border: '1px solid var(--border-color)',
                                    padding: '1.5rem',
                                    borderRadius: '12px'
                                }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        gap: '1rem'
                                    }}>
                                        <div>
                                            <h4 style={{ color: 'white', marginBottom: '0.25rem' }}>{q.title}</h4>
                                            <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>{q.description}</p>
                                            <p style={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                                                📝 {q.questions?.length || 0} questions
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => setSelectedQuestionnaire(q)}
                                            style={{
                                                padding: '0.5rem 1.5rem',
                                                background: '#4F46E5',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontWeight: '600'
                                            }}
                                        >
                                            Start →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '2rem',
                        paddingBottom: '1rem',
                        borderBottom: '1px solid var(--border-color)'
                    }}>
                        <div>
                            <h3 style={{ color: 'white' }}>{selectedQuestionnaire.title}</h3>
                            <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>{selectedQuestionnaire.description}</p>
                        </div>
                        <button 
                            type="button"
                            onClick={() => {
                                if (confirm('Are you sure? Your answers will be lost.')) {
                                    setSelectedQuestionnaire(null);
                                    setAnswers({});
                                }
                            }}
                            style={{
                                padding: '0.5rem 1rem',
                                background: 'rgba(248, 113, 113, 0.2)',
                                color: '#F87171',
                                border: '1px solid rgba(248, 113, 113, 0.3)',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            ✕ Exit
                        </button>
                    </div>

                    {selectedQuestionnaire.questions && selectedQuestionnaire.questions.map((q, index) => (
                        <div key={q.id} className="form-group" style={{
                            background: 'rgba(15, 23, 42, 0.3)',
                            padding: '1rem',
                            borderRadius: '12px',
                            marginBottom: '1rem'
                        }}>
                            <label className="form-label" style={{ fontSize: '1rem', color: 'white' }}>
                                {index + 1}. {q.statement}
                                {q.required && <span style={{ color: '#F87171', marginLeft: '4px' }}>*</span>}
                            </label>

                            {q.question_type === 'rating' && (
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button 
                                            key={star}
                                            type="button"
                                            onClick={() => handleAnswer(q.id, star)}
                                            style={{
                                                fontSize: '2rem',
                                                padding: '0.25rem 0.5rem',
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: answers[q.id] >= star ? '#FBBF24' : '#475569'
                                            }}
                                        >
                                            ★
                                        </button>
                                    ))}
                                    <span style={{ color: '#94A3B8', marginLeft: '0.5rem' }}>
                                        {answers[q.id] ? `${answers[q.id]}/5` : 'Select rating'}
                                    </span>
                                </div>
                            )}

                            {q.question_type === 'text' && (
                                <textarea 
                                    className="form-control"
                                    value={answers[q.id] || ''}
                                    onChange={e => handleAnswer(q.id, e.target.value)}
                                    placeholder="Write your answer..."
                                    rows="3"
                                    style={{ marginTop: '0.5rem' }}
                                />
                            )}

                            {q.question_type === 'multiple_choice' && (
                                <select 
                                    className="form-control"
                                    value={answers[q.id] || ''}
                                    onChange={e => handleAnswer(q.id, e.target.value)}
                                    style={{ marginTop: '0.5rem' }}
                                >
                                    <option value="">Select an option...</option>
                                    {q.options && q.options.map(opt => (
                                        <option key={opt.id} value={opt.id}>{opt.text}</option>
                                    ))}
                                </select>
                            )}

                            {q.question_type === 'boolean' && (
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                    <button 
                                        type="button"
                                        onClick={() => handleAnswer(q.id, true)}
                                        style={{
                                            padding: '0.5rem 1.5rem',
                                            borderRadius: '8px',
                                            border: answers[q.id] === true ? '2px solid #34D399' : '1px solid var(--border-color)',
                                            background: answers[q.id] === true ? 'rgba(52, 211, 153, 0.2)' : 'transparent',
                                            color: 'white',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        ✅ Yes
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => handleAnswer(q.id, false)}
                                        style={{
                                            padding: '0.5rem 1.5rem',
                                            borderRadius: '8px',
                                            border: answers[q.id] === false ? '2px solid #F87171' : '1px solid var(--border-color)',
                                            background: answers[q.id] === false ? 'rgba(248, 113, 113, 0.2)' : 'transparent',
                                            color: 'white',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        ❌ No
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}

                    <button type="submit" className="btn-primary" disabled={status === 'submitting'}>
                        {status === 'submitting' ? 'Submitting...' : 'Submit Answers'}
                    </button>

                    {status === 'success' && (
                        <p style={{ color: '#4ADE80', marginTop: '1rem', textAlign: 'center' }}>
                            ✅ Questionnaire submitted successfully!
                        </p>
                    )}
                    {status === 'error' && (
                        <p style={{ color: '#F87171', marginTop: '1rem', textAlign: 'center' }}>
                            ❌ Error submitting questionnaire
                        </p>
                    )}
                </form>
            )}
        </div>
    );
};
import React, { useState } from 'react';
import { api } from '../services/api';
import './TutoringForm.css';

export const StudentProgress = () => {
    const [studentId, setStudentId] = useState('');
    const [progress, setProgress] = useState(null);
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!studentId) {
            alert('Please enter a student ID');
            return;
        }
        setLoading(true);
        setStatus('loading');
        try {
            const data = await api.getStudentProgress(studentId);
            setProgress(data);
            setStatus('success');
        } catch (error) {
            setStatus('error');
            console.error('Error fetching progress:', error);
            alert('Error fetching student progress');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel" style={{ maxWidth: '800px' }}>
            <div className="form-header">
                <h1>📊 Student Grades & Progress</h1>
                <p>Track academic performance and tutoring progress</p>
            </div>

            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <input 
                    type="number" 
                    className="form-control" 
                    placeholder="Enter student ID..." 
                    value={studentId} 
                    onChange={e => setStudentId(e.target.value)} 
                    required 
                    style={{ flex: 1 }}
                />
                <button type="submit" className="btn-primary" style={{ marginTop: 0, width: 'auto', padding: '0.875rem 2rem' }}>
                    {loading ? '🔍 Searching...' : '🔍 Search'}
                </button>
            </form>

            {status === 'error' && (
                <div style={{ 
                    background: 'rgba(248, 113, 113, 0.1)', 
                    border: '1px solid #F87171',
                    padding: '1rem',
                    borderRadius: '8px',
                    color: '#F87171',
                    textAlign: 'center'
                }}>
                    ❌ Error loading progress
                </div>
            )}

            {progress && (
                <div>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '1rem',
                        marginBottom: '2rem'
                    }}>
                        <div style={{
                            background: 'rgba(79, 70, 229, 0.1)',
                            border: '1px solid rgba(79, 70, 229, 0.2)',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            textAlign: 'center'
                        }}>
                            <p style={{ color: '#94A3B8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Average Grade</p>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#818CF8' }}>
                                {progress.average_grade || 'N/A'}
                            </p>
                        </div>
                        <div style={{
                            background: 'rgba(52, 211, 153, 0.1)',
                            border: '1px solid rgba(52, 211, 153, 0.2)',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            textAlign: 'center'
                        }}>
                            <p style={{ color: '#94A3B8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Completed Sessions</p>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#34D399' }}>
                                {progress.total_sessions || 0}
                            </p>
                        </div>
                        <div style={{
                            background: 'rgba(251, 191, 36, 0.1)',
                            border: '1px solid rgba(251, 191, 36, 0.2)',
                            padding: '1.5rem',
                            borderRadius: '12px',
                            textAlign: 'center'
                        }}>
                            <p style={{ color: '#94A3B8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Pending Sessions</p>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FBBF24' }}>
                                {progress.pending_sessions || 0}
                            </p>
                        </div>
                    </div>

                    <h3 style={{ marginBottom: '1rem', color: 'white' }}>📚 Progress by Subject</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {progress.subjects && progress.subjects.map(subject => (
                            <div key={subject.id} style={{
                                background: 'rgba(15, 23, 42, 0.4)',
                                border: '1px solid var(--border-color)',
                                padding: '1rem',
                                borderRadius: '12px'
                            }}>
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    marginBottom: '0.5rem'
                                }}>
                                    <span style={{ color: 'white', fontWeight: '500' }}>{subject.name}</span>
                                    <span style={{ color: '#818CF8', fontWeight: 'bold' }}>
                                        {subject.grade || 'Not graded'}
                                    </span>
                                </div>
                                <div style={{
                                    width: '100%',
                                    height: '8px',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '4px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${subject.percentage || 0}%`,
                                        height: '100%',
                                        background: 'linear-gradient(90deg, #4F46E5, #818CF8)',
                                        borderRadius: '4px',
                                        transition: 'width 0.8s ease'
                                    }} />
                                </div>
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    marginTop: '0.25rem',
                                    fontSize: '0.75rem',
                                    color: '#94A3B8'
                                }}>
                                    <span>{subject.sessions_completed || 0} sessions</span>
                                    <span>{subject.percentage || 0}% completed</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
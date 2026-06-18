import React, { useState } from 'react';
import { api } from '../services/api';
import './TutoringForm.css';

export const StudentHistory = () => {
    const [studentId, setStudentId] = useState('');
    const [history, setHistory] = useState([]);
    const [status, setStatus] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!studentId) return;
        setStatus('loading');
        try {
            const data = await api.getStudentHistory(studentId);
            setHistory(data);
            setStatus(data.length === 0 ? 'empty' : 'success');
        } catch (error) {
            setStatus('error');
            console.error(error);
        }
    };

    return (
        <div className="glass-panel" style={{ maxWidth: '800px' }}>
            <div className="form-header">
                <h1>Student Tutoring History</h1>
                <p>Review past sessions for a specific student</p>
            </div>

            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <input 
                    type="number" 
                    className="form-control" 
                    placeholder="Enter Student ID..." 
                    value={studentId} 
                    onChange={e => setStudentId(e.target.value)} 
                    required 
                />
                <button type="submit" className="btn-primary" style={{ marginTop: 0, width: 'auto', padding: '0.875rem 2rem' }}>
                    {status === 'loading' ? 'Searching...' : 'Search'}
                </button>
            </form>

            {status === 'error' && <p style={{ color: '#F87171' }}>Failed to load history.</p>}
            {status === 'empty' && <p style={{ color: '#94A3B8' }}>No past tutoring sessions found for this student.</p>}

            {status === 'success' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {history.map(session => (
                        <div key={session.id} style={{ 
                            background: 'rgba(15, 23, 42, 0.4)', 
                            border: '1px solid var(--border-color)', 
                            padding: '1.5rem', 
                            borderRadius: '12px' 
                        }}>
                            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>
                                Session #{session.id} — {session.date}
                            </h3>
                            <p style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                Time: {session.start_time} - {session.end_time} | Status: <span style={{color: '#818CF8'}}>{session.status}</span>
                            </p>
                            {/* Ideally here we would also fetch and display the SessionRecord and Attendance if needed, 
                                but the prompt just says "historial de tutorias" so we list the sessions. */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

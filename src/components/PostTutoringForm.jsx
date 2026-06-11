import React, { useState } from 'react';
import { api } from '../services/api';
import './TutoringForm.css';

export const PostTutoringForm = () => {
    const [formData, setFormData] = useState({
        session_id: '',
        student_id: '',
        grade: '',
        topics_covered: '',
        observations: '',
        attended: true
    });
    const [status, setStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            // 1. Submit Session Record
            await api.postSessionRecord({
                session: formData.session_id,
                grade: formData.grade || null,
                topics_covered: formData.topics_covered,
                observations: formData.observations
            });
            // 2. Submit Attendance
            await api.postAttendance({
                session: formData.session_id,
                user: formData.student_id,
                attended: formData.attended,
                observation: formData.observations
            });
            setStatus('success');
            setFormData({ session_id: '', student_id: '', grade: '', topics_covered: '', observations: '', attended: true });
            setTimeout(() => setStatus(null), 3000);
        } catch (error) {
            setStatus('error');
            console.error(error);
        }
    };

    return (
        <div className="glass-panel">
            <div className="form-header">
                <h1>Post-Tutoring Evaluation</h1>
                <p>Register the outcome and student attendance for a finished session</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Session ID</label>
                        <input type="number" name="session_id" className="form-control" value={formData.session_id} onChange={handleChange} required placeholder="E.g. 1" />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Student ID</label>
                        <input type="number" name="student_id" className="form-control" value={formData.student_id} onChange={handleChange} required placeholder="E.g. 5" />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">
                        <input type="checkbox" name="attended" checked={formData.attended} onChange={handleChange} style={{ marginRight: '0.5rem' }} />
                        Student Attended the Session
                    </label>
                </div>

                <div className="form-group">
                    <label className="form-label">Topics Covered</label>
                    <textarea name="topics_covered" className="form-control" value={formData.topics_covered} onChange={handleChange} required rows="3" placeholder="What did you teach today?"></textarea>
                </div>

                <div className="form-group">
                    <label className="form-label">Observations / Feedback</label>
                    <textarea name="observations" className="form-control" value={formData.observations} onChange={handleChange} rows="2" placeholder="Any additional notes..."></textarea>
                </div>

                <div className="form-group">
                    <label className="form-label">Grade (Optional)</label>
                    <input type="number" step="0.1" name="grade" className="form-control" value={formData.grade} onChange={handleChange} placeholder="0.0 - 5.0" />
                </div>

                <button type="submit" className="btn-primary" disabled={status === 'submitting'}>
                    {status === 'submitting' ? 'Saving...' : 'Submit Evaluation'}
                </button>

                {status === 'success' && <p style={{ color: '#4ADE80', marginTop: '1rem', textAlign: 'center' }}>Evaluation saved successfully!</p>}
                {status === 'error' && <p style={{ color: '#F87171', marginTop: '1rem', textAlign: 'center' }}>Error saving evaluation.</p>}
            </form>
        </div>
    );
};

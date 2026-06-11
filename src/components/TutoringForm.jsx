import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import './TutoringForm.css';

export const TutoringForm = () => {
    const [tutors, setTutors] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [availability, setAvailability] = useState([]);
    
    const [formData, setFormData] = useState({
        subject_id: '',
        tutor_id: '',
        date: '',
        start_time: '',
        end_time: ''
    });

    const [status, setStatus] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [tutorsData, subjectsData, availData] = await Promise.all([
                    api.getTutors(),
                    api.getSubjects(),
                    api.getAvailability()
                ]);
                setTutors(tutorsData);
                setSubjects(subjectsData);
                setAvailability(availData);
            } catch (error) {
                console.error("Error loading form data", error);
            }
        };
        loadData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            await api.scheduleSession(formData);
            setStatus('success');
            setFormData({ tutor_id: '', subject_id: '', date: '', start_time: '', end_time: '' });
            setTimeout(() => setStatus(null), 3000);
        } catch (error) {
            setStatus('error');
            console.error(error);
        }
    };

    return (
        <div className="glass-panel">
            <div className="form-header">
                <h1>Schedule Tutoring</h1>
                <p>Book a personalized session with our expert tutors</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Subject</label>
                    <select 
                        name="subject_id" 
                        className="form-control" 
                        value={formData.subject_id} 
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a subject...</option>
                        {subjects && subjects.map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Tutor</label>
                    <select 
                        name="tutor_id" 
                        className="form-control" 
                        value={formData.tutor_id} 
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a tutor...</option>
                        {tutors && tutors.map(t => (
                            <option key={t.id} value={t.id}>{t.nombre} {t.apellido}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Date</label>
                    <input 
                        type="date" 
                        name="date" 
                        className="form-control" 
                        value={formData.date} 
                        onChange={handleChange}
                        required
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Start Time</label>
                        <input 
                            type="time" 
                            name="start_time" 
                            className="form-control" 
                            value={formData.start_time} 
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">End Time</label>
                        <input 
                            type="time" 
                            name="end_time" 
                            className="form-control" 
                            value={formData.end_time} 
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={status === 'submitting'}
                >
                    {status === 'submitting' ? 'Scheduling...' : 'Confirm Session'}
                </button>

                {status === 'success' && (
                    <p style={{ color: '#4ADE80', marginTop: '1rem', textAlign: 'center' }}>
                        Session scheduled successfully!
                    </p>
                )}
                {status === 'error' && (
                    <p style={{ color: '#F87171', marginTop: '1rem', textAlign: 'center' }}>
                        Failed to schedule. Please verify availability.
                    </p>
                )}
            </form>
        </div>
    );
};

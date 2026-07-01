import React, { useState } from 'react';
import { api } from '../services/api';
import './TutoringForm.css';

export const TutorSchedule = () => {
    const [tutorId, setTutorId] = useState('');
    const [schedule, setSchedule] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [newSlot, setNewSlot] = useState({ start: '', end: '', maxCapacity: 5 });
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(null);
    const [editSlot, setEditSlot] = useState({ start: '', end: '', maxCapacity: 5 });

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const loadSchedule = async () => {
        if (!tutorId) {
            alert('Please enter a tutor ID');
            return;
        }
        setLoading(true);
        try {
            const data = await api.getTutorSchedule(tutorId);
            setSchedule(data);
        } catch (error) {
            console.error('Error loading schedule:', error);
            alert('Error loading tutor schedule');
        } finally {
            setLoading(false);
        }
    };

    const addTimeSlot = async (day) => {
        if (!newSlot.start || !newSlot.end) {
            alert('Please select start and end time');
            return;
        }
        try {
            await api.addTutorAvailability({
                tutor_id: parseInt(tutorId),
                day_of_week: day,
                start_time: newSlot.start,
                end_time: newSlot.end,
                max_capacity: newSlot.maxCapacity
            });
            await loadSchedule();
            setNewSlot({ start: '', end: '', maxCapacity: 5 });
            setSelectedDay(null);
            alert('Schedule added successfully');
        } catch (error) {
            console.error('Error adding schedule:', error);
            alert('Error adding schedule');
        }
    };

    const deleteTimeSlot = async (slotId) => {
        if (!confirm('Are you sure you want to delete this schedule?')) return;
        try {
            await api.deleteTutorAvailability(slotId);
            await loadSchedule();
            alert('Schedule deleted successfully');
        } catch (error) {
            console.error('Error deleting schedule:', error);
            alert('Error deleting schedule');
        }
    };

    const startEdit = (slot) => {
        setEditMode(slot.id);
        setEditSlot({
            start: slot.start_time,
            end: slot.end_time,
            maxCapacity: slot.max_capacity || 5
        });
    };

    const cancelEdit = () => {
        setEditMode(null);
        setEditSlot({ start: '', end: '', maxCapacity: 5 });
    };

    const saveEdit = async (slotId) => {
        if (!editSlot.start || !editSlot.end) {
            alert('Please select start and end time');
            return;
        }
        try {
            await api.updateTutorAvailability(slotId, {
                start_time: editSlot.start,
                end_time: editSlot.end,
                max_capacity: editSlot.maxCapacity
            });
            await loadSchedule();
            cancelEdit();
            alert('Schedule updated successfully');
        } catch (error) {
            console.error('Error updating schedule:', error);
            alert('Error updating schedule');
        }
    };

    return (
        <div className="glass-panel" style={{ maxWidth: '1000px' }}>
            <div className="form-header">
                <h1>📅 Tutor Schedule Management</h1>
                <p>Manage your availability as a tutor</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                    <label className="form-label">Tutor ID</label>
                    <input 
                        type="number"
                        className="form-control"
                        placeholder="Enter tutor ID..."
                        value={tutorId}
                        onChange={e => setTutorId(e.target.value)}
                    />
                </div>
                <button 
                    onClick={loadSchedule} 
                    className="btn-primary" 
                    style={{ width: 'auto', padding: '0.875rem 2rem' }}
                    disabled={loading}
                >
                    {loading ? '⏳ Loading...' : '📋 Load Schedule'}
                </button>
            </div>

            {schedule.length === 0 && tutorId && !loading && (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '3rem',
                    color: '#94A3B8',
                    background: 'rgba(15, 23, 42, 0.3)',
                    borderRadius: '12px',
                    marginBottom: '2rem'
                }}>
                    <p style={{ fontSize: '1.2rem' }}>📭 No schedule configured for this tutor</p>
                </div>
            )}

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
            }}>
                {days.map((day, index) => {
                    const daySchedule = schedule.filter(s => s.day_of_week === index + 1);
                    return (
                        <div key={day} style={{
                            background: 'rgba(15, 23, 42, 0.4)',
                            border: '1px solid var(--border-color)',
                            padding: '1rem',
                            borderRadius: '12px',
                            minHeight: '200px'
                        }}>
                            <h4 style={{ 
                                color: 'white', 
                                marginBottom: '0.75rem', 
                                textAlign: 'center',
                                paddingBottom: '0.5rem',
                                borderBottom: '1px solid var(--border-color)'
                            }}>
                                {day}
                                <span style={{ 
                                    display: 'block', 
                                    fontSize: '0.75rem', 
                                    color: '#94A3B8',
                                    fontWeight: 'normal',
                                    marginTop: '0.25rem'
                                }}>
                                    {daySchedule.length} slots
                                </span>
                            </h4>

                            {daySchedule.map(slot => (
                                <div key={slot.id} style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    padding: '0.5rem',
                                    borderRadius: '8px',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.85rem'
                                }}>
                                    {editMode === slot.id ? (
                                        <div>
                                            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.25rem' }}>
                                                <input 
                                                    type="time"
                                                    value={editSlot.start}
                                                    onChange={e => setEditSlot({...editSlot, start: e.target.value})}
                                                    style={{
                                                        flex: 1,
                                                        background: 'rgba(15, 23, 42, 0.6)',
                                                        border: '1px solid var(--border-color)',
                                                        color: 'white',
                                                        borderRadius: '4px',
                                                        padding: '0.25rem',
                                                        fontSize: '0.8rem'
                                                    }}
                                                />
                                                <input 
                                                    type="time"
                                                    value={editSlot.end}
                                                    onChange={e => setEditSlot({...editSlot, end: e.target.value})}
                                                    style={{
                                                        flex: 1,
                                                        background: 'rgba(15, 23, 42, 0.6)',
                                                        border: '1px solid var(--border-color)',
                                                        color: 'white',
                                                        borderRadius: '4px',
                                                        padding: '0.25rem',
                                                        fontSize: '0.8rem'
                                                    }}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.25rem' }}>
                                                <input 
                                                    type="number"
                                                    value={editSlot.maxCapacity}
                                                    onChange={e => setEditSlot({...editSlot, maxCapacity: parseInt(e.target.value)})}
                                                    min="1"
                                                    style={{
                                                        flex: 1,
                                                        background: 'rgba(15, 23, 42, 0.6)',
                                                        border: '1px solid var(--border-color)',
                                                        color: 'white',
                                                        borderRadius: '4px',
                                                        padding: '0.25rem',
                                                        fontSize: '0.8rem'
                                                    }}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                <button 
                                                    onClick={() => saveEdit(slot.id)}
                                                    style={{
                                                        flex: 1,
                                                        background: 'rgba(52, 211, 153, 0.3)',
                                                        color: '#34D399',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        padding: '0.25rem',
                                                        cursor: 'pointer',
                                                        fontSize: '0.7rem'
                                                    }}
                                                >
                                                    💾 Save
                                                </button>
                                                <button 
                                                    onClick={cancelEdit}
                                                    style={{
                                                        flex: 1,
                                                        background: 'rgba(248, 113, 113, 0.2)',
                                                        color: '#F87171',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        padding: '0.25rem',
                                                        cursor: 'pointer',
                                                        fontSize: '0.7rem'
                                                    }}
                                                >
                                                    ❌ Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <div style={{ color: '#94A3B8' }}>
                                                        🕐 {slot.start_time} - {slot.end_time}
                                                    </div>
                                                    <div style={{ color: '#818CF8', fontSize: '0.75rem' }}>
                                                        👥 {slot.available_slots || 0}/{slot.max_capacity || 5}
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                    <button 
                                                        onClick={() => startEdit(slot)}
                                                        style={{
                                                            background: 'rgba(251, 191, 36, 0.2)',
                                                            color: '#FBBF24',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            padding: '0.25rem 0.5rem',
                                                            cursor: 'pointer',
                                                            fontSize: '0.7rem'
                                                        }}
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button 
                                                        onClick={() => deleteTimeSlot(slot.id)}
                                                        style={{
                                                            background: 'rgba(248, 113, 113, 0.2)',
                                                            color: '#F87171',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            padding: '0.25rem 0.5rem',
                                                            cursor: 'pointer',
                                                            fontSize: '0.7rem'
                                                        }}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            <button 
                                onClick={() => setSelectedDay(index + 1)}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    background: 'rgba(79, 70, 229, 0.2)',
                                    color: '#818CF8',
                                    border: '1px dashed rgba(79, 70, 229, 0.3)',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    marginTop: '0.5rem',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                + Add Slot
                            </button>
                        </div>
                    );
                })}
            </div>

            {selectedDay && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }}>
                    <div style={{
                        background: 'var(--bg-card)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '24px',
                        padding: '2rem',
                        maxWidth: '400px',
                        width: '100%'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ color: 'white' }}>
                                ➕ Add Schedule - {days[selectedDay - 1]}
                            </h3>
                            <button 
                                onClick={() => setSelectedDay(null)}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    color: '#94A3B8',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '30px',
                                    height: '30px',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem'
                                }}
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">🕐 Start Time</label>
                            <input 
                                type="time"
                                className="form-control"
                                value={newSlot.start}
                                onChange={e => setNewSlot({...newSlot, start: e.target.value})}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">🕐 End Time</label>
                            <input 
                                type="time"
                                className="form-control"
                                value={newSlot.end}
                                onChange={e => setNewSlot({...newSlot, end: e.target.value})}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">👥 Max Capacity</label>
                            <input 
                                type="number"
                                className="form-control"
                                placeholder="Number of students"
                                value={newSlot.maxCapacity}
                                onChange={e => setNewSlot({...newSlot, maxCapacity: parseInt(e.target.value)})}
                                min="1"
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button 
                                onClick={() => addTimeSlot(selectedDay)}
                                className="btn-primary"
                                style={{ flex: 1 }}
                            >
                                💾 Save
                            </button>
                            <button 
                                onClick={() => setSelectedDay(null)}
                                style={{
                                    padding: '1rem',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    color: '#94A3B8',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    flex: 0.5
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
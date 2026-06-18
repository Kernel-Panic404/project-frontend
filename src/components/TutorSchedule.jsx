import React, { useState } from 'react';
import { api } from '../services/api';
import './TutoringForm.css';

export const TutorSchedule = () => {
    const [tutorId, setTutorId] = useState('');
    const [schedule, setSchedule] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [newSlot, setNewSlot] = useState({ start: '', end: '', max_capacity: 5 });
    const [loading, setLoading] = useState(false);

    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    const loadSchedule = async () => {
        if (!tutorId) return;
        setLoading(true);
        try {
            const data = await api.getTutorSchedule(tutorId);
            setSchedule(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const addTimeSlot = async (day) => {
        try {
            await api.addTutorAvailability({
                tutor_id: tutorId,
                dia_semana: day,
                hora_inicio: newSlot.start,
                hora_fin: newSlot.end,
                cupo_maximo: newSlot.max_capacity
            });
            await loadSchedule();
            setNewSlot({ start: '', end: '', max_capacity: 5 });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deleteTimeSlot = async (slotId) => {
        if (!confirm('¿Eliminar este horario?')) return;
        try {
            await api.deleteTutorAvailability(slotId);
            await loadSchedule();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="glass-panel" style={{ maxWidth: '900px' }}>
            <div className="form-header">
                <h1>📅 Gestión de Horarios</h1>
                <p>Administra tu disponibilidad como tutor</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <input 
                    type="number"
                    className="form-control"
                    placeholder="ID del Tutor..."
                    value={tutorId}
                    onChange={e => setTutorId(e.target.value)}
                    style={{ flex: 1 }}
                />
                <button onClick={loadSchedule} className="btn-primary" style={{ marginTop: 0, width: 'auto', padding: '0.875rem 2rem' }}>
                    {loading ? '⏳ Cargando...' : '📋 Cargar Horarios'}
                </button>
            </div>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
            }}>
                {days.map((day, index) => {
                    const daySchedule = schedule.filter(s => s.dia_semana === index + 1);
                    return (
                        <div key={day} style={{
                            background: 'rgba(15, 23, 42, 0.4)',
                            border: '1px solid var(--border-color)',
                            padding: '1rem',
                            borderRadius: '12px',
                            minHeight: '200px'
                        }}>
                            <h4 style={{ color: 'white', marginBottom: '0.5rem', textAlign: 'center' }}>{day}</h4>
                            {daySchedule.map(slot => (
                                <div key={slot.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    padding: '0.5rem',
                                    borderRadius: '8px',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.85rem'
                                }}>
                                    <div>
                                        <div style={{ color: '#94A3B8' }}>
                                            🕐 {slot.hora_inicio} - {slot.hora_fin}
                                        </div>
                                        <div style={{ color: '#818CF8', fontSize: '0.75rem' }}>
                                            👥 {slot.cupos_disponibles}/{slot.cupo_maximo}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => deleteTimeSlot(slot.id)}
                                        style={{
                                            background: 'rgba(248, 113, 113, 0.2)',
                                            color: '#F87171',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '0.25rem 0.5rem',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem'
                                        }}
                                    >
                                        ✕
                                    </button>
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
                                onMouseOver={(e) => e.target.style.background = 'rgba(79, 70, 229, 0.4)'}
                                onMouseOut={(e) => e.target.style.background = 'rgba(79, 70, 229, 0.2)'}
                            >
                                + Agregar
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
                        <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>
                            ➕ Agregar Horario - {days[selectedDay - 1]}
                        </h3>
                        
                        <div className="form-group">
                            <label className="form-label">🕐 Hora Inicio</label>
                            <input 
                                type="time"
                                className="form-control"
                                value={newSlot.start}
                                onChange={e => setNewSlot({...newSlot, start: e.target.value})}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">🕐 Hora Fin</label>
                            <input 
                                type="time"
                                className="form-control"
                                value={newSlot.end}
                                onChange={e => setNewSlot({...newSlot, end: e.target.value})}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">👥 Cupo Máximo</label>
                            <input 
                                type="number"
                                className="form-control"
                                placeholder="Número de estudiantes"
                                value={newSlot.max_capacity}
                                onChange={e => setNewSlot({...newSlot, max_capacity: parseInt(e.target.value)})}
                                min="1"
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button 
                                onClick={() => addTimeSlot(selectedDay)}
                                className="btn-primary"
                                style={{ flex: 1 }}
                            >
                                💾 Guardar
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
                                ❌ Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
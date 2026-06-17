// src/components/StudentHistory.jsx
import React, { useState } from 'react';
import { api } from '../services/api';
import './TutoringForm.css';

export const StudentHistory = () => {
    const [studentId, setStudentId] = useState('');
    const [history, setHistory] = useState([]);
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Estado para el modal de reprogramar
    const [rescheduleModal, setRescheduleModal] = useState({
        isOpen: false,
        sessionId: null,
        newDate: '',
        newStartTime: '',
        newEndTime: ''
    });

    // Buscar historial
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!studentId) return;
        setLoading(true);
        setStatus('loading');
        try {
            const data = await api.getStudentHistory(studentId);
            setHistory(data);
            setStatus(data.length === 0 ? 'empty' : 'success');
        } catch (error) {
            setStatus('error');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Cancelar sesión
    const handleCancel = async (sessionId) => {
        if (!window.confirm('¿Estás seguro de cancelar esta tutoría? Esta acción no se puede deshacer.')) {
            return;
        }
        
        try {
            await api.cancelSession(sessionId);
            // Recargar historial
            await handleSearch(new Event('submit'));
            alert('✅ Tutoría cancelada exitosamente');
        } catch (error) {
            console.error('Error al cancelar:', error);
            alert('❌ Error al cancelar la tutoría');
        }
    };

    // Abrir modal de reprogramar
    const openRescheduleModal = (session) => {
        setRescheduleModal({
            isOpen: true,
            sessionId: session.id,
            newDate: session.date,
            newStartTime: session.start_time,
            newEndTime: session.end_time
        });
    };

    // Cerrar modal
    const closeRescheduleModal = () => {
        setRescheduleModal({
            isOpen: false,
            sessionId: null,
            newDate: '',
            newStartTime: '',
            newEndTime: ''
        });
    };

    // Reprogramar sesión
    const handleReschedule = async (e) => {
        e.preventDefault();
        const { sessionId, newDate, newStartTime, newEndTime } = rescheduleModal;
        
        try {
            await api.rescheduleSession(sessionId, {
                date: newDate,
                start_time: newStartTime,
                end_time: newEndTime
            });
            closeRescheduleModal();
            await handleSearch(new Event('submit'));
            alert('✅ Tutoría reprogramada exitosamente');
        } catch (error) {
            console.error('Error al reprogramar:', error);
            alert('❌ Error al reprogramar la tutoría');
        }
    };

    // Formatear hora
    const formatTime = (time) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    // Formatear fecha
    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Obtener clase de estado
    const getStatusClass = (status) => {
        const classes = {
            'pendiente': 'status-pending',
            'confirmada': 'status-confirmed',
            'realizada': 'status-completed',
            'cancelada': 'status-cancelled'
        };
        return classes[status] || 'status-default';
    };

    // Traducir estado
    const getStatusText = (status) => {
        const texts = {
            'pendiente': '⏳ Pendiente',
            'confirmada': '✅ Confirmada',
            'realizada': '📌 Realizada',
            'cancelada': '❌ Cancelada'
        };
        return texts[status] || status;
    };

    return (
        <div className="glass-panel" style={{ maxWidth: '900px' }}>
            <div className="form-header">
                <h1>📚 Historial de Tutorías</h1>
                <p>Consulta y gestiona las sesiones de un estudiante</p>
            </div>

            {/* Formulario de búsqueda */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <input 
                    type="number" 
                    className="form-control" 
                    placeholder="Ingresa ID del estudiante..." 
                    value={studentId} 
                    onChange={e => setStudentId(e.target.value)} 
                    required 
                    style={{ flex: 1 }}
                />
                <button type="submit" className="btn-primary" style={{ marginTop: 0, width: 'auto', padding: '0.875rem 2rem' }}>
                    {loading ? '🔍 Buscando...' : '🔍 Buscar'}
                </button>
            </form>

            {/* Estados */}
            {status === 'error' && (
                <div style={{ 
                    background: 'rgba(248, 113, 113, 0.1)', 
                    border: '1px solid #F87171',
                    padding: '1rem',
                    borderRadius: '8px',
                    color: '#F87171',
                    textAlign: 'center'
                }}>
                    ❌ Error al cargar el historial. Verifica que el estudiante existe.
                </div>
            )}
            
            {status === 'empty' && (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '3rem 0',
                    color: '#94A3B8'
                }}>
                    <p style={{ fontSize: '1.2rem' }}>📭 No se encontraron tutorías para este estudiante</p>
                </div>
            )}

            {/* Lista de sesiones */}
            {status === 'success' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {history.map(session => (
                        <div key={session.id} style={{ 
                            background: 'rgba(15, 23, 42, 0.4)', 
                            border: '1px solid var(--border-color)', 
                            padding: '1.5rem', 
                            borderRadius: '12px',
                            transition: 'all 0.3s ease'
                        }}>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'flex-start',
                                flexWrap: 'wrap',
                                gap: '0.5rem'
                            }}>
                                <div>
                                    <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>
                                        📖 Sesión #{session.id}
                                    </h3>
                                    <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
                                        📅 {formatDate(session.date)}
                                    </p>
                                    <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
                                        🕐 {formatTime(session.start_time)} - {formatTime(session.end_time)}
                                    </p>
                                    {session.subject && (
                                        <p style={{ color: '#818CF8', fontSize: '0.9rem' }}>
                                            📚 {session.subject}
                                        </p>
                                    )}
                                    {session.tutor && (
                                        <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
                                            👨‍🏫 Tutor: {session.tutor}
                                        </p>
                                    )}
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ 
                                        display: 'inline-block',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        fontWeight: '600'
                                    }} className={getStatusClass(session.status)}>
                                        {getStatusText(session.status)}
                                    </span>
                                </div>
                            </div>

                            {/* Acciones */}
                            {session.status === 'pendiente' && (
                                <div style={{ 
                                    marginTop: '1rem', 
                                    paddingTop: '1rem',
                                    borderTop: '1px solid var(--border-color)',
                                    display: 'flex',
                                    gap: '0.5rem',
                                    flexWrap: 'wrap'
                                }}>
                                    <button 
                                        onClick={() => openRescheduleModal(session)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: 'rgba(79, 70, 229, 0.2)',
                                            color: '#818CF8',
                                            border: '1px solid rgba(79, 70, 229, 0.3)',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            fontSize: '0.9rem'
                                        }}
                                        onMouseOver={(e) => e.target.style.background = 'rgba(79, 70, 229, 0.4)'}
                                        onMouseOut={(e) => e.target.style.background = 'rgba(79, 70, 229, 0.2)'}
                                    >
                                        🔄 Reprogramar
                                    </button>
                                    <button 
                                        onClick={() => handleCancel(session.id)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: 'rgba(248, 113, 113, 0.2)',
                                            color: '#F87171',
                                            border: '1px solid rgba(248, 113, 113, 0.3)',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            fontSize: '0.9rem'
                                        }}
                                        onMouseOver={(e) => e.target.style.background = 'rgba(248, 113, 113, 0.4)'}
                                        onMouseOut={(e) => e.target.style.background = 'rgba(248, 113, 113, 0.2)'}
                                    >
                                        ❌ Cancelar
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de Reprogramar */}
            {rescheduleModal.isOpen && (
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
                        maxWidth: '500px',
                        width: '100%',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                    }}>
                        <h2 style={{ marginBottom: '1.5rem', color: 'white' }}>
                            🔄 Reprogramar Sesión #{rescheduleModal.sessionId}
                        </h2>
                        
                        <form onSubmit={handleReschedule}>
                            <div className="form-group">
                                <label className="form-label">📅 Nueva Fecha</label>
                                <input 
                                    type="date" 
                                    className="form-control"
                                    value={rescheduleModal.newDate}
                                    onChange={(e) => setRescheduleModal({
                                        ...rescheduleModal,
                                        newDate: e.target.value
                                    })}
                                    required
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">🕐 Hora Inicio</label>
                                    <input 
                                        type="time" 
                                        className="form-control"
                                        value={rescheduleModal.newStartTime}
                                        onChange={(e) => setRescheduleModal({
                                            ...rescheduleModal,
                                            newStartTime: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label">🕐 Hora Fin</label>
                                    <input 
                                        type="time" 
                                        className="form-control"
                                        value={rescheduleModal.newEndTime}
                                        onChange={(e) => setRescheduleModal({
                                            ...rescheduleModal,
                                            newEndTime: e.target.value
                                        })}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                                    💾 Guardar Cambios
                                </button>
                                <button 
                                    type="button" 
                                    onClick={closeRescheduleModal}
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
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
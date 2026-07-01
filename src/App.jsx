import React, { useState } from 'react';
import { TutoringForm } from './components/TutoringForm';
import { PostTutoringForm } from './components/PostTutoringForm';
import { StudentHistory } from './components/StudentHistory';
<<<<<<< HEAD
import { TutorSchedule } from './components/TutorSchedule';
import { StudentProgress } from './components/StudentProgress';
import { StudentQuestionnaire } from './components/StudentQuestionnaire';
import './App.css';
=======
import Login from './components/Login';
import { authService } from './services/authService';
>>>>>>> 80c258e5c0ef125c02c93f5902f8f436e1246395

function App() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [isAuthenticated, setIsAuthenticated] = useState(
    authService.isAuthenticated()
  );

  const user = authService.getUser();

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <Login
        onLogin={() => setIsAuthenticated(true)}
      />
    );
  }

  return (
<<<<<<< HEAD
    <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '2rem' }}>
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        background: 'rgba(30, 41, 59, 0.7)', 
        padding: '0.5rem', 
        borderRadius: '16px', 
        backdropFilter: 'blur(16px)' 
      }}>
        <button 
          style={{ 
            padding: '0.75rem 1.5rem', 
            borderRadius: '12px', 
            border: 'none', 
            background: activeTab === 'schedule' ? '#4F46E5' : 'transparent', 
            color: 'white', 
            cursor: 'pointer', 
            transition: 'all 0.3s' 
          }}
          onClick={() => setActiveTab('schedule')}
        >
          📅 Schedule
        </button>
        
        <button 
          style={{ 
            padding: '0.75rem 1.5rem', 
            borderRadius: '12px', 
            border: 'none', 
            background: activeTab === 'post' ? '#4F46E5' : 'transparent', 
            color: 'white', 
            cursor: 'pointer', 
            transition: 'all 0.3s' 
          }}
          onClick={() => setActiveTab('post')}
        >
          📝 Post-Tutoring
        </button>
        
        <button 
          style={{ 
            padding: '0.75rem 1.5rem', 
            borderRadius: '12px', 
            border: 'none', 
            background: activeTab === 'history' ? '#4F46E5' : 'transparent', 
            color: 'white', 
            cursor: 'pointer', 
            transition: 'all 0.3s' 
          }}
          onClick={() => setActiveTab('history')}
        >
          📚 History
        </button>
        
        <button 
          style={{ 
            padding: '0.75rem 1.5rem', 
            borderRadius: '12px', 
            border: 'none', 
            background: activeTab === 'schedule' ? '#4F46E5' : 'transparent', 
            color: 'white', 
            cursor: 'pointer', 
            transition: 'all 0.3s' 
          }}
          onClick={() => setActiveTab('schedule')}
        >
          📅 Schedule
        </button>
        
        <button 
          style={{ 
            padding: '0.75rem 1.5rem', 
            borderRadius: '12px', 
            border: 'none', 
            background: activeTab === 'progress' ? '#4F46E5' : 'transparent', 
            color: 'white', 
            cursor: 'pointer', 
            transition: 'all 0.3s' 
          }}
          onClick={() => setActiveTab('progress')}
        >
          📊 Grades
        </button>
        
        <button 
          style={{ 
            padding: '0.75rem 1.5rem', 
            borderRadius: '12px', 
            border: 'none', 
            background: activeTab === 'questionnaire' ? '#4F46E5' : 'transparent', 
            color: 'white', 
            cursor: 'pointer', 
            transition: 'all 0.3s' 
          }}
          onClick={() => setActiveTab('questionnaire')}
        >
          📋 Questionnaire
        </button>
      </div>

      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        {activeTab === 'schedule' && <TutoringForm />}
        {activeTab === 'post' && <PostTutoringForm />}
        {activeTab === 'history' && <StudentHistory />}
        {activeTab === 'schedule' && <TutorSchedule />}
        {activeTab === 'progress' && <StudentProgress />}
        {activeTab === 'questionnaire' && <StudentQuestionnaire />}
=======
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        gap: '2rem',
        padding: '2rem'
      }}
    >
      {/* Barra superior */}
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(30, 41, 59, 0.7)',
          padding: '1rem',
          borderRadius: '16px',
          backdropFilter: 'blur(16px)'
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>
            Sistema de Tutorías
          </h2>

          <p style={{ margin: 0 }}>
            Bienvenido {user?.nombre} {user?.apellido}
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            border: 'none',
            background: '#DC2626',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Menú */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          background: 'rgba(30, 41, 59, 0.7)',
          padding: '0.5rem',
          borderRadius: '16px',
          backdropFilter: 'blur(16px)'
        }}
      >
        <button
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            border: 'none',
            background:
              activeTab === 'schedule'
                ? '#4F46E5'
                : 'transparent',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onClick={() => setActiveTab('schedule')}
        >
          Agendar Tutoría
        </button>

        <button
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            border: 'none',
            background:
              activeTab === 'post'
                ? '#4F46E5'
                : 'transparent',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onClick={() => setActiveTab('post')}
        >
          Registro Post-Tutoría
        </button>

        <button
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            border: 'none',
            background:
              activeTab === 'history'
                ? '#4F46E5'
                : 'transparent',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onClick={() => setActiveTab('history')}
        >
          Historial Estudiante
        </button>
      </div>

      {/* Contenido */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        {activeTab === 'schedule' && (
          <TutoringForm />
        )}

        {activeTab === 'post' && (
          <PostTutoringForm />
        )}

        {activeTab === 'history' && (
          <StudentHistory />
        )}
>>>>>>> 80c258e5c0ef125c02c93f5902f8f436e1246395
      </div>
    </main>
  );
}

export default App;
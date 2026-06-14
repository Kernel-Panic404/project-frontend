import React, { useState } from 'react';

import LoginForm from './components/LoginForm';
import { TutoringForm } from './components/TutoringForm';
import { PostTutoringForm } from './components/PostTutoringForm';
import { StudentHistory } from './components/StudentHistory';

function App() {

  const [activeTab, setActiveTab] = useState('login');

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        gap: '2rem'
      }}
    >

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
            background: activeTab === 'login'
              ? '#4F46E5'
              : 'transparent',
            color: 'white',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('login')}
        >
          Iniciar Sesión
        </button>

        <button
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '12px',
            border: 'none',
            background: activeTab === 'schedule'
              ? '#4F46E5'
              : 'transparent',
            color: 'white',
            cursor: 'pointer'
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
            background: activeTab === 'post'
              ? '#4F46E5'
              : 'transparent',
            color: 'white',
            cursor: 'pointer'
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
            background: activeTab === 'history'
              ? '#4F46E5'
              : 'transparent',
            color: 'white',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('history')}
        >
          Historial Estudiante
        </button>

      </div>

      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        {activeTab === 'login' && <LoginForm />}

        {activeTab === 'schedule' && (
          <TutoringForm />
        )}

        {activeTab === 'post' && (
          <PostTutoringForm />
        )}

        {activeTab === 'history' && (
          <StudentHistory />
        )}
      </div>

    </main>
  );
}

export default App;
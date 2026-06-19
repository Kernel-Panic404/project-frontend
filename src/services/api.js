const API_URL = 'http://localhost:8000/api';

export const api = {
    // ============================================
    // EXISTING METHODS
    // ============================================
    getTutors: async () => {
        const response = await fetch(`${API_URL}/users/`);
        if (!response.ok) throw new Error('Failed to fetch tutors');
        const users = await response.json();
        return users.filter(u => u.rol && u.rol.nombre === 'tutor');
    },

    getSubjects: async () => {
        const response = await fetch(`${API_URL}/tutorias/subjects/`);
        if (!response.ok) throw new Error('Failed to fetch subjects');
        return await response.json();
    },

    getAvailability: async () => {
        const response = await fetch(`${API_URL}/tutorias/availability/`);
        if (!response.ok) throw new Error('Failed to fetch availability');
        return await response.json();
    },

    scheduleSession: async (sessionData) => {
        const response = await fetch(`${API_URL}/tutorias/sessions/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sessionData)
        });
        if (!response.ok) throw new Error('Failed to schedule session');
        return await response.json();
    },

    postSessionRecord: async (recordData) => {
        const response = await fetch(`${API_URL}/tutorias/session-records/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recordData)
        });
        if (!response.ok) throw new Error('Failed to create session record');
        return await response.json();
    },

    postAttendance: async (attendanceData) => {
        const response = await fetch(`${API_URL}/tutorias/attendance/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(attendanceData)
        });
        if (!response.ok) throw new Error('Failed to record attendance');
        return await response.json();
    },

    getStudentHistory: async (studentId) => {
        const response = await fetch(`${API_URL}/tutorias/history/student/${studentId}/`);
        if (!response.ok) throw new Error('Failed to fetch student history');
        return await response.json();
    },

    // ============================================
    // SCRUM-14 & SCRUM-15: Tutor Schedule
    // ============================================
    getTutorSchedule: async (tutorId) => {
        const response = await fetch(`${API_URL}/tutorias/availability/?tutor=${tutorId}`);
        if (!response.ok) throw new Error('Failed to fetch tutor schedule');
        return await response.json();
    },

    addTutorAvailability: async (data) => {
        const response = await fetch(`${API_URL}/tutorias/availability/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to add availability');
        return await response.json();
    },

    deleteTutorAvailability: async (slotId) => {
        const response = await fetch(`${API_URL}/tutorias/availability/${slotId}/`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete availability');
        return await response.json();
    },

    updateTutorAvailability: async (slotId, data) => {
        const response = await fetch(`${API_URL}/tutorias/availability/${slotId}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update availability');
        return await response.json();
    },

    // ============================================
    // SCRUM-46: Cancel and Reschedule
    // ============================================
    cancelSession: async (sessionId) => {
        const response = await fetch(`${API_URL}/tutorias/sessions/${sessionId}/cancel/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to cancel session');
        return await response.json();
    },

    rescheduleSession: async (sessionId, data) => {
        const response = await fetch(`${API_URL}/tutorias/sessions/${sessionId}/reschedule/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to reschedule session');
        return await response.json();
    },

    // ============================================
    // SCRUM-37: Student Progress
    // ============================================
    getStudentProgress: async (studentId) => {
        const response = await fetch(`${API_URL}/tutorias/progress/student/${studentId}/`);
        if (!response.ok) throw new Error('Failed to fetch student progress');
        return await response.json();
    },

    // ============================================
    // SCRUM-32: Student Questionnaire
    // ============================================
    getQuestionnaires: async () => {
        const response = await fetch(`${API_URL}/cuestionarios/questionnaires/`);
        if (!response.ok) throw new Error('Failed to fetch questionnaires');
        return await response.json();
    },

    submitQuestionnaire: async (data) => {
        const response = await fetch(`${API_URL}/cuestionarios/questionnaires/submit/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to submit questionnaire');
        return await response.json();
    }
};
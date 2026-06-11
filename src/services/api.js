const API_URL = 'http://localhost:8000/api';

export const api = {
    // We will use basic fetch since we don't need heavy dependencies like axios for a simple clean form
    getTutors: async () => {
        // This should ideally hit an endpoint returning only tutors. 
        // For now we assume a general users endpoint filtering by tutor role, or fetching from /tutor-subjects/
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

    // RF-06: Post-Tutoring Registration
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

    // RF-10: Student History
    getStudentHistory: async (studentId) => {
        const response = await fetch(`${API_URL}/tutorias/history/student/${studentId}/`);
        if (!response.ok) throw new Error('Failed to fetch student history');
        return await response.json();
    }
};

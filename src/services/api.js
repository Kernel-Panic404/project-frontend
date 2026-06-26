const API_URL = 'http://localhost:8000/api';

const getHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('access_token')}`
});

export const api = {
    getTutors: async () => {
        const response = await fetch(`${API_URL}/users/`, {
            headers: getHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch tutors');
        }

        const users = await response.json();

        return users.filter(
            user => user.rol && user.rol.nombre === 'tutor'
        );
    },

    getSubjects: async () => {
        const response = await fetch(
            `${API_URL}/tutorias/subjects/`,
            {
                headers: getHeaders()
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch subjects');
        }

        return await response.json();
    },

    getAvailability: async () => {
        const response = await fetch(
            `${API_URL}/tutorias/availability/`,
            {
                headers: getHeaders()
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch availability');
        }

        return await response.json();
    },

    scheduleSession: async (sessionData) => {
        const response = await fetch(
            `${API_URL}/tutorias/sessions/`,
            {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(sessionData)
            }
        );

        if (!response.ok) {
            throw new Error('Failed to schedule session');
        }

        return await response.json();
    },

    postSessionRecord: async (recordData) => {
        const response = await fetch(
            `${API_URL}/tutorias/session-records/`,
            {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(recordData)
            }
        );

        if (!response.ok) {
            throw new Error('Failed to create session record');
        }

        return await response.json();
    },

    postAttendance: async (attendanceData) => {
        const response = await fetch(
            `${API_URL}/tutorias/attendance/`,
            {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(attendanceData)
            }
        );

        if (!response.ok) {
            throw new Error('Failed to record attendance');
        }

        return await response.json();
    },

    getStudentHistory: async (studentId) => {
        const response = await fetch(
            `${API_URL}/tutorias/history/student/${studentId}/`,
            {
                headers: getHeaders()
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch student history');
        }

        return await response.json();
    }
};
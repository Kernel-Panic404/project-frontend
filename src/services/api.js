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
    }
};

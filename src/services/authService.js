const API_URL = 'http://localhost:8000/api/users';

export const authService = {
    login: async (correo, password) => {
        const response = await fetch(`${API_URL}/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                correo,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.non_field_errors?.[0] ||
                'Credenciales inválidas'
            );
        }

        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));

        return data;
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    },

    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    getToken: () => {
        return localStorage.getItem('access_token');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('access_token');
    }
};
import { useState } from 'react';
import { authService } from '../services/authService';

function Login({ onLogin }) {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        try {
            await authService.login(correo, password);
            onLogin();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                maxWidth: '400px',
                margin: '50px auto',
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '10px'
            }}
        >
            <h2>Iniciar Sesión</h2>

            {error && (
                <p style={{ color: 'red' }}>
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Correo</label>
                    <input
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginTop: '5px'
                        }}
                    />
                </div>

                <div style={{ marginTop: '15px' }}>
                    <label>Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginTop: '5px'
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        marginTop: '20px',
                        padding: '10px'
                    }}
                >
                    {loading ? 'Ingresando...' : 'Ingresar'}
                </button>
            </form>
        </div>
    );
}

export default Login;
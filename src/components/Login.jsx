import { useEffect, useState } from "react";
import { authService } from "../services/authService";
import logo from "../assets/mentora-logo.png";
import "./Login.css";

function Login({ onLogin }) {
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [rol, setRol] = useState("");

    const [roles, setRoles] = useState([]);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const cargarRoles = async () => {
            try {
                const data = await authService.getRoles();
                setRoles(data);

                if (data.length > 0) {
                    setRol(data[0].nombre);
                }
            } catch (err) {
                setError("No fue posible cargar los roles.");
            }
        };

        cargarRoles();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            await authService.login(
                correo,
                password,
                rol
            );

            onLogin();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">

                <img
                    src={logo}
                    alt="Mentora"
                    className="login-logo"
                />

                <h1>Iniciar Sesión</h1>

                {error && (
                    <div className="login-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label>Correo</label>

                        <input
                            type="email"
                            value={correo}
                            onChange={(e) =>
                                setCorreo(e.target.value)
                            }
                            placeholder="correo@unal.edu.co"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Contraseña</label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Rol</label>

                        <select
                            value={rol}
                            onChange={(e) =>
                                setRol(e.target.value)
                            }
                            required
                        >
                            {roles.map((item) => (
                                <option
                                    key={item.id}
                                    value={item.nombre}
                                >
                                    {item.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Ingresando..."
                            : "Ingresar"}
                    </button>

                </form>

            </div>
        </div>
    );
}

export default Login;
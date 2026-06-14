import { useState } from "react";

function LoginForm() {

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch(
        "http://localhost:8000/usuarios/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            correo,
            password,
            rol,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
          "Error al iniciar sesión"
        );
      }

      localStorage.setItem(
        "access",
        data.access
      );

      localStorage.setItem(
        "refresh",
        data.refresh
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setMensaje("Inicio de sesión exitoso");

      console.log(data);

    } catch (error) {

      setMensaje(error.message);

    }
  };

  return (
    <div className="login-container">

      <h2>Inicio de Sesión</h2>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Correo</label>

          <input
            type="email"
            value={correo}
            onChange={(e) =>
              setCorreo(e.target.value)
            }
            required
          />
        </div>

        <div>
          <label>Contraseña</label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />
        </div>

        <div>
          <label>Rol</label>

          <select
            value={rol}
            onChange={(e) =>
              setRol(e.target.value)
            }
            required
          >
            <option value="">
              Seleccione un rol
            </option>

            <option value="estudiante">
              Estudiante
            </option>

            <option value="tutor">
              Tutor
            </option>

            <option value="profesor">
              Profesor
            </option>

            <option value="admin">
              Administrador
            </option>

          </select>
        </div>

        <button type="submit">
          Ingresar
        </button>

      </form>

      {mensaje && <p>{mensaje}</p>}

    </div>
  );
}

export default LoginForm;
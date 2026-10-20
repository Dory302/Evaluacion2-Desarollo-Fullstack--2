// src/views/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CLAVE_USUARIOS_REGISTRADOS = "usuariosRegistrados";
const CLAVE_SESION_USUARIO = "sesionUsuario";

const CUENTAS_DEMOSTRACION = [
  {
    run: "123456785",
    nombre: "Administrador",
    apellidos: "Demo",
    correo: "admin@duoc.cl",
    fechaNacimiento: "1990-01-01",
    rol: "Administrador",
    region: "Región Metropolitana",
    comuna: "Santiago",
    direccion: "Avenida Demo 123",
    contrasena: "Admin123"
  },
  {
    run: "111111111",
    nombre: "Cliente",
    apellidos: "Demo",
    correo: "cliente@duoc.cl",
    fechaNacimiento: "1995-01-01",
    rol: "Cliente",
    region: "Región Metropolitana",
    comuna: "Santiago",
    direccion: "Avenida Demo 456",
    contrasena: "Cliente1"
  }
];

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    correo: '',
    contrasena: ''
  });

  const [errores, setErrores] = useState({
    correo: '',
    contrasena: ''
  });

  const [estadoLogin, setEstadoLogin] = useState({
    mensaje: '',
    tipo: ''
  });

  const validarCorreo = (correo) => {
    return correo.length <= 100 && /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(correo);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'correo') {
      const valido = validarCorreo(value.trim().toLowerCase());
      setErrores((prev) => ({
        ...prev,
        correo: valido ? '' : 'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.'
      }));
    }

    if (name === 'contrasena') {
      const len = value.length;
      setErrores((prev) => ({
        ...prev,
        contrasena: (len >= 4 && len <= 10) ? '' : 'La contraseña debe tener entre 4 y 10 caracteres.'
      }));
    }
  };

  const obtenerUsuarios = () => {
    try {
      const guardado = JSON.parse(localStorage.getItem(CLAVE_USUARIOS_REGISTRADOS));
      if (Array.isArray(guardado) && guardado.length > 0) return guardado;
    } catch {}
    localStorage.setItem(CLAVE_USUARIOS_REGISTRADOS, JSON.stringify(CUENTAS_DEMOSTRACION));
    return CUENTAS_DEMOSTRACION;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const correoClean = formData.correo.trim().toLowerCase();
    const esCorreoValido = validarCorreo(correoClean);
    const esPassValida = formData.contrasena.length >= 4 && formData.contrasena.length <= 10;

    if (!esCorreoValido || !esPassValida) {
      setErrores({
        correo: esCorreoValido ? '' : 'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.',
        contrasena: esPassValida ? '' : 'La contraseña debe tener entre 4 y 10 caracteres.'
      });
      return;
    }

    const usuarios = obtenerUsuarios();
    const usuarioEncontrado = usuarios.find((u) => u.correo === correoClean);

    if (!usuarioEncontrado || usuarioEncontrado.contrasena !== formData.contrasena) {
      setEstadoLogin({
        mensaje: 'El correo o la contraseña no coinciden con una cuenta registrada.',
        tipo: 'error'
      });
      return;
    }

   // Guardar sesión
    const sesion = {
      run: usuarioEncontrado.run,
      rol: usuarioEncontrado.rol || 'Cliente',
      nombre: usuarioEncontrado.nombre,
      apellidos: usuarioEncontrado.apellidos,
      correo: usuarioEncontrado.correo,
      region: usuarioEncontrado.region,
      comuna: usuarioEncontrado.comuna,
      direccion: usuarioEncontrado.direccion
    };

    localStorage.setItem(CLAVE_SESION_USUARIO, JSON.stringify(sesion));
    window.dispatchEvent(new Event('session-updated'));

    // Redirección dinámica según el rol del usuario
    if (sesion.rol === 'Administrador' || sesion.rol === 'Vendedor') {
      navigate('/admin');
    } else {
      navigate('/productos');
    }
  };

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="text-center mb-4">
            <span className="badge bg-secondary mb-2">Cuenta de cliente</span>
            <h1 className="fw-bold">Inicia sesión</h1>
            <p className="text-muted">
              Accede con tu correo y contraseña. ¿Aún no tienes cuenta?{' '}
              <Link to="/registro">Regístrate</Link>
            </p>
          </div>

          <div className="card shadow-sm p-4">
            <h2 className="h5 fw-bold mb-3 border-bottom pb-2">Ingreso de cliente</h2>

            {estadoLogin.mensaje && (
              <div className={`alert ${estadoLogin.tipo === 'error' ? 'alert-danger' : 'alert-success'} mb-3`}>
                {estadoLogin.mensaje}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label fw-semibold">Correo electrónico</label>
                <input
                  type="email"
                  name="correo"
                  className={`form-control ${errores.correo ? 'is-invalid' : ''}`}
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="ej. cliente@duoc.cl"
                  required
                />
                {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Contraseña</label>
                <input
                  type="password"
                  name="contrasena"
                  className={`form-control ${errores.contrasena ? 'is-invalid' : ''}`}
                  value={formData.contrasena}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                {errores.contrasena && <div className="invalid-feedback">{errores.contrasena}</div>}
              </div>

              <button type="submit" className="btn btn-dark w-100 btn-lg">
                Ingresar
              </button>
            </form>

            <div className="bg-light p-3 rounded mt-4 text-center small text-muted">
              <strong>Cuentas Demo disponibles:</strong><br />
              • Admin: <code>admin@duoc.cl</code> / <code>Admin123</code><br />
              • Cliente: <code>cliente@duoc.cl</code> / <code>Cliente1</code>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
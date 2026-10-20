// src/views/Contacto.jsx
import React, { useState } from 'react';

const CLAVE_MENSAJES_CONTACTO = 'mudraMensajesContacto';

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    comentario: ''
  });

  const [errores, setErrores] = useState({
    nombre: '',
    correo: '',
    comentario: ''
  });

  const [estadoForm, setEstadoForm] = useState({
    mensaje: '',
    tipo: '' // 'exito' o 'error'
  });

  // Validaciones individuales
  const validarCampo = (nombreCampo, valor) => {
    let error = '';
    const valorTrim = valor.trim();

    if (nombreCampo === 'nombre') {
      if (!valorTrim) {
        error = 'El nombre es obligatorio y admite hasta 100 caracteres.';
      } else if (valorTrim.length > 100) {
        error = 'El nombre no puede superar los 100 caracteres.';
      }
    }

    if (nombreCampo === 'correo') {
      const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const esDominioValido =
        valorTrim.endsWith('@duoc.cl') ||
        valorTrim.endsWith('@profesor.duoc.cl') ||
        valorTrim.endsWith('@gmail.com');

      if (!valorTrim || !correoRegex.test(valorTrim) || !esDominioValido) {
        error = 'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.';
      }
    }

    if (nombreCampo === 'comentario') {
      if (!valorTrim) {
        error = 'El comentario es obligatorio y admite hasta 500 caracteres.';
      } else if (valorTrim.length > 500) {
        error = 'El comentario no puede superar los 500 caracteres.';
      }
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validar mientras escribe
    const errorMsg = validarCampo(name, value);
    setErrores((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errorMsg = validarCampo(name, value);
    setErrores((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const obtenerMensajesContacto = () => {
    try {
      const mensajes = JSON.parse(localStorage.getItem(CLAVE_MENSAJES_CONTACTO));
      return Array.isArray(mensajes) ? mensajes : [];
    } catch {
      return [];
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar todos los campos
    const errNombre = validarCampo('nombre', formData.nombre);
    const errCorreo = validarCampo('correo', formData.correo);
    const errComentario = validarCampo('comentario', formData.comentario);

    const nuevosErrores = {
      nombre: errNombre,
      correo: errCorreo,
      comentario: errComentario
    };

    setErrores(nuevosErrores);

    // Si hay algún error, no continuar
    if (errNombre || errCorreo || errComentario) {
      setEstadoForm({
        mensaje: 'Por favor, corrige los errores en el formulario antes de enviar.',
        tipo: 'error'
      });
      return;
    }

    // Guardar en localStorage
    const nuevoMensaje = {
      id: `CONTACTO-${Date.now()}`,
      fecha: new Date().toISOString(),
      nombre: formData.nombre.trim(),
      correo: formData.correo.trim().toLowerCase(),
      comentario: formData.comentario.trim()
    };

    try {
      const mensajesAnteriores = obtenerMensajesContacto();
      localStorage.setItem(
        CLAVE_MENSAJES_CONTACTO,
        JSON.stringify([nuevoMensaje, ...mensajesAnteriores])
      );

      setFormData({ nombre: '', correo: '', comentario: '' });
      setErrores({ nombre: '', correo: '', comentario: '' });
      setEstadoForm({
        mensaje: 'Tu mensaje fue enviado correctamente. Te contactaremos pronto.',
        tipo: 'exito'
      });
    } catch {
      setEstadoForm({
        mensaje: 'No fue posible guardar tu mensaje. Inténtalo nuevamente.',
        tipo: 'error'
      });
    }
  };

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Encabezado de la página */}
          <div className="text-center mb-4">
            <span className="badge bg-secondary mb-2">Contacto</span>
            <h1 className="fw-bold">Hablemos de tu próxima prenda</h1>
            <p className="text-muted">
              Escríbenos tus dudas, sugerencias o consultas sobre productos. Nuestro equipo registrará tu mensaje para revisarlo.
            </p>
          </div>

          <div className="card shadow-sm p-4">
            <h2 className="h4 fw-bold mb-3 border-bottom pb-2">Envía tu mensaje</h2>

            {/* Mensaje de estado global */}
            {estadoForm.mensaje && (
              <div
                className={`alert ${
                  estadoForm.tipo === 'exito' ? 'alert-success' : 'alert-danger'
                } mb-4`}
                role="alert"
              >
                {estadoForm.mensaje}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Campo Nombre */}
              <div className="mb-3">
                <label htmlFor="contacto-nombre" className="form-label fw-semibold">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  id="contacto-nombre"
                  name="nombre"
                  className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                  value={formData.nombre}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={100}
                  placeholder="Ej. Juan Pérez"
                  required
                />
                {errores.nombre && (
                  <div className="invalid-feedback">{errores.nombre}</div>
                )}
              </div>

              {/* Campo Correo */}
              <div className="mb-3">
                <label htmlFor="contacto-correo" className="form-label fw-semibold">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  id="contacto-correo"
                  name="correo"
                  className={`form-control ${errores.correo ? 'is-invalid' : ''}`}
                  value={formData.correo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Ej. usuario@duoc.cl o usuario@gmail.com"
                  required
                />
                {errores.correo && (
                  <div className="invalid-feedback">{errores.correo}</div>
                )}
              </div>

              {/* Campo Comentario */}
              <div className="mb-4">
                <label htmlFor="contacto-comentario" className="form-label fw-semibold">
                  Comentario *
                </label>
                <textarea
                  id="contacto-comentario"
                  name="comentario"
                  className={`form-control ${errores.comentario ? 'is-invalid' : ''}`}
                  rows="5"
                  maxLength={500}
                  value={formData.comentario}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Escribe tu consulta o sugerencia aquí (máximo 500 caracteres)..."
                  required
                ></textarea>
                {errores.comentario && (
                  <div className="invalid-feedback">{errores.comentario}</div>
                )}
              </div>

              {/* Botón de Envío */}
              <button type="submit" className="btn btn-dark btn-lg w-100">
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
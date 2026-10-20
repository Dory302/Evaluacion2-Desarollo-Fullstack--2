// src/views/Registro.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { regionesData } from '../data/datos';

const CLAVE_USUARIOS_REGISTRADOS = "usuariosRegistrados";

export default function Registro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    run: '',
    nombre: '',
    apellidos: '',
    correo: '',
    contrasena: '',
    fechaNacimiento: '',
    region: '',
    comuna: '',
    direccion: ''
  });

  const [errores, setErrores] = useState({});
  const [estadoRegistro, setEstadoRegistro] = useState({ mensaje: '', tipo: '' });

  // Algoritmo Módulo 11 para RUN Chileno
  const validarRUN = (run) => {
    if (!/^[0-9]{6,8}[0-9kK]{1}$/.test(run)) return false;
    let cuerpo = run.slice(0, -1);
    let dv = run.slice(-1).toUpperCase();
    let suma = 0, mul = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += mul * parseInt(cuerpo.charAt(i));
      mul = mul < 7 ? mul + 1 : 2;
    }
    let dvEsperado = 11 - (suma % 11);
    let dvStr = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
    return dv === dvStr;
  };

  const validarCorreo = (correo) => {
    return correo.length <= 100 && /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(correo);
  };

  const validarFechaNacimiento = (fecha) => {
    if (!fecha) return true; // es opcional
    const ingresada = new Date(`${fecha}T00:00:00`);
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    return !isNaN(ingresada.getTime()) && ingresada <= hoy;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'run' ? value.toUpperCase() : value,
      ...(name === 'region' ? { comuna: '' } : {})
    }));
  };

  const obtenerComunas = () => {
    const reg = regionesData.find((r) => r.region === formData.region);
    return reg ? reg.comunas : [];
  };

  const validarFormulario = () => {
    const errs = {};
    if (!validarRUN(formData.run)) errs.run = 'Ingresa un RUN válido, sin puntos ni guión.';
    if (!formData.nombre.trim() || formData.nombre.length > 50) errs.nombre = 'El nombre es obligatorio y admite hasta 50 caracteres.';
    if (!formData.apellidos.trim() || formData.apellidos.length > 100) errs.apellidos = 'Los apellidos son obligatorios y admiten hasta 100 caracteres.';
    if (!validarCorreo(formData.correo.trim().toLowerCase())) errs.correo = 'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.';
    if (formData.contrasena.length < 4 || formData.contrasena.length > 10) errs.contrasena = 'La contraseña debe tener entre 4 y 10 caracteres.';
    if (!validarFechaNacimiento(formData.fechaNacimiento)) errs.fechaNacimiento = 'La fecha de nacimiento no puede ser futura.';
    if (!formData.region) errs.region = 'Selecciona una región.';
    if (!formData.comuna) errs.comuna = 'Selecciona una comuna.';
    if (!formData.direccion.trim() || formData.direccion.length > 300) errs.direccion = 'La dirección es obligatoria y admite hasta 300 caracteres.';
    
    setErrores(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    let usuarios = [];
    try {
      usuarios = JSON.parse(localStorage.getItem(CLAVE_USUARIOS_REGISTRADOS)) || [];
    } catch {
      usuarios = [];
    }

    const correoClean = formData.correo.trim().toLowerCase();
    if (usuarios.some((u) => u.correo === correoClean)) {
      setErrores((prev) => ({ ...prev, correo: 'Ya existe una cuenta con este correo.' }));
      return;
    }

    if (usuarios.some((u) => u.run === formData.run)) {
      setErrores((prev) => ({ ...prev, run: 'Ya existe una cuenta con este RUN.' }));
      return;
    }

    const nuevoUsuario = {
      ...formData,
      correo: correoClean,
      rol: 'Cliente'
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem(CLAVE_USUARIOS_REGISTRADOS, JSON.stringify(usuarios));

    setEstadoRegistro({ mensaje: 'Cuenta creada con éxito. Redirigiendo al login...', tipo: 'exito' });
    setTimeout(() => navigate('/login'), 1500);
  };

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-4">
            <span className="badge bg-secondary mb-2">Cuenta de cliente</span>
            <h1 className="fw-bold">Crea tu cuenta</h1>
            <p className="text-muted">
              Completa tus datos personales. ¿Ya tienes una cuenta?{' '}
              <Link to="/login">Inicia sesión</Link>
            </p>
          </div>

          <div className="card shadow-sm p-4">
            <h2 className="h5 fw-bold mb-3 border-bottom pb-2">Datos personales</h2>

            {estadoRegistro.mensaje && (
              <div className={`alert ${estadoRegistro.tipo === 'exito' ? 'alert-success' : 'alert-danger'} mb-3`}>
                {estadoRegistro.mensaje}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">RUN *</label>
                  <input
                    type="text"
                    name="run"
                    className={`form-control ${errores.run ? 'is-invalid' : ''}`}
                    value={formData.run}
                    onChange={handleChange}
                    placeholder="19818028K"
                  />
                  {errores.run && <div className="invalid-feedback">{errores.run}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Fecha de nacimiento (opcional)</label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    className={`form-control ${errores.fechaNacimiento ? 'is-invalid' : ''}`}
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                  />
                  {errores.fechaNacimiento && <div className="invalid-feedback">{errores.fechaNacimiento}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ej. Pedro"
                  />
                  {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Apellidos *</label>
                  <input
                    type="text"
                    name="apellidos"
                    className={`form-control ${errores.apellidos ? 'is-invalid' : ''}`}
                    value={formData.apellidos}
                    onChange={handleChange}
                    placeholder="Ej. Hacker"
                  />
                  {errores.apellidos && <div className="invalid-feedback">{errores.apellidos}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Correo electrónico *</label>
                  <input
                    type="email"
                    name="correo"
                    className={`form-control ${errores.correo ? 'is-invalid' : ''}`}
                    value={formData.correo}
                    onChange={handleChange}
                    placeholder="pedro.hacker20@example.com"
                  />
                  {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Contraseña *</label>
                  <input
                    type="password"
                    name="contrasena"
                    className={`form-control ${errores.contrasena ? 'is-invalid' : ''}`}
                    value={formData.contrasena}
                    onChange={handleChange}
                    placeholder="Entre 4 y 10 caracteres"
                  />
                  {errores.contrasena && <div className="invalid-feedback">{errores.contrasena}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Región *</label>
                  <select
                    name="region"
                    className={`form-select ${errores.region ? 'is-invalid' : ''}`}
                    value={formData.region}
                    onChange={handleChange}
                  >
                    <option value="">-- Seleccionar Región --</option>
                    {regionesData.map((r, i) => (
                      <option key={i} value={r.region}>{r.region}</option>
                    ))}
                  </select>
                  {errores.region && <div className="invalid-feedback">{errores.region}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Comuna *</label>
                  <select
                    name="comuna"
                    className={`form-select ${errores.comuna ? 'is-invalid' : ''}`}
                    value={formData.comuna}
                    onChange={handleChange}
                    disabled={!formData.region}
                  >
                    <option value="">-- Seleccionar Comuna --</option>
                    {obtenerComunas().map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                  {errores.comuna && <div className="invalid-feedback">{errores.comuna}</div>}
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Dirección *</label>
                  <textarea
                    name="direccion"
                    rows="2"
                    className={`form-control ${errores.direccion ? 'is-invalid' : ''}`}
                    value={formData.direccion}
                    onChange={handleChange}
                    placeholder="Calle, número, depto..."
                  ></textarea>
                  {errores.direccion && <div className="invalid-feedback">{errores.direccion}</div>}
                </div>
              </div>

              <button type="submit" className="btn btn-dark w-100 btn-lg mt-4">
                Crear cuenta
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
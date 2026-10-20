// src/admin/AdminUsuarios.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { regionesData } from '../data/datos';

const CLAVE_USUARIOS_REGISTRADOS = "usuariosRegistrados";

const CUENTAS_INICIALES = [
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

export default function AdminUsuarios() {
  const navigate = useNavigate();
  const [sesion, setSesion] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  // Estados de vista: 'listado' | 'crear' | 'editar' | 'detalle'
  const [modo, setModo] = useState('listado');
  const [usuarioActual, setUsuarioActual] = useState(null);

  const [formData, setFormData] = useState({
    run: '',
    nombre: '',
    apellidos: '',
    correo: '',
    contrasena: '',
    fechaNacimiento: '',
    rol: 'Cliente',
    region: '',
    comuna: '',
    direccion: ''
  });

  const [errores, setErrores] = useState({});

  useEffect(() => {
    // Validar sesión activa (Exclusivo para Administrador)
    const sesionGuardada = JSON.parse(localStorage.getItem('sesionUsuario'));
    if (!sesionGuardada || sesionGuardada.rol !== 'Administrador') {
      navigate('/admin');
      return;
    }
    setSesion(sesionGuardada);

    // Cargar usuarios
    let guardados = JSON.parse(localStorage.getItem(CLAVE_USUARIOS_REGISTRADOS));
    if (!guardados || guardados.length === 0) {
      localStorage.setItem(CLAVE_USUARIOS_REGISTRADOS, JSON.stringify(CUENTAS_INICIALES));
      setUsuarios(CUENTAS_INICIALES);
    } else {
      setUsuarios(guardados);
    }
  }, [navigate]);

  const guardarUsuariosStorage = (nuevos) => {
    setUsuarios(nuevos);
    localStorage.setItem(CLAVE_USUARIOS_REGISTRADOS, JSON.stringify(nuevos));
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem('sesionUsuario');
    window.dispatchEvent(new Event('session-updated'));
    navigate('/login');
  };

  // Validaciones
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

  // Acciones de vista
  const handleNuevo = () => {
    setFormData({
      run: '',
      nombre: '',
      apellidos: '',
      correo: '',
      contrasena: '',
      fechaNacimiento: '',
      rol: 'Cliente',
      region: '',
      comuna: '',
      direccion: ''
    });
    setErrores({});
    setModo('crear');
  };

  const handleEditar = (u) => {
    setUsuarioActual(u);
    setFormData({
      run: u.run,
      nombre: u.nombre,
      apellidos: u.apellidos,
      correo: u.correo,
      contrasena: u.contrasena || '',
      fechaNacimiento: u.fechaNacimiento || '',
      rol: u.rol || 'Cliente',
      region: u.region || '',
      comuna: u.comuna || '',
      direccion: u.direccion || ''
    });
    setErrores({});
    setModo('editar');
  };

  const handleVerDetalle = (u) => {
    setUsuarioActual(u);
    setModo('detalle');
  };

  const handleEliminar = (runEliminar) => {
    if (runEliminar === sesion.run) {
      alert("No puedes eliminar tu propia cuenta en uso.");
      return;
    }

    const admins = usuarios.filter(u => u.rol === 'Administrador');
    const uEliminar = usuarios.find(u => u.run === runEliminar);
    if (uEliminar?.rol === 'Administrador' && admins.length <= 1) {
      alert("Debe existir al menos un administrador en el sistema.");
      return;
    }

    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      const actualizados = usuarios.filter(u => u.run !== runEliminar);
      guardarUsuariosStorage(actualizados);
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const errs = {};

    if (modo === 'crear' && !validarRUN(formData.run)) {
      errs.run = 'RUN inválido (ej: 12345678K, sin puntos ni guión).';
    }
    if (!formData.nombre.trim()) errs.nombre = 'El nombre es obligatorio.';
    if (!formData.apellidos.trim()) errs.apellidos = 'Los apellidos son obligatorios.';
    if (!validarCorreo(formData.correo.trim().toLowerCase())) {
      errs.correo = 'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.';
    }
    if (formData.contrasena.length < 4 || formData.contrasena.length > 10) {
      errs.contrasena = 'La contraseña debe tener entre 4 y 10 caracteres.';
    }
    if (!formData.region) errs.region = 'Selecciona una región.';
    if (!formData.comuna) errs.comuna = 'Selecciona una comuna.';

    setErrores(errs);
    if (Object.keys(errs).length > 0) return;

    const uClean = {
      ...formData,
      run: formData.run.toUpperCase(),
      correo: formData.correo.trim().toLowerCase()
    };

    let actualizados = [];
    if (modo === 'crear') {
      if (usuarios.some(u => u.run === uClean.run)) {
        setErrores({ run: 'Ya existe un usuario con este RUN.' });
        return;
      }
      actualizados = [uClean, ...usuarios];
    } else {
      actualizados = usuarios.map(u => u.run === uClean.run ? uClean : u);
    }

    guardarUsuariosStorage(actualizados);
    setModo('listado');
  };

  const comunasDisponibles = () => {
    const reg = regionesData.find(r => r.region === formData.region);
    return reg ? reg.comunas : [];
  };

  const usuariosFiltrados = usuarios.filter(u =>
    `${u.nombre} ${u.apellidos}`.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.run.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (!sesion) return null;

  return (
    <div className="container-fluid my-4">
      <div className="row">
        {/* Sidebar */}
        <aside className="col-md-3 col-lg-2 bg-light p-3 rounded shadow-sm mb-4">
          <div className="d-flex align-items-center mb-3 pb-2 border-bottom">
            <span className="fw-bold fs-5">Mudra Admin</span>
          </div>
          <p className="small text-muted mb-3">
            Usuario: <strong>{sesion.nombre} {sesion.apellidos}</strong><br />
            Rol: <span className="badge bg-dark">{sesion.rol}</span>
          </p>
          <nav className="nav flex-column gap-2">
            <Link to="/admin" className="nav-link text-dark">📊 Resumen</Link>
            <Link to="/admin/productos" className="nav-link text-dark">📦 Productos</Link>
            <Link to="/admin/ordenes" className="nav-link text-dark">🧾 Órdenes</Link>
            <Link to="/admin/usuarios" className="nav-link active fw-bold bg-dark text-white rounded">👥 Usuarios</Link>
            <hr />
            <Link to="/" className="nav-link text-secondary">🌐 Ver tienda pública</Link>
            <button onClick={handleCerrarSesion} className="btn btn-outline-danger text-start w-100 mt-2">
              🚪 Cerrar sesión
            </button>
          </nav>
        </aside>

        {/* Contenido Principal */}
        <main className="col-md-9 col-lg-10">

          {/* MODO LISTADO DE USUARIOS */}
          {modo === 'listado' && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <h1 className="h3 fw-bold m-0">Gestión de Usuarios del Sistema</h1>
                <button className="btn btn-dark" onClick={handleNuevo}>
                  ➕ Nuevo Usuario
                </button>
              </div>

              {/* Buscador */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por RUN, nombre o correo..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
              </div>

              {/* Tabla de Usuarios */}
              <div className="card shadow-sm border-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>RUN</th>
                        <th>Nombre Completo</th>
                        <th>Correo</th>
                        <th>Rol</th>
                        <th>Comuna / Región</th>
                        <th className="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuariosFiltrados.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-4 text-muted">No se encontraron usuarios registrados.</td>
                        </tr>
                      ) : (
                        usuariosFiltrados.map((u) => (
                          <tr key={u.run}>
                            <td className="fw-bold">{u.run}</td>
                            <td>{u.nombre} {u.apellidos}</td>
                            <td>{u.correo}</td>
                            <td>
                              <span className={`badge ${u.rol === 'Administrador' ? 'bg-danger' : u.rol === 'Vendedor' ? 'bg-primary' : 'bg-secondary'}`}>
                                {u.rol}
                              </span>
                            </td>
                            <td>{u.comuna}, {u.region}</td>
                            <td className="text-center">
                              <div className="btn-group btn-group-sm">
                                <button className="btn btn-outline-dark" title="Ver detalle" onClick={() => handleVerDetalle(u)}>👁️</button>
                                <button className="btn btn-outline-primary" title="Editar" onClick={() => handleEditar(u)}>✏️</button>
                                <button className="btn btn-outline-danger" title="Eliminar" onClick={() => handleEliminar(u.run)}>🗑️</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* MODO CREAR / EDITAR USUARIO */}
          {(modo === 'crear' || modo === 'editar') && (
            <div className="card shadow-sm p-4 border-0">
              <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <h2 className="h3 fw-bold m-0">
                  {modo === 'crear' ? '➕ Registrar Nuevo Usuario' : `✏️ Editar Usuario: ${usuarioActual?.nombre}`}
                </h2>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setModo('listado')}>
                  ← Volver al listado
                </button>
              </div>

              <form onSubmit={handleSubmitForm}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">RUN *</label>
                    <input
                      type="text"
                      className={`form-control ${errores.run ? 'is-invalid' : ''}`}
                      value={formData.run}
                      onChange={(e) => setFormData({ ...formData, run: e.target.value.toUpperCase() })}
                      disabled={modo === 'editar'}
                      placeholder="12345678K"
                      required
                    />
                    {errores.run && <div className="invalid-feedback">{errores.run}</div>}
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Nombre *</label>
                    <input
                      type="text"
                      className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      required
                    />
                    {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Apellidos *</label>
                    <input
                      type="text"
                      className={`form-control ${errores.apellidos ? 'is-invalid' : ''}`}
                      value={formData.apellidos}
                      onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                      required
                    />
                    {errores.apellidos && <div className="invalid-feedback">{errores.apellidos}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Correo electrónico *</label>
                    <input
                      type="email"
                      className={`form-control ${errores.correo ? 'is-invalid' : ''}`}
                      value={formData.correo}
                      onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                      required
                    />
                    {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Contraseña *</label>
                    <input
                      type="password"
                      className={`form-control ${errores.contrasena ? 'is-invalid' : ''}`}
                      value={formData.contrasena}
                      onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
                      required
                    />
                    {errores.contrasena && <div className="invalid-feedback">{errores.contrasena}</div>}
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Rol de Usuario *</label>
                    <select
                      className="form-select"
                      value={formData.rol}
                      onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                    >
                      <option value="Cliente">Cliente</option>
                      <option value="Vendedor">Vendedor</option>
                      <option value="Administrador">Administrador</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Región *</label>
                    <select
                      className={`form-select ${errores.region ? 'is-invalid' : ''}`}
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value, comuna: '' })}
                    >
                      <option value="">-- Seleccionar Región --</option>
                      {regionesData.map((r, i) => (
                        <option key={i} value={r.region}>{r.region}</option>
                      ))}
                    </select>
                    {errores.region && <div className="invalid-feedback">{errores.region}</div>}
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Comuna *</label>
                    <select
                      className={`form-select ${errores.comuna ? 'is-invalid' : ''}`}
                      value={formData.comuna}
                      onChange={(e) => setFormData({ ...formData, comuna: e.target.value })}
                      disabled={!formData.region}
                    >
                      <option value="">-- Seleccionar Comuna --</option>
                      {comunasDisponibles().map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                      ))}
                    </select>
                    {errores.comuna && <div className="invalid-feedback">{errores.comuna}</div>}
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">Dirección</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.direccion}
                      onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-top d-flex gap-2 justify-content-end">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setModo('listado')}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-dark px-4">
                    {modo === 'crear' ? 'Guardar Usuario' : 'Actualizar Usuario'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* MODO DETALLE USUARIO */}
          {modo === 'detalle' && usuarioActual && (
            <div className="card shadow-sm p-4 border-0">
              <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <h2 className="h3 fw-bold m-0">Detalle de Usuario</h2>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setModo('listado')}>
                  ← Volver al listado
                </button>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <p><strong>RUN:</strong> {usuarioActual.run}</p>
                  <p><strong>Nombre completo:</strong> {usuarioActual.nombre} {usuarioActual.apellidos}</p>
                  <p><strong>Correo electrónico:</strong> {usuarioActual.correo}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Rol:</strong> <span className="badge bg-dark">{usuarioActual.rol}</span></p>
                  <p><strong>Comuna / Región:</strong> {usuarioActual.comuna}, {usuarioActual.region}</p>
                  <p><strong>Dirección:</strong> {usuarioActual.direccion || 'Sin registrar'}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-top">
                <button className="btn btn-dark" onClick={() => handleEditar(usuarioActual)}>
                  ✏️ Editar este usuario
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
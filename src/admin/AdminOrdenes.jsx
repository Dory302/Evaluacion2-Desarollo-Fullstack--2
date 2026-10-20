// src/admin/AdminOrdenes.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Datos de demostración iniciales para órdenes
const ORDENES_INICIALES = [
  {
    nroOrden: "20240701",
    fecha: "2024-07-01",
    estado: "Completada",
    cliente: {
      nombre: "Pedro",
      apellidos: "Hacker",
      correo: "pedro.hacker20@example.com",
      calle: "Avenida Siempre Viva 742",
      depto: "Depto 102",
      region: "Región Metropolitana",
      comuna: "Santiago",
      indicaciones: "Entregar en portería"
    },
    items: [
      { id: 1, nombre: "Polerón Oversize Heavyweight", precio: 29990, cantidad: 1 },
      { id: 2, nombre: "Pantalón Cargo Ripstop", precio: 34990, cantidad: 1 }
    ],
    total: 64980
  },
  {
    nroOrden: "20240705",
    fecha: "2024-07-05",
    estado: "Completada",
    cliente: {
      nombre: "María",
      apellidos: "González",
      correo: "cliente@duoc.cl",
      calle: "Calle Los Leones 1234",
      depto: "",
      region: "Región Metropolitana",
      comuna: "Providencia",
      indicaciones: ""
    },
    items: [
      { id: 3, nombre: "Jockey Strapback Minimal", precio: 14990, cantidad: 2 }
    ],
    total: 29980
  }
];

export default function AdminOrdenes() {
  const navigate = useNavigate();
  const [sesion, setSesion] = useState(null);
  const [ordenes, setOrdenes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);

  useEffect(() => {
    // Validar sesión
    const sesionGuardada = JSON.parse(localStorage.getItem('sesionUsuario'));
    if (!sesionGuardada || !['Administrador', 'Vendedor'].includes(sesionGuardada.rol)) {
      navigate('/login');
      return;
    }
    setSesion(sesionGuardada);

    // Cargar órdenes
    let guardadas = JSON.parse(localStorage.getItem('mudraOrdenes'));
    if (!guardadas || guardadas.length === 0) {
      // Si existe una última orden realizada en la tienda, agregamos la demostración
      const ultima = JSON.parse(localStorage.getItem('ultimaOrden'));
      const iniciales = ultima ? [ultima, ...ORDENES_INICIALES] : ORDENES_INICIALES;
      localStorage.setItem('mudraOrdenes', JSON.stringify(iniciales));
      setOrdenes(iniciales);
    } else {
      setOrdenes(guardadas);
    }
  }, [navigate]);

  const handleCerrarSesion = () => {
    localStorage.removeItem('sesionUsuario');
    window.dispatchEvent(new Event('session-updated'));
    navigate('/login');
  };

  const ordenesFiltradas = ordenes.filter(o => 
    o.nroOrden.toLowerCase().includes(busqueda.toLowerCase()) ||
    `${o.cliente?.nombre} ${o.cliente?.apellidos}`.toLowerCase().includes(busqueda.toLowerCase()) ||
    o.cliente?.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (!sesion) return null;

  return (
    <div className="container-fluid my-4">
      <div className="row">
        {/* Sidebar de navegación */}
        <aside className="col-md-3 col-lg-2 bg-light p-3 rounded shadow-sm mb-4">
          <div className="d-flex align-items-center mb-3 pb-2 border-bottom">
            <span className="fw-bold fs-5">Mudra Admin</span>
          </div>
          <p className="small text-muted mb-3">
            Usuario: <strong>{sesion.nombre} {sesion.apellidos}</strong><br />
            Rol: <span className="badge bg-dark">{sesion.rol}</span>
          </p>
          <nav className="nav flex-column gap-2">
            <Link to="/admin" className="nav-link text-dark">
              📊 Resumen
            </Link>
            <Link to="/admin/productos" className="nav-link text-dark">
              📦 Productos
            </Link>
            <Link to="/admin/ordenes" className="nav-link active fw-bold bg-dark text-white rounded">
              🧾 Órdenes
            </Link>
            {sesion.rol === 'Administrador' && (
              <Link to="/admin/usuarios" className="nav-link text-dark">
                👥 Usuarios
              </Link>
            )}
            <hr />
            <Link to="/" className="nav-link text-secondary">
              🌐 Ver tienda pública
            </Link>
            <button onClick={handleCerrarSesion} className="btn btn-outline-danger text-start w-100 mt-2">
              🚪 Cerrar sesión
            </button>
          </nav>
        </aside>

        {/* Contenido Principal */}
        <main className="col-md-9 col-lg-10">
          {/* Si NO hay orden seleccionada -> Muestra el Listado de Órdenes */}
          {!ordenSeleccionada ? (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <h1 className="h3 fw-bold m-0">Gestión de Órdenes de Compra</h1>
                <span className="badge bg-success fs-6">{ordenes.length} órdenes registradas</span>
              </div>

              {/* Buscador */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por N° de Orden, nombre o correo del cliente..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
              </div>

              {/* Tabla de Órdenes */}
              <div className="card shadow-sm border-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>N° Orden</th>
                        <th>Cliente</th>
                        <th>Correo</th>
                        <th>Región / Comuna</th>
                        <th>Total</th>
                        <th className="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordenesFiltradas.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-4 text-muted">
                            No se encontraron órdenes registradas.
                          </td>
                        </tr>
                      ) : (
                        ordenesFiltradas.map((orden, index) => (
                          <tr key={index}>
                            <td className="fw-bold">#{orden.nroOrden}</td>
                            <td>{orden.cliente?.nombre} {orden.cliente?.apellidos}</td>
                            <td>{orden.cliente?.correo}</td>
                            <td>{orden.cliente?.comuna}, {orden.cliente?.region}</td>
                            <td className="fw-bold text-success">${orden.total?.toLocaleString('es-CL')}</td>
                            <td className="text-center">
                              <button
                                className="btn btn-sm btn-outline-dark"
                                onClick={() => setOrdenSeleccionada(orden)}
                              >
                                👁️ Ver Detalle
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            /* Si HAY orden seleccionada -> Muestra el Detalle de la Orden (adminordendetalle.html) */
            <div className="card shadow-sm p-4 border-0">
              <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <div>
                  <button 
                    className="btn btn-outline-secondary btn-sm mb-2" 
                    onClick={() => setOrdenSeleccionada(null)}
                  >
                    ← Volver al listado de órdenes
                  </button>
                  <h2 className="h3 fw-bold m-0">Detalle de la Orden #{ordenSeleccionada.nroOrden}</h2>
                </div>
                <span className="badge bg-success fs-6 p-2">Estado: Completada</span>
              </div>

              {/* Datos del Cliente */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="bg-light p-3 rounded">
                    <h5 className="fw-bold text-dark border-bottom pb-2">Información del Cliente</h5>
                    <p className="mb-1"><strong>Nombre:</strong> {ordenSeleccionada.cliente?.nombre} {ordenSeleccionada.cliente?.apellidos}</p>
                    <p className="mb-1"><strong>Correo:</strong> {ordenSeleccionada.cliente?.correo}</p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="bg-light p-3 rounded">
                    <h5 className="fw-bold text-dark border-bottom pb-2">Dirección de Despacho</h5>
                    <p className="mb-1"><strong>Calle:</strong> {ordenSeleccionada.cliente?.calle} {ordenSeleccionada.cliente?.depto}</p>
                    <p className="mb-1"><strong>Comuna / Región:</strong> {ordenSeleccionada.cliente?.comuna}, {ordenSeleccionada.cliente?.region}</p>
                    {ordenSeleccionada.cliente?.indicaciones && (
                      <p className="mb-0 text-muted small"><strong>Indicaciones:</strong> {ordenSeleccionada.cliente?.indicaciones}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabla de Productos Comprados */}
              <h5 className="fw-bold mb-3">Productos Incluidos</h5>
              <div className="table-responsive mb-4">
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Producto</th>
                      <th className="text-end">Precio Unitario</th>
                      <th className="text-center">Cantidad</th>
                      <th className="text-end">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordenSeleccionada.items?.map((item, i) => (
                      <tr key={i}>
                        <td>{item.nombre}</td>
                        <td className="text-end">${item.precio?.toLocaleString('es-CL')}</td>
                        <td className="text-center">{item.cantidad}</td>
                        <td className="text-end">${(item.precio * item.cantidad)?.toLocaleString('es-CL')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan="3" className="text-end fs-5">Total Pagado:</th>
                      <th className="text-end fs-5 text-success">${ordenSeleccionada.total?.toLocaleString('es-CL')}</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
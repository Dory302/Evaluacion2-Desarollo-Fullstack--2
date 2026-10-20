// src/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productosIniciales } from '../data/datos';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [sesion, setSesion] = useState(null);
  const [metricas, setMetricas] = useState({
    totalProductos: 0,
    stockBajo: 0,
    unidadesTotales: 0,
    totalOrdenes: 0
  });

  useEffect(() => {
    // Validar sesión activa de administrador o vendedor
    const sesionGuardada = JSON.parse(localStorage.getItem('sesionUsuario'));
    if (!sesionGuardada || !['Administrador', 'Vendedor'].includes(sesionGuardada.rol)) {
      navigate('/login');
      return;
    }
    setSesion(sesionGuardada);

    // Calcular métricas
    const productos = JSON.parse(localStorage.getItem('mudraProductos')) || productosIniciales;
    const ordenes = JSON.parse(localStorage.getItem('mudraOrdenes')) || [];

    const bajoStock = productos.filter(p => p.stock <= (p.stockCritico || 3)).length;
    const totalUnidades = productos.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);

    setMetricas({
      totalProductos: productos.length,
      stockBajo: bajoStock,
      unidadesTotales: totalUnidades,
      totalOrdenes: ordenes.length
    });
  }, [navigate]);

  const handleCerrarSesion = () => {
    localStorage.removeItem('sesionUsuario');
    window.dispatchEvent(new Event('session-updated'));
    navigate('/login');
  };

  if (!sesion) return null;

  return (
    <div className="container-fluid my-4">
      <div className="row">
        {/* Sidebar de administración */}
        <aside className="col-md-3 col-lg-2 bg-light p-3 rounded shadow-sm mb-4">
          <div className="d-flex align-items-center mb-3 pb-2 border-bottom">
            <span className="fw-bold fs-5">Mudra Admin</span>
          </div>
          <p className="small text-muted mb-3">
            Usuario: <strong>{sesion.nombre} {sesion.apellidos}</strong><br />
            Rol: <span className="badge bg-dark">{sesion.rol}</span>
          </p>
          <nav className="nav flex-column gap-2">
            <Link to="/admin" className="nav-link active fw-bold bg-primary text-white rounded">
              📊 Dashboard
            </Link>
            <Link to="/admin/ordenes" className="nav-link text-dark">
              🧾 Órdenes
            </Link>
            <Link to="/admin/productos" className="nav-link text-dark">
              📦 Productos
            </Link>
            <Link to="/categorias" className="nav-link text-dark">
              🏷️ Categorías
            </Link>
            {sesion.rol === 'Administrador' && (
              <Link to="/admin/usuarios" className="nav-link text-dark">
                👥 Usuarios
              </Link>
            )}
            <hr />
            <Link to="/" className="btn btn-dark text-white w-100 text-start mb-2">
              🏪 Tienda
            </Link>
            <button onClick={handleCerrarSesion} className="btn btn-danger text-white text-start w-100">
              🚪 Cerrar Sesión
            </button>
          </nav>
        </aside>

        {/* Contenido Principal / Dashboard */}
        <main className="col-md-9 col-lg-10">
          <div className="mb-4 pb-2 border-bottom">
            <h1 className="h3 fw-bold mb-0">Dashboard</h1>
            <span className="text-muted small">Resumen de las actividades diarias</span>
          </div>

          {/* Tarjetas Superiores de Métricas (Compras, Productos, Usuarios) */}
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="card shadow-sm border-0 bg-primary text-white p-3 rounded-3 h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="fs-5 fw-semibold d-block">Compras</span>
                    <h2 className="fw-bold my-1">{metricas.totalOrdenes || 1234}</h2>
                  </div>
                  <div className="fs-1">🛒</div>
                </div>
                <small className="mt-3 d-block opacity-75">Probabilidad de aumento: 20%</small>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm border-0 bg-success text-white p-3 rounded-3 h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="fs-5 fw-semibold d-block">Productos</span>
                    <h2 className="fw-bold my-1">{metricas.totalProductos || 400}</h2>
                  </div>
                  <div className="fs-1">📦</div>
                </div>
                <small className="mt-3 d-block opacity-75">Inventario actual: {metricas.unidadesTotales || 500}</small>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm border-0 bg-warning text-dark p-3 rounded-3 h-100">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="fs-5 fw-semibold d-block">Usuarios</span>
                    <h2 className="fw-bold my-1">890</h2>
                  </div>
                  <div className="fs-1">👥</div>
                </div>
                <small className="mt-3 d-block opacity-75">Nuevos usuarios este mes: 120</small>
              </div>
            </div>
          </div>

          {/* Grilla Inferior de Tarjetas de Acceso Rápido / Secciones */}
          <div className="row g-3">
            <div className="col-sm-6 col-lg-3">
              <Link to="/admin" className="text-decoration-none">
                <div className="card shadow-sm border-0 text-center p-3 h-100 hover-shadow rounded-3">
                  <div className="fs-2 text-primary mb-2">⏲️</div>
                  <h6 className="fw-bold text-dark mb-1">Dashboard</h6>
                  <p className="small text-muted mb-0">Visión general de todas las métricas y estadísticas clave del sistema.</p>
                </div>
              </Link>
            </div>

            <div className="col-sm-6 col-lg-3">
              <Link to="/admin/ordenes" className="text-decoration-none">
                <div className="card shadow-sm border-0 text-center p-3 h-100 hover-shadow rounded-3">
                  <div className="fs-2 text-primary mb-2">🛒</div>
                  <h6 className="fw-bold text-dark mb-1">Órdenes</h6>
                  <p className="small text-muted mb-0">Gestión y seguimiento de todas las órdenes de compra realizadas.</p>
                </div>
              </Link>
            </div>

            <div className="col-sm-6 col-lg-3">
              <Link to="/admin/productos" className="text-decoration-none">
                <div className="card shadow-sm border-0 text-center p-3 h-100 hover-shadow rounded-3">
                  <div className="fs-2 text-primary mb-2">📦</div>
                  <h6 className="fw-bold text-dark mb-1">Productos</h6>
                  <p className="small text-muted mb-0">Administrar inventario y detalles de los productos disponibles.</p>
                </div>
              </Link>
            </div>

            <div className="col-sm-6 col-lg-3">
              <Link to="/categorias" className="text-decoration-none">
                <div className="card shadow-sm border-0 text-center p-3 h-100 hover-shadow rounded-3">
                  <div className="fs-2 text-primary mb-2">🏷️</div>
                  <h6 className="fw-bold text-dark mb-1">Categorías</h6>
                  <p className="small text-muted mb-0">Organizar productos en categorías para facilitar su navegación.</p>
                </div>
              </Link>
            </div>

            <div className="col-sm-6 col-lg-3">
              <Link to="/admin/usuarios" className="text-decoration-none">
                <div className="card shadow-sm border-0 text-center p-3 h-100 hover-shadow rounded-3">
                  <div className="fs-2 text-primary mb-2">👥</div>
                  <h6 className="fw-bold text-dark mb-1">Usuarios</h6>
                  <p className="small text-muted mb-0">Gestión de cuentas de usuario y sus roles dentro del sistema.</p>
                </div>
              </Link>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="card shadow-sm border-0 text-center p-3 h-100 rounded-3 bg-light">
                <div className="fs-2 text-secondary mb-2">📊</div>
                <h6 className="fw-bold text-dark mb-1">Reportes</h6>
                <p className="small text-muted mb-0">Generación de informes detallados sobre las operaciones del sistema.</p>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="card shadow-sm border-0 text-center p-3 h-100 rounded-3 bg-light">
                <div className="fs-2 text-secondary mb-2">👤</div>
                <h6 className="fw-bold text-dark mb-1">Perfil</h6>
                <p className="small text-muted mb-0">Administración de la información personal y configuraciones de cuenta.</p>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <Link to="/" className="text-decoration-none">
                <div className="card shadow-sm border-0 text-center p-3 h-100 hover-shadow rounded-3">
                  <div className="fs-2 text-primary mb-2">🏪</div>
                  <h6 className="fw-bold text-dark mb-1">Tienda</h6>
                  <p className="small text-muted mb-0">Visualiza tu tienda en tiempo real, visualiza los reportes de los usuarios.</p>
                </div>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
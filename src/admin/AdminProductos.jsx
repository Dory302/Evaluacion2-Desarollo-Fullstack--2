// src/admin/AdminProductos.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productosIniciales } from '../data/datos';

export default function AdminProductos() {
  const navigate = useNavigate();
  const [sesion, setSesion] = useState(null);
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSel, setCategoriaSel] = useState('Todas');

  // Control de modo de vista: 'listado' | 'crear' | 'editar' | 'detalle'
  const [modo, setModo] = useState('listado');
  const [productoActual, setProductoActual] = useState(null);

  // Formulario para Crear / Editar
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    categoria: 'Polerones',
    precio: '',
    stock: '',
    stockCritico: '3',
    imagen: '',
    descripcion: ''
  });

  const [errorForm, setErrorForm] = useState('');

  useEffect(() => {
    // Validar sesión activa
    const sesionGuardada = JSON.parse(localStorage.getItem('sesionUsuario'));
    if (!sesionGuardada || !['Administrador', 'Vendedor'].includes(sesionGuardada.rol)) {
      navigate('/login');
      return;
    }
    setSesion(sesionGuardada);

    // Cargar productos desde localStorage o iniciales
    const guardados = JSON.parse(localStorage.getItem('mudraProductos'));
    if (!guardados || guardados.length === 0) {
      localStorage.setItem('mudraProductos', JSON.stringify(productosIniciales));
      setProductos(productosIniciales);
    } else {
      setProductos(guardados);
    }
  }, [navigate]);

  const guardarEnStorage = (nuevosProds) => {
    setProductos(nuevosProds);
    localStorage.setItem('mudraProductos', JSON.stringify(nuevosProds));
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem('sesionUsuario');
    window.dispatchEvent(new Event('session-updated'));
    navigate('/login');
  };

  // Abrir formulario para Crear
  const handleNuevo = () => {
    setFormData({
      id: Date.now(),
      nombre: '',
      categoria: 'Polerones',
      precio: '',
      stock: '',
      stockCritico: '3',
      imagen: '',
      descripcion: ''
    });
    setErrorForm('');
    setModo('crear');
  };

  // Abrir formulario para Editar
  const handleEditar = (prod) => {
    setProductoActual(prod);
    setFormData({
      id: prod.id,
      nombre: prod.nombre,
      categoria: prod.categoria,
      precio: prod.precio,
      stock: prod.stock,
      stockCritico: prod.stockCritico || 3,
      imagen: prod.imagen,
      descripcion: prod.descripcion || ''
    });
    setErrorForm('');
    setModo('editar');
  };

  // Abrir vista Detalle
  const handleVerDetalle = (prod) => {
    setProductoActual(prod);
    setModo('detalle');
  };

  // Eliminar
  const handleEliminar = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto del inventario?')) {
      const actualizados = productos.filter(p => p.id !== id);
      guardarEnStorage(actualizados);
    }
  };

  // Submit Guardar (Crear / Editar)
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.precio || !formData.stock) {
      setErrorForm('Por favor completa todos los campos obligatorios (*).');
      return;
    }

    const prodGuardar = {
      ...formData,
      precio: Number(formData.precio),
      stock: Number(formData.stock),
      stockCritico: Number(formData.stockCritico) || 3,
      imagen: formData.imagen.trim() || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80'
    };

    let actualizados = [];
    if (modo === 'crear') {
      actualizados = [prodGuardar, ...productos];
    } else {
      actualizados = productos.map(p => p.id === prodGuardar.id ? prodGuardar : p);
    }

    guardarEnStorage(actualizados);
    setModo('listado');
  };

  // Filtrado de la tabla
  const productosFiltrados = productos.filter(p => {
    const coincideNombre = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCat = categoriaSel === 'Todas' || p.categoria === categoriaSel;
    return coincideNombre && coincideCat;
  });

  const categoriasUnicas = ['Todas', ...new Set(productos.map(p => p.categoria))];

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
            <Link to="/admin/productos" className="nav-link active fw-bold bg-dark text-white rounded">📦 Productos</Link>
            <Link to="/admin/ordenes" className="nav-link text-dark">🧾 Órdenes</Link>
            {sesion.rol === 'Administrador' && (
              <Link to="/admin/usuarios" className="nav-link text-dark">👥 Usuarios</Link>
            )}
            <hr />
            <Link to="/" className="nav-link text-secondary">🌐 Ver tienda pública</Link>
            <button onClick={handleCerrarSesion} className="btn btn-outline-danger text-start w-100 mt-2">
              🚪 Cerrar sesión
            </button>
          </nav>
        </aside>

        {/* Contenido Principal */}
        <main className="col-md-9 col-lg-10">
          
          {/* MODO 1: LISTADO DE PRODUCTOS */}
          {modo === 'listado' && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <h1 className="h3 fw-bold m-0">Gestión de Productos e Inventario</h1>
                <button className="btn btn-dark" onClick={handleNuevo}>
                  ➕ Nuevo Producto
                </button>
              </div>

              {/* Filtros */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar producto por nombre..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <select
                    className="form-select"
                    value={categoriaSel}
                    onChange={(e) => setCategoriaSel(e.target.value)}
                  >
                    {categoriasUnicas.map((cat, i) => (
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tabla de Productos */}
              <div className="card shadow-sm border-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Estado</th>
                        <th className="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productosFiltrados.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center py-4 text-muted">
                            No hay productos registrados o coincidentes.
                          </td>
                        </tr>
                      ) : (
                        productosFiltrados.map((prod) => {
                          const esStockBajo = prod.stock > 0 && prod.stock <= (prod.stockCritico || 3);
                          const esAgotado = prod.stock <= 0;

                          return (
                            <tr key={prod.id}>
                              <td style={{ width: '60px' }}>
                                <img src={prod.imagen} alt={prod.nombre} style={{ width: '50px', height: '50px', objectFit: 'cover' }} className="rounded" />
                              </td>
                              <td className="fw-bold">{prod.nombre}</td>
                              <td><span className="badge bg-light text-dark border">{prod.categoria}</span></td>
                              <td className="fw-bold text-success">${prod.precio?.toLocaleString('es-CL')}</td>
                              <td>{prod.stock} un.</td>
                              <td>
                                {esAgotado ? (
                                  <span className="badge bg-danger">Agotado</span>
                                ) : esStockBajo ? (
                                  <span className="badge bg-warning text-dark">Stock Crítico</span>
                                ) : (
                                  <span className="badge bg-success">Disponible</span>
                                )}
                              </td>
                              <td className="text-center">
                                <div className="btn-group btn-group-sm">
                                  <button className="btn btn-outline-dark" title="Ver detalle" onClick={() => handleVerDetalle(prod)}>👁️</button>
                                  <button className="btn btn-outline-primary" title="Editar" onClick={() => handleEditar(prod)}>✏️</button>
                                  <button className="btn btn-outline-danger" title="Eliminar" onClick={() => handleEliminar(prod.id)}>🗑️</button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* MODO 2: FORMULARIO CREAR / EDITAR */}
          {(modo === 'crear' || modo === 'editar') && (
            <div className="card shadow-sm p-4 border-0">
              <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <h2 className="h3 fw-bold m-0">
                  {modo === 'crear' ? '➕ Registrar Nuevo Producto' : `✏️ Editar Producto: ${productoActual?.nombre}`}
                </h2>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setModo('listado')}>
                  ← Volver al listado
                </button>
              </div>

              {errorForm && <div className="alert alert-danger mb-3">{errorForm}</div>}

              <form onSubmit={handleSubmitForm}>
                <div className="row g-3">
                  <div className="col-md-8">
                    <label className="form-label fw-semibold">Nombre del producto *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Categoría *</label>
                    <select
                      className="form-select"
                      value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    >
                      <option value="Polerones">Polerones</option>
                      <option value="Pantalones">Pantalones</option>
                      <option value="Accesorios">Accesorios</option>
                      <option value="Calzado">Calzado</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Precio ($ CLP) *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.precio}
                      onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Stock Disponible *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Stock Crítico (Mínimo)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.stockCritico}
                      onChange={(e) => setFormData({ ...formData, stockCritico: e.target.value })}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">URL de la Imagen</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="https://ejemplo.com/imagen.jpg"
                      value={formData.imagen}
                      onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">Descripción del producto</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-top d-flex gap-2 justify-content-end">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setModo('listado')}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-dark px-4">
                    {modo === 'crear' ? 'Guardar Producto' : 'Actualizar Producto'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* MODO 3: DETALLE DEL PRODUCTO */}
          {modo === 'detalle' && productoActual && (
            <div className="card shadow-sm p-4 border-0">
              <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <h2 className="h3 fw-bold m-0">Detalle de Producto en Inventario</h2>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setModo('listado')}>
                  ← Volver al listado
                </button>
              </div>

              <div className="row g-4">
                <div className="col-md-4 text-center">
                  <img src={productoActual.imagen} alt={productoActual.nombre} className="img-fluid rounded shadow-sm" style={{ maxHeight: '300px', objectFit: 'cover' }} />
                </div>
                <div className="col-md-8">
                  <span className="badge bg-dark mb-2">{productoActual.categoria}</span>
                  <h3 className="fw-bold">{productoActual.nombre}</h3>
                  <h4 className="text-success fw-bold my-3">${productoActual.precio?.toLocaleString('es-CL')} CLP</h4>
                  <p className="text-muted">{productoActual.descripcion || 'Sin descripción ingresada.'}</p>
                  
                  <div className="bg-light p-3 rounded mt-3">
                    <p className="mb-1"><strong>Stock actual:</strong> {productoActual.stock} unidades</p>
                    <p className="mb-0"><strong>Límite de stock crítico:</strong> {productoActual.stockCritico || 3} unidades</p>
                  </div>

                  <div className="mt-4">
                    <button className="btn btn-dark me-2" onClick={() => handleEditar(productoActual)}>
                      ✏️ Editar este producto
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
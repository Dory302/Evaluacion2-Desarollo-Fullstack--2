// src/Views/DetalleProducto.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productosIniciales } from '../data/datos';

export default function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    // Obtenemos los productos desde localStorage o usamos los iniciales
    const productos = JSON.parse(localStorage.getItem('mudraProductos')) || productosIniciales;
    // Buscamos comparando ambos como String para evitar errores entre números y textos (ej: "URB001")
    const encontrado = productos.find((p) => String(p.id) === String(id));
    setProducto(encontrado);
  }, [id]);

  const handleAgregarCarrito = () => {
    if (!producto) return;

    let carritoActual = JSON.parse(localStorage.getItem('mudraCarrito')) || [];
    const existeIndice = carritoActual.findIndex((item) => String(item.id) === String(producto.id));

    if (existeIndice !== -1) {
      carritoActual[existeIndice].cantidad += cantidad;
    } else {
      carritoActual.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen || producto.img,
        cantidad: cantidad
      });
    }

    localStorage.setItem('mudraCarrito', JSON.stringify(carritoActual));
    setMensaje('¡Producto añadido al carrito con éxito!');
    setTimeout(() => setMensaje(''), 3000);
  };

  if (!producto) {
    return (
      <div className="container my-5 py-5 text-center bg-white p-4 rounded-4 shadow">
        <h4 className="fw-bold">Producto no encontrado</h4>
        <p className="text-muted">El producto que buscas ya no está disponible en el catálogo.</p>
        <Link to="/productos" className="btn btn-dark mt-3">
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-5" style={{ minHeight: '70vh' }}>
      <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border">
        <Link to="/productos" className="btn btn-outline-secondary mb-4">
          ← Volver al catálogo
        </Link>

        {mensaje && (
          <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
            {mensaje}
          </div>
        )}

        <div className="row g-4 align-items-center">
          {/* Imagen del producto */}
          <div className="col-md-6 text-center">
            <img
              src={producto.imagen || producto.img}
              alt={producto.nombre}
              className="img-fluid rounded-3 shadow-sm w-100"
              style={{ maxHeight: '450px', objectFit: 'cover' }}
            />
          </div>

          {/* Información y acciones */}
          <div className="col-md-6">
            <h2 className="fw-bold text-dark mb-2">{producto.nombre}</h2>
            <h3 className="text-success fw-bold mb-3">
              ${Number(producto.precio).toLocaleString('es-CL')}
            </h3>
            <p className="text-secondary mb-3">{producto.descripcion}</p>
            
            <div className="mb-3">
              <span className="text-muted d-block mb-1">
                <strong>Material:</strong> {producto.material || 'Algodón urbano'}
              </span>
              <span className="text-muted d-block">
                <strong>Stock disponible:</strong>{' '}
                <span className="badge bg-secondary">{producto.stock} unidades</span>
              </span>
            </div>

            <hr className="my-4" />

            {/* Selector de cantidad */}
            <div className="d-flex align-items-center gap-3 mb-4">
              <label className="fw-semibold">Cantidad:</label>
              <input
                type="number"
                className="form-control text-center"
                style={{ width: '90px' }}
                min="1"
                max={producto.stock}
                value={cantidad}
                onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>

            {/* Botones */}
            <div className="d-flex gap-2">
              <button
                onClick={handleAgregarCarrito}
                className="btn btn-dark btn-lg flex-grow-1 text-white fw-semibold"
                disabled={producto.stock <= 0}
              >
                {producto.stock > 0 ? '🛒 Agregar al Carrito' : 'Agotado'}
              </button>
              <button
                onClick={() => {
                  handleAgregarCarrito();
                  navigate('/carrito');
                }}
                className="btn btn-outline-dark btn-lg fw-semibold"
                disabled={producto.stock <= 0}
              >
                Comprar Ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
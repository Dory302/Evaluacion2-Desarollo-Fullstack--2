// src/Views/Ofertas.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productosIniciales } from '../data/datos';

export default function Ofertas() {
  const [productosOferta, setProductosOferta] = useState([]);

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('mudraProductos')) || productosIniciales;
    // Seleccionamos algunos productos para la sección de ofertas (o los que tengan precio especial)
    const enOferta = guardados.map(prod => ({
      ...prod,
      precioOriginal: prod.precio,
      precioOferta: Math.round(prod.precio * 0.8) // 20% de descuento aplicado
    }));
    setProductosOferta(enOferta);
  }, []);

  return (
    <div className="container my-5" style={{ minHeight: '70vh' }}>
      <div className="text-center mb-4">
        <span className="badge bg-danger text-uppercase px-3 py-2 fs-6 fw-bold mb-2">
          🔥 Descuentos Especiales
        </span>
        <h2 className="fw-bold">Ofertas de la Semana</h2>
        <p className="text-muted">Aprovecha hasta un 20% OFF en productos seleccionados de moda urbana.</p>
      </div>

      <div className="row g-4">
        {productosOferta.map((prod) => (
          <div key={prod.id} className="col-sm-6 col-md-4 col-lg-3">
            <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden position-relative">
              <span className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 m-2 rounded fw-bold small">
                -20%
              </span>
              <img
                src={prod.imagen || prod.img}
                alt={prod.nombre}
                className="card-img-top"
                style={{ height: '220px', objectFit: 'cover' }}
              />
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h6 className="card-title fw-bold text-dark mb-1">{prod.nombre}</h6>
                  <small className="text-muted d-block mb-2">Stock: {prod.stock} un.</small>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="text-decoration-line-through text-muted small">
                      ${Number(prod.precioOriginal).toLocaleString('es-CL')}
                    </span>
                    <span className="text-danger fw-bold fs-5">
                      ${Number(prod.precioOferta).toLocaleString('es-CL')}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/productos/${prod.id}`}
                  className="btn btn-dark w-100 mt-2 text-white fw-semibold"
                >
                  Ver detalle
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
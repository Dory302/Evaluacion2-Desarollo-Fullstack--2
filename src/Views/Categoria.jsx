// src/views/Categorias.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { productosIniciales } from '../data/datos';

export default function Categorias() {
  // Estado para la categoría seleccionada (por defecto muestra todas o la primera)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Polerones");

  // Extraemos las categorías únicas de nuestros productos
  const categoriasDisponibles = [...new Set(productosIniciales.map(p => p.categoria))];

  // Filtramos los productos según la categoría seleccionada
  const productosFiltrados = productosIniciales.filter(p => p.categoria === categoriaSeleccionada);

  return (
    <main className="container my-5">
      <div className="text-center mb-5">
        <p className="text-muted text-uppercase small">Explora por sección</p>
        <h2 className="fw-bold">Categorías de la Tienda</h2>
      </div>

      {/* Botones de selección de Categorías (Diseño similar Figura 4) */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-8 text-center">
          <div className="d-flex flex-wrap justify-content-center gap-2">
            {categoriasDisponibles.map((cat, index) => (
              <button
                key={index}
                className={`btn ${categoriaSeleccionada === cat ? 'btn-dark' : 'btn-outline-dark'} px-4 py-2`}
                onClick={() => setCategoriaSeleccionada(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Título de la categoría activa */}
      <div className="mb-4">
        <h3 className="fw-bold border-bottom pb-2">{categoriaSeleccionada}</h3>
      </div>

      {/* Grilla de productos de la categoría seleccionada */}
      <div className="row">
        {productosFiltrados.length === 0 ? (
          <div className="col-12 text-center py-4">
            <p className="text-muted">No hay productos disponibles en esta categoría por el momento.</p>
          </div>
        ) : (
          productosFiltrados.map((producto) => (
            <div className="col-md-3 mb-4" key={producto.id}>
              <div className="card h-100 shadow-sm">
                <img 
                  src={producto.imagen} 
                  className="card-img-top" 
                  alt={producto.nombre} 
                  style={{ height: '220px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{producto.nombre}</h5>
                  <p className="card-text text-muted mb-1">Stock: {producto.stock} unidades</p>
                  <p className="card-text fw-bold text-success mb-3">${producto.precio.toLocaleString('es-CL')}</p>
                  <Link to={`/detalle/${producto.id}`} className="btn btn-dark mt-auto">
                    Ver detalle
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
// src/views/Nosotros.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Nosotros() {
  return (
    <main className="container my-5">
      {/* Encabezado / Intro */}
      <div className="text-center mb-5">
        <span className="badge bg-secondary mb-2">Tienda Mudra</span>
        <h1 className="fw-bold display-5">Ropa urbana para moverse con libertad</h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
          Tienda Mudra es una propuesta académica de comercio electrónico enfocada en prendas urbanas, funcionales y fáciles de combinar.
        </p>
      </div>

      {/* Bloques informativos */}
      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <div className="card h-100 shadow-sm p-4 border-0 bg-light">
            <h3 className="fw-bold h4 mb-3 text-dark">¿Qué hacemos?</h3>
            <p className="text-secondary mb-0">
              Mostramos un catálogo de polerones, pantalones y accesorios con información clara de precio, material y disponibilidad. El carrito permite preparar una compra antes de finalizarla.
            </p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100 shadow-sm p-4 border-0 bg-light">
            <h3 className="fw-bold h4 mb-3 text-dark">¿Cómo trabajamos?</h3>
            <p className="text-secondary mb-0">
              El proyecto usa HTML, CSS y JavaScript (migrado a React). La tienda y el panel administrativo comparten el mismo catálogo para que los cambios de inventario se reflejen en la experiencia del cliente.
            </p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100 shadow-sm p-4 border-0 bg-light">
            <h3 className="fw-bold h4 mb-3 text-dark">Equipo de desarrollo</h3>
            <p className="text-secondary mb-0">
              Proyecto desarrollado por un equipo de estudiantes de Desarrollo Full Stack, encargado del diseño visual, la implementación de la interfaz y las validaciones de cada flujo.
            </p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100 shadow-sm p-4 border-0 bg-light">
            <h3 className="fw-bold h4 mb-3 text-dark">Objetivo</h3>
            <ul className="text-secondary mb-0 ps-3">
              <li className="mb-2">Facilitar la navegación por el catálogo.</li>
              <li className="mb-2">Registrar compras simuladas con datos del cliente.</li>
              <li>Administrar productos y usuarios mediante roles.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Llamado a la acción */}
      <div className="text-center py-4 border-top">
        <h4 className="fw-bold mb-3">¿Quieres explorar nuestra colección?</h4>
        <Link to="/productos" className="btn btn-dark btn-lg px-4">
          Ver Productos
        </Link>
      </div>
    </main>
  );
}
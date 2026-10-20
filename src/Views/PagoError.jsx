// src/views/PagoError.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function PagoError() {
  return (
    <main className="container my-5 text-center">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm p-4 border-danger">
            <div className="mb-3 text-danger">
              {/* Icono de error / advertencia */}
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
              </svg>
            </div>

            <h2 className="fw-bold text-danger mb-2">Ocurrió un error con el pago</h2>
            <p className="text-muted mb-4">
              No hemos podido procesar tu solicitud de pago. Por favor, verifica los datos de tu tarjeta o intenta con otro método de pago.
            </p>

            <div className="alert alert-warning text-start mb-4" role="alert">
              <strong>Sugerencias:</strong>
              <ul className="mb-0 mt-2 ps-3">
                <li>Asegúrate de contar con los fondos suficientes.</li>
                <li>Verifica que la dirección de facturación sea correcta.</li>
                <li>Intenta nuevamente en unos momentos.</li>
              </ul>
            </div>

            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
              <Link to="/checkout" className="btn btn-danger btn-lg px-4 gap-3">
                Reintentar pago
              </Link>
              <Link to="/carrito" className="btn btn-outline-secondary btn-lg px-4">
                Volver al carrito
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
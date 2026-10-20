// src/views/PagoExitoso.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function PagoExitoso() {
  const [orden, setOrden] = useState(null);

  useEffect(() => {
    // Recupera los datos de la orden guardada en el Checkout
    const datosOrden = JSON.parse(localStorage.getItem('ultimaOrden'));
    if (datosOrden) {
      setOrden(datosOrden);
    }
  }, []);

  return (
    <main className="container my-5 text-center">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm p-4 border-success">
            <div className="mb-3 text-success">
              {/* Icono de check de éxito */}
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l5-5.25a.75.75 0 0 0-.019-1.06z"/>
              </svg>
            </div>
            
            <h2 className="fw-bold text-success mb-2">¡Pago Realizado con Éxito!</h2>
            <p className="text-muted mb-4">
              Gracias por tu compra en <strong>Tienda Mudra</strong>. Tu pedido ha sido procesado correctamente y ya estamos preparando tu despacho.
            </p>

            {orden && (
              <div className="bg-light p-3 rounded mb-4 text-start">
                <p className="mb-1"><strong>N° de Orden:</strong> #{orden.nroOrden}</p>
                <p className="mb-1"><strong>Cliente:</strong> {orden.cliente?.nombre} {orden.cliente?.apellidos}</p>
                <p className="mb-1"><strong>Correo:</strong> {orden.cliente?.correo}</p>
                <p className="mb-1"><strong>Comuna / Región:</strong> {orden.cliente?.comuna}, {orden.cliente?.region}</p>
                <hr />
                <p className="mb-0 fw-bold text-end text-success">
                  Total pagado: ${orden.total?.toLocaleString('es-CL')}
                </p>
              </div>
            )}

            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
              <Link to="/productos" className="btn btn-dark btn-lg px-4 gap-3">
                Seguir comprando
              </Link>
              <Link to="/" className="btn btn-outline-secondary btn-lg px-4">
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
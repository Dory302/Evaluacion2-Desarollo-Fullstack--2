// En src/Views/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const navigate = useNavigate();
  
  // 1. Inicializamos leyendo ÚNICAMENTE el carrito real del usuario
  const [carrito, setCarrito] = useState(() => {
    return JSON.parse(localStorage.getItem('mudraCarrito')) || [];
  });

  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    calle: '',
    depto: '',
    region: 'Región Metropolitana',
    comuna: 'Santiago',
    indicaciones: ''
  });

  // Calcular el total a pagar basándose solo en los productos reales
  const calcularTotal = () => {
    return carrito.reduce((acc, item) => acc + (Number(item.precio) * Number(item.cantidad)), 0);
  };

  const handlePagarExitoso = (e) => {
    e.preventDefault();
    if (carrito.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    // Guardar la orden para el panel de administración
    const nuevaOrden = {
      id: Date.now(),
      fecha: new Date().toLocaleDateString(),
      cliente: `${form.nombre} ${form.apellidos}`,
      correo: form.correo,
      productos: carrito,
      total: calcularTotal(),
      estado: 'Completado'
    };

    const ordenesAnteriores = JSON.parse(localStorage.getItem('mudraOrdenes')) || [];
    localStorage.setItem('mudraOrdenes', JSON.stringify([nuevaOrden, ...ordenesAnteriores]));

    // Limpiar el carrito
    localStorage.removeItem('mudraCarrito');

    // Redirigir a éxito
    navigate('/pago-exitoso');
  };

  const handlePagarError = () => {
    navigate('/pago-error');
  };

  return (
    <div className="container my-5" style={{ minHeight: '70vh' }}>
      <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border">
        <h2 className="fw-bold mb-4">Checkout / Carrito de compra</h2>

        {carrito.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted">No hay productos en el proceso de pago.</p>
            <button onClick={() => navigate('/productos')} className="btn btn-dark">Volver al catálogo</button>
          </div>
        ) : (
          <form onSubmit={handlePagarExitoso}>
            <div className="table-responsive mb-4">
              <table className="table align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {carrito.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <img 
                          src={item.imagen || item.img} 
                          alt={item.nombre} 
                          className="rounded" 
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                        />
                      </td>
                      <td className="fw-semibold">{item.nombre}</td>
                      <td>${Number(item.precio).toLocaleString('es-CL')}</td>
                      <td>{item.cantidad}</td>
                      <td className="fw-bold text-success">
                        ${(Number(item.precio) * Number(item.cantidad)).toLocaleString('es-CL')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-end bg-light p-3 rounded">
                <span className="fs-5 fw-bold">Total a pagar: ${calcularTotal().toLocaleString('es-CL')}</span>
              </div>
            </div>

            {/* Campos de información del cliente y dirección */}
            <h4 className="fw-bold mb-3">Información del cliente</h4>
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label className="form-label">Nombre *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={form.nombre} 
                  onChange={(e) => setForm({...form, nombre: e.target.value})} 
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Apellidos *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={form.apellidos} 
                  onChange={(e) => setForm({...form, apellidos: e.target.value})} 
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Correo *</label>
                <input 
                  type="email" 
                  className="form-control" 
                  required 
                  value={form.correo} 
                  onChange={(e) => setForm({...form, correo: e.target.value})} 
                />
              </div>
            </div>

            <h4 className="fw-bold mb-3">Dirección de entrega de los productos</h4>
            <div className="row g-3 mb-4">
              <div className="col-md-8">
                <label className="form-label">Calle *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ej. Los Crisantemos" 
                  required 
                  value={form.calle} 
                  onChange={(e) => setForm({...form, calle: e.target.value})} 
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Departamento (opcional)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ej. Depto 603" 
                  value={form.depto} 
                  onChange={(e) => setForm({...form, depto: e.target.value})} 
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Región *</label>
                <select 
                  className="form-select" 
                  value={form.region} 
                  onChange={(e) => setForm({...form, region: e.target.value})}
                >
                  <option value="Región Metropolitana">Región Metropolitana</option>
                  <option value="Región de Valparaíso">Región de Valparaíso</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Comuna *</label>
                <select 
                  className="form-select" 
                  value={form.comuna} 
                  onChange={(e) => setForm({...form, comuna: e.target.value})}
                >
                  <option value="Santiago">Santiago</option>
                  <option value="Puente Alto">Puente Alto</option>
                  <option value="Maipú">Maipú</option>
                </select>
              </div>
            </div>

            {/* Botones de acción de pago */}
            <div className="d-flex justify-content-between align-items-center mt-4">
              <button 
                type="button" 
                onClick={handlePagarError} 
                className="btn btn-outline-danger"
              >
                Simular Pago con Error
              </button>
              <button 
                type="submit" 
                className="btn btn-success btn-lg text-white fw-semibold"
              >
                Pagar ahora ${calcularTotal().toLocaleString('es-CL')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
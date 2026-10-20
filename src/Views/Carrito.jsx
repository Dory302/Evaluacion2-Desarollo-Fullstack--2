// src/Views/Carrito.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productosIniciales } from '../data/datos';

export default function Carrito() {
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState([]);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Cargar productos del catálogo
    const prodGuardados = JSON.parse(localStorage.getItem('mudraProductos')) || productosIniciales;
    setProductos(prodGuardados);

    // Cargar productos del carrito
    const carritoGuardado = JSON.parse(localStorage.getItem('mudraCarrito')) || [];
    setCarrito(carritoGuardado);
  }, []);

  const guardarCarrito = (nuevoCarrito) => {
    setCarrito(nuevoCarrito);
    localStorage.setItem('mudraCarrito', JSON.stringify(nuevoCarrito));
    window.dispatchEvent(new Event('storage'));
  };

  const agregarAlCarrito = (producto) => {
    let nuevoCarrito = [...carrito];
    const indice = nuevoCarrito.findIndex(item => String(item.id) === String(producto.id));

    if (indice !== -1) {
      nuevoCarrito[indice].cantidad += 1;
    } else {
      nuevoCarrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen || producto.img,
        cantidad: 1
      });
    }
    guardarCarrito(nuevoCarrito);
  };

  const incrementarCantidad = (id) => {
    const nuevoCarrito = carrito.map(item => {
      if (String(item.id) === String(id)) {
        return { ...item, cantidad: item.cantidad + 1 };
      }
      return item;
    });
    guardarCarrito(nuevoCarrito);
  };

  const decrementarCantidad = (id) => {
    const nuevoCarrito = carrito.map(item => {
      if (String(item.id) === String(id) && item.cantidad > 1) {
        return { ...item, cantidad: item.cantidad - 1 };
      }
      return item;
    });
    guardarCarrito(nuevoCarrito);
  };

  const eliminarProducto = (id) => {
    const nuevoCarrito = carrito.filter(item => String(item.id) !== String(id));
    guardarCarrito(nuevoCarrito);
  };

  const limpiarCarrito = () => {
    guardarCarrito([]);
  };

  const calcularTotal = () => {
    return carrito.reduce((acc, item) => acc + (Number(item.precio) * Number(item.cantidad)), 0);
  };

  return (
    <div className="container-fluid my-4 px-4" style={{ minHeight: '80vh' }}>
      <div className="bg-white p-4 rounded-4 shadow-sm border">
        
        {/* Banner Informativo Superior (Igual al de la pauta) */}
        <div className="alert alert-primary alert-dismissible fade show d-flex align-items-center justify-content-between mb-4" role="alert">
          <div>
            <strong>¡Vista Carrito de compra!</strong> Esta vista fue diseñada para aprender y demostrar la implementación mediante JS del carrito de compra.
            <br />
            <small className="text-muted">La información es obtenida mediante JS y almacenada en LocalStorage.</small>
          </div>
        </div>

        <div className="row g-4">
          
          {/* Columna Izquierda: Lista de productos */}
          <div className="col-lg-5 col-xl-5">
            <h4 className="fw-bold mb-3">Lista de productos</h4>
            <div className="row g-3" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {productos.map((prod) => (
                <div key={prod.id} className="col-6 col-sm-6 col-md-4 col-lg-6">
                  <div className="card h-100 border text-center p-2 rounded-3 shadow-xs">
                    <img
                      src={prod.imagen || prod.img}
                      alt={prod.nombre}
                      className="card-img-top rounded mb-2"
                      style={{ height: '120px', objectFit: 'cover' }}
                    />
                    <h6 className="fw-bold mb-1 small text-truncate">{prod.nombre}</h6>
                    <small className="text-muted d-block mb-1">Stock: {prod.stock}</small>
                    <span className="fw-bold text-warning mb-2 d-block">
                      ${Number(prod.precio).toLocaleString('es-CL')}
                    </span>
                    <button
                      onClick={() => agregarAlCarrito(prod)}
                      className="btn btn-dark btn-sm w-100 fw-semibold"
                    >
                      Añadir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Columna Derecha: Carrito de Compras */}
          <div className="col-lg-7 col-xl-7">
            <h4 className="fw-bold mb-3">Carrito de Compras</h4>
            
            {carrito.length === 0 ? (
              <div className="text-center py-5 border rounded-3 bg-light">
                <p className="text-muted mb-0">El carrito de compras está vacío.</p>
              </div>
            ) : (
              <div>
                <div className="table-responsive mb-3">
                  <table className="table align-middle text-center small">
                    <thead className="table-light fw-bold">
                      <tr>
                        <th>Imagen</th>
                        <th className="text-start">Nombre</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {carrito.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <img
                              src={item.imagen || item.img}
                              alt={item.nombre}
                              className="rounded"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                          </td>
                          <td className="text-start fw-semibold">{item.nombre}</td>
                          <td>${Number(item.precio).toLocaleString('es-CL')}</td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center gap-1">
                              <button
                                className="btn btn-outline-secondary btn-sm px-2 py-0"
                                onClick={() => decrementarCantidad(item.id)}
                              >
                                -
                              </button>
                              <span className="fw-bold px-1">{item.cantidad}</span>
                              <button
                                className="btn btn-outline-secondary btn-sm px-2 py-0"
                                onClick={() => incrementarCantidad(item.id)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="fw-bold">
                            ${(Number(item.precio) * Number(item.cantidad)).toLocaleString('es-CL')}
                          </td>
                          <td>
                            <button
                              onClick={() => eliminarProducto(item.id)}
                              className="btn btn-danger btn-sm px-2 py-1"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total y Botones de Acción inferior */}
                <div className="text-end mb-3">
                  <span className="fs-5 fw-bold me-2">Total:</span>
                  <span className="fs-5 fw-bold text-dark">${calcularTotal().toLocaleString('es-CL')}</span>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    onClick={limpiarCarrito}
                    className="btn btn-secondary px-4 fw-semibold"
                  >
                    Limpiar
                  </button>
                  <button
                    onClick={() => navigate('/checkout')}
                    className="btn btn-success px-4 fw-semibold"
                  >
                    Comprar ahora
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
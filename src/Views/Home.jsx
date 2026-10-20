// src/Views/Home.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="container my-5" style={{ minHeight: '75vh' }}>
      {/* Sección principal / Hero */}
      <div 
        className="p-5 mb-5 rounded-4 shadow-sm bg-white text-dark position-relative border"
        style={{ zIndex: 10 }}
      >
        <div className="container-fluid py-4">
          <h1 className="display-5 fw-bold mb-3">ROPA URBANA & STREETWEAR</h1>
          <p className="fs-5 text-secondary mb-4" style={{ maxWidth: '700px' }}>
            Encuentra las mejores prendas de vestir, polerones oversize, pantalones cargo y accesorios de moda urbana.
          </p>
          <Link to="/productos" className="btn btn-dark btn-lg px-4 fw-semibold">
            Ver productos
          </Link>
        </div>
      </div>

      {/* Sección de Categorías Destacadas con Imágenes */}
      <div className="position-relative" style={{ zIndex: 10 }}>
        <h3 className="text-center fw-bold mb-4 text-dark">Categorías Destacadas</h3>
        
        <div className="row g-4 justify-content-center">
          
          {/* Cuadro 1: Polerones */}
          <div className="col-md-4">
            <div 
              className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden text-center bg-white cursor-pointer"
              onClick={() => navigate('/productos')}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ height: '180px', overflow: 'hidden' }}>
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSTt2Y6t0-9FY60nDY8MUmk_99Tbw8pxxR1MTjNCfQcg&s=10" 
                  alt="Polerones" 
                  className="w-100 h-100 object-fit-cover"
                />
              </div>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-2">Polerones</h5>
                <p className="text-secondary small mb-0">Estilo y comodidad.</p>
              </div>
            </div>
          </div>

          {/* Cuadro 2: Pantalones */}
          <div className="col-md-4">
            <div 
              className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden text-center bg-white"
              onClick={() => navigate('/productos')}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ height: '180px', overflow: 'hidden' }}>
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRMkgRXffxVzlFd3ditJA-mVDHek44FfC7dpLMm5YtrQ&s=10" 
                  alt="Pantalones" 
                  className="w-100 h-100 object-fit-cover"
                />
              </div>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-2">Pantalones</h5>
                <p className="text-secondary small mb-0">Diseños cargo y jogger.</p>
              </div>
            </div>
          </div>

          {/* Cuadro 3: Accesorios */}
          <div className="col-md-4">
            <div 
              className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden text-center bg-white"
              onClick={() => navigate('/productos')}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ height: '180px', overflow: 'hidden' }}>
                <img 
                  src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60" 
                  alt="Accesorios" 
                  className="w-100 h-100 object-fit-cover"
                />
              </div>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-2">Accesorios</h5>
                <p className="text-secondary small mb-0">Complementa tu look.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
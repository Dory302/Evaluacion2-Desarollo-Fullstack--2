// src/components/navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header>
      <div className="header-logo">
        <Link to="/" className="d-flex align-items-center text-decoration-none text-dark">
          <img 
            src="https://media.istockphoto.com/id/1284317580/es/vector/tienda-de-ropa-sobre-fondo-transparente.jpg?s=612x612&w=0&k=20&c=_L045ukqBMIRYM-7NVbwAzTmk0ihPDzhkB1lwecSsU4=" 
            alt="Logo Tienda Mudra" 
            className="img-logo me-2" 
            style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <span className="fw-bold fs-5">Tienda Mudra</span>
        </Link>
      </div>

      <nav>
        <Link to="/">Home</Link> |{' '}
        <Link to="/productos">Productos</Link> |{' '}
        <Link to="/nosotros">Nosotros</Link> |{' '}
        <Link to="/blogs">Blogs</Link> |{' '}
        <Link to="/contacto">Contacto</Link>
      </nav>

      <div className="header-acciones">
        {/* Botón de Carrito de Compras */}
        <Link to="/carrito" className="btn btn-outline-dark me-2">
          🛒 Carrito
        </Link>

        {/* Cuentas / Autenticación */}
        <div className="header-cuenta" data-cuenta-header>
          <Link className="header-cuenta__inicio" to="/login">Iniciar sesión</Link>
          <Link className="header-cuenta__crear" to="/registro">Crear cuenta</Link>
        </div>
      </div>
    </header>
  );
}
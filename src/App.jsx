// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importamos los componentes fijos
import Navbar from './components/navbar';
import Footer from './components/footer';

// Importamos las vistas
import Home from './Views/Home';
import Productos from './Views/Productos';
import DetalleProducto from './Views/DetalleProducto';
import Carrito from './Views/Carrito';
import Categoria from './Views/Categoria';
import Checkout from './Views/Checkout';
import PagoExitoso from './Views/PagoExitoso';
import PagoError from './Views/PagoError';
import Contacto from './Views/Contacto';
import Login from './Views/Login';
import Registro from './Views/Registro';
import Nosotros from './Views/Nosotros';
import Blogs from './Views/Blogs';
import DetalleBlog from './Views/DetalleBlog';
import AdminDashboard from './admin/AdminDashboard';
import AdminOrdenes from './admin/AdminOrdenes';
import AdminProductos from './admin/AdminProductos';
import AdminUsuarios from './admin/AdminUsuarios';
import Ofertas from './Views/Ofertas';

export default function App() {
  return (
    <Router>
      {/* El Navbar se mantiene fijo arriba en todas las páginas */}
      <Navbar />

      {/* Aquí cambian las vistas según la ruta */}
      <div style={{ minHeight: '70vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Aquí iremos agregando las demás rutas (Productos, Carrito, Checkout, Admin, etc.) */}
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:id" element={<DetalleProducto />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/categorias" element={<Categoria />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pago-exitoso" element={<PagoExitoso />} />
          <Route path="/pago-error" element={<PagoError />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/iniciar-sesion" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<DetalleBlog />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/ordenes" element={<AdminOrdenes />} />
          <Route path="/admin/productos" element={<AdminProductos />} />
          <Route path="/admin/usuarios" element={<AdminUsuarios />} />
          <Route path="/ofertas" element={<Ofertas />} />
        </Routes>
      </div>

      {/* El Footer se mantiene fijo abajo en todas las páginas */}
      <Footer />
    </Router>
  );
}
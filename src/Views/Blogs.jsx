// src/views/Blogs.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { blogsData } from '../data/blogsData';

export default function Blogs() {
  return (
    <main className="container my-5">
      {/* Encabezado */}
      <div className="text-center mb-5">
        <span className="badge bg-secondary mb-2">Blog Mudra</span>
        <h1 className="fw-bold display-5">Historias que nacen en la calle</h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
          Ideas, referencias y datos curiosos para entender mejor la ropa urbana que usamos todos los días.
        </p>
      </div>

      {/* Grilla de Artículos */}
      <div className="row g-4">
        {blogsData.map((blog) => (
          <div className="col-md-6" key={blog.id}>
            <div className="card h-100 shadow-sm border-0">
              <img
                src={blog.imagen}
                className="card-img-top"
                alt={blog.alt}
                style={{ height: '260px', objectFit: 'cover' }}
              />
              <div className="card-body d-flex flex-column p-4">
                <span className="badge bg-light text-dark border align-self-start mb-2">
                  {blog.categoria}
                </span>
                <h3 className="card-title fw-bold h4 mb-3">{blog.titulo}</h3>
                <p className="card-text text-muted mb-4">{blog.resumen}</p>
                <Link to={`/blogs/${blog.id}`} className="btn btn-outline-dark mt-auto align-self-start">
                  Leer artículo →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
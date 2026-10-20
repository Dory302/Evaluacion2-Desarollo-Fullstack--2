// src/views/DetalleBlog.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogsData } from '../data/blogsData';

export default function DetalleBlog() {
  const { id } = useParams();
  const blog = blogsData.find((b) => b.id === parseInt(id));

  if (!blog) {
    return (
      <main className="container my-5 text-center">
        <h2>Artículo no encontrado</h2>
        <p className="text-muted">El artículo que estás buscando no existe o fue removido.</p>
        <Link to="/blogs" className="btn btn-dark mt-3">
          ← Volver a Blogs
        </Link>
      </main>
    );
  }

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Botón Volver */}
          <Link to="/blogs" className="btn btn-link text-dark p-0 mb-4 text-decoration-none fw-semibold">
            ← Volver a Blogs
          </Link>

          <article>
            {/* Encabezado del Detalle */}
            <header className="mb-4">
              <span className="badge bg-secondary mb-2">{blog.categoria}</span>
              <h1 className="fw-bold display-5 mb-3">{blog.titulo}</h1>
              <p className="lead text-muted">{blog.subtitulo}</p>
            </header>

            {/* Imagen Principal */}
            <figure className="figure mb-4 w-100">
              <img
                src={blog.imagen}
                className="figure-img img-fluid rounded w-100 shadow-sm"
                alt={blog.alt}
                style={{ maxHeight: '450px', objectFit: 'cover' }}
              />
              {blog.pieImagen && (
                <figcaption className="figure-caption text-center mt-2">
                  {blog.pieImagen}
                </figcaption>
              )}
            </figure>

            {/* Cuerpo del Artículo */}
            <div className="content-body fs-5 text-secondary">
              {blog.contenido.map((parrafo, index) => (
                <p key={index} className="mb-4" style={{ lineHeight: '1.8' }}>
                  {parrafo}
                </p>
              ))}
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
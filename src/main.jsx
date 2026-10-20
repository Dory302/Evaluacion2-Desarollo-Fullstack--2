import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// 1. Importa Bootstrap y su JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// 2. Tus estilos personalizados (index.css para la tienda, App.css para el admin)
import './estilo.css'
import './admin.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
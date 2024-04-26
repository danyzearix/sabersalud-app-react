import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; // Importamos el proveedor de contexto de autenticación
import './index.css';
import "./Fonts/fonts.css"

// Envolvemos App con el proveedor de contexto de autenticación
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import Home from './Components/Home/Home';
import Certificados from './Components/Certificados/Certificados';
import CertificadosSer from './Components/CertificadosSer/CertificadosSer';
import CertificadosEstetica from './Components/CertificadosEstetica/CertificadosEstetica';
import FormularioRegistro from './Components/FormularioRegistro/FormularioRegistro';
import ClientesLista from './Components/ClientesLista/ClientesLista';
import Validacion from './Components/Validacion/Validacion';
import Login from './Components/Login/Login';
import "./App.css";

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RequireAuth><Layout><Home></Home></Layout></RequireAuth>} />
        <Route path="/certificados" element={<RequireAuth><Layout><Certificados /></Layout></RequireAuth>} />
        <Route path="/certificados-estetica" element={<RequireAuth><Layout><CertificadosEstetica /></Layout></RequireAuth>} />
        <Route path="/certificados-ser" element={<RequireAuth><Layout><CertificadosSer /></Layout></RequireAuth>} />
        <Route path="/clientes" element={<RequireAuth><Layout><ClientesLista /></Layout></RequireAuth>} />
        <Route path="/formulario-registro" element={<FormularioRegistro />} />
        <Route path="/validacion" element={<Validacion />} />
      </Routes>
    </Router>
  );
};

export default App;


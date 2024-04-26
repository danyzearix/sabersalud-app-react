import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import Certificados from './Components/Certificados/Certificados';
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
        <Route path="/clientes" element={<RequireAuth><Layout><ClientesLista /></Layout></RequireAuth>} />
        <Route path="/formulario-registro" element={<FormularioRegistro />} />
        <Route path="/validacion" element={<Validacion />} />
      </Routes>
    </Router>
  );
};

// Suponiendo que tienes un componente para la página de inicio

const Home = () => {
  const cardData = [
    { name: "Certificados SaberSalud", icon: "/certificado-sabersalud.png" },
    { name: "Certificados Estética", icon: "/certificado-estetica.png" },
    { name: "Lista de Clientes", icon: "/lista-clientes.png" },
    { name: "Agregar Cliente", icon: "/agregar-cliente.png" },
    { name: "Reportes", icon: "/reportes.png" }
  ];

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 p-5">
      <h1 className="text-center text-4xl mb-10 font-bold">¡Bienvenido al aplicativo SaberSalud!</h1>
      {/* Contenedor de tarjetas con flex-wrap y centrado horizontal */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
        {cardData.map((card, index) => (
          <div key={index} className="flex flex-col items-center justify-center p-6 bg-[#0049CC] text-white rounded-lg shadow-md hover:bg-[#003DA5] transition-colors w-72 h-48">
            <img src={card.icon} alt={card.name} className="mb-4 h-16 w-16" />
            <p className='font-bold'>{card.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};



export default App;


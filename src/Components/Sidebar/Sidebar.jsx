import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../../public/Logo.png";
import { AuthContext } from '../../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);

  const handleLogout = () => {
    // Eliminar el token del almacenamiento local
    localStorage.removeItem('token');
    // Eliminar el token del contexto
    setToken(null);
    // Redireccionar al usuario al inicio de sesión
    navigate('/login');
  };

  return (
    <div className="bg-gray-800 h-screen text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      
      {/* Logo */}
      <a href="#" className="flex items-center px-4">
        <img src={logo} alt="Logo de Lexa" className="h-8 w-auto" />
      </a>

      {/* Nav Items */}
      <nav>
        <a href="https://app.sabersalud.co/" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white font-bold">
          Inicio 🏠</a>
        <a href="https://app.sabersalud.co/certificados" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white font-bold">
          Certificados SaberSalud 🩺
        </a>
        <a href="https://app.sabersalud.co/certificados-estetica" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white font-bold">
          Certificados SaberEstetica 💅
        </a>
        <a href="https://app.sabersalud.co/certificados-ser" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white font-bold">
          Certificados SaberSer 🌀
        </a>
        <a href="https://app.sabersalud.co/formulario-registro" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white font-bold" target="_blank">
          Crear cliente 💾
        </a>
        <a href="https://app.sabersalud.co/clientes" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white font-bold">
          Lista de clientes 👩‍⚕️</a>
        {/* Botón de cerrar sesión */}
        <button onClick={handleLogout} className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white font-bold">
          Cerrar sesión
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;


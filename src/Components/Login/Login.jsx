import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate(); // Obtenemos la función navigate de React Router
  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', {
          email,
          password
        });
  
        if (response.data.token) {
          // Guardamos el token en el localStorage
          localStorage.setItem('token', response.data.token);
  
          // Mostramos mensaje de éxito con SweetAlert
          Swal.fire({
            icon: 'success',
            title: 'Inicio de sesión exitoso',
            text: '¡Bienvenido de nuevo!',
            showConfirmButton: false,
            timer: 1500
          });
  
          // Redireccionamos a otra ruta después del inicio de sesión
          navigate('/');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error de inicio de sesión',
            text: 'Credenciales incorrectas. Por favor, inténtalo de nuevo.'
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error de inicio de sesión',
          text: error.response.data.mensaje || 'Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.'
        });
      }
    };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Iniciar Sesión</button>
        </form>
      </div>
    </div>
  );
};

export default Login;

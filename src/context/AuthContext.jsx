import React, { createContext, useState } from 'react';

// Creamos el contexto de autenticación
const AuthContext = createContext();

// Creamos un proveedor para el contexto de autenticación
const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null); // Estado para almacenar el token

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

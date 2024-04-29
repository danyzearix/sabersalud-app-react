import React, { useState } from 'react';
import axios from 'axios';

function Validacion() {
  const [numeroId, setNumeroId] = useState('');
  const [estudiante, setEstudiante] = useState(null);
  const [error, setError] = useState('');

  const consultarEstudiante = async () => {
    try {
      const response = await axios.get(`https://sabersalud-backend-e0a3010fab41.herokuapp.com/api/estudiantes/numeroId/${numeroId}`);
      console.log("Respuesta de la API:", response.data);
      setEstudiante(response.data);  // Asumiendo que la API devuelve directamente el estudiante.
      setError('');
    } catch (err) {
      setError('Estudiante no encontrado o error en la consulta');
      setEstudiante(null);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-center text-lg font-bold">VALIDAR CERTIFICADO</h1>
      <p className="text-center mt-4">Por favor ingresa el número de documento o NIT a validar:</p>
      <div className="mt-4 flex justify-center">
        <input 
          type="text" 
          placeholder="Número de Documento/NIT" 
          value={numeroId} 
          onChange={e => setNumeroId(e.target.value)} 
          className="border p-2 rounded"
        />
        <button 
          onClick={consultarEstudiante} 
          className="bg-blue-500 text-white p-2 ml-2 rounded"
        >
          Consultar
        </button>
      </div>
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      {estudiante && (
        <div className="mt-4 text-center">
        <h2 className="text-lg font-semibold">Resultado:</h2>
        <p>Nombre: {estudiante.nombres} {estudiante.apellidos}</p>
        <h3 className="font-medium">Cursos:</h3>
        {estudiante.cursos.map((curso, index) => (
          <div key={index}>
            {/* Añade un margen abajo si hay más de un curso para separarlos visualmente */}
            <div className={index < estudiante.cursos.length - 1 ? "mb-4" : ""}>
              <p className="font-bold text-[#023047]">{curso.nombreCurso}</p>
              <p className="font-bold text-[#023047]">
  Fecha de expedición: {
    (() => {
      const fechaISO = curso.vencimiento; // Asume que 'curso.vencimiento' tiene el formato "2024-04-16T00:00:00.000Z"
      const fecha = new Date(fechaISO);
      // Crear una nueva fecha asumiendo que la fecha obtenida es UTC
      const fechaLocalComoUTC = new Date(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate());
      // Formatear la fecha a un formato local legible
      return fechaLocalComoUTC.toLocaleDateString('es-ES'); // Ajusta 'es-ES' según tu localidad
    })()
  }
</p>
              {/* Solo agrega hr si no es el último curso */}
              {index < estudiante.cursos.length - 1 && <hr className="border-t-[1px] border-gray-300 mx-auto w-1/2" />}
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}

export default Validacion;

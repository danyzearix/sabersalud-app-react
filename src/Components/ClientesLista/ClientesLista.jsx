import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClientesLista = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [filtroNumeroId, setFiltroNumeroId] = useState('');
    const [filtroNombre, setFiltroNombre] = useState('');

    // Función para cargar todos los estudiantes
    const cargarTodosLosEstudiantes = async () => {
        try {
            const response = await axios.get('https://sabersalud-backend-e0a3010fab41.herokuapp.com/api/estudiantes');
            setEstudiantes(response.data);
        } catch (error) {
            console.error('Error al cargar los estudiantes:', error);
        }
    };

    // Función para filtrar estudiantes en tiempo real
    const filtrarEstudiantes = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/estudiantes?numeroId=${filtroNumeroId}&nombre=${filtroNombre}`);
            setEstudiantes(response.data);
        } catch (error) {
            console.error('Error al filtrar los estudiantes:', error);
        }
    };

    useEffect(() => {
        cargarTodosLosEstudiantes();
    }, []);

    return (
        <div className='container mx-auto px-4'>
            <div className='flex gap-4 mb-4'>
    <input
        type="text"
        placeholder="Filtrar por número de ID"
        className="input input-bordered w-full max-w-xs form-input rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={filtroNumeroId}
        onChange={(e) => setFiltroNumeroId(e.target.value)}
        onKeyUp={filtrarEstudiantes}
    />
    <input
        type="text"
        placeholder="Filtrar por nombre"
        className="input input-bordered w-full max-w-xs form-input rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={filtroNombre}
        onChange={(e) => setFiltroNombre(e.target.value)}
        onKeyUp={filtrarEstudiantes}
    />
    <button
        className="btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm hover:shadow-md"
        onClick={cargarTodosLosEstudiantes}
    >
        Ver todos
    </button>
</div>
            <table className='table w-full border-collapse shadow-lg'>
    <thead className='bg-gray-100'>
        <tr>
            <th className='border p-4'>Nombre</th>
            <th className='border p-4'>Número de Identificación</th>
            <th className='border p-4'>Cursos</th>
        </tr>
    </thead>
    <tbody>
        {estudiantes.map((estudiante, index) => (
            <tr key={index} className='hover:bg-gray-50'>
                <td className='border p-4'>{estudiante.nombres} {estudiante.apellidos}</td>
                <td className='border p-4'>{estudiante.numeroId}</td>
                <td className='border p-4'>
                    {estudiante.cursos.map((curso, i) => (
                        <div key={i}>
                            <div>{curso.nombreCurso}</div>
                            <div className='text-gray-600 text-sm'>{new Date(curso.vencimiento).toLocaleDateString()}</div>
                        </div>
                    ))}
                </td>
            </tr>
        ))}
    </tbody>
</table>
        </div>
    );
};

export default ClientesLista;

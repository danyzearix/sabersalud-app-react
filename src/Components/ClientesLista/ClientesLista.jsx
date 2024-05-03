import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ClientesLista = () => {
    const [todosEstudiantes, setTodosEstudiantes] = useState([]);  // Almacena todos los estudiantes
    const [estudiantes, setEstudiantes] = useState([]);            // Almacena estudiantes filtrados para mostrar
    const [filtroNumeroId, setFiltroNumeroId] = useState('');
    const [pagina, setPagina] = useState(1);

    const cargarEstudiantesPaginados = async () => {
        try {
            const response = await axios.get(`https://sabersalud-backend-e0a3010fab41.herokuapp.com/api/estudiantes?page=${pagina}&limit=10`);
            setTodosEstudiantes(response.data);
            setEstudiantes(response.data); // Inicialmente, mostramos todos los estudiantes
        } catch (error) {
            console.error('Error al cargar los estudiantes:', error);
        }
    };

    // Filtra estudiantes en el cliente por número de ID
    const filtrarEstudiantesPorNumeroId = () => {
        const filtrados = todosEstudiantes.filter(estudiante => 
            estudiante.numeroId.includes(filtroNumeroId)
        );
        setEstudiantes(filtrados);
    };

    const mostrarDetalles = (estudiante) => {
        Swal.fire({
            title: `${estudiante.nombres} ${estudiante.apellidos}`,
            html: `
                <p><b>Email:</b> ${estudiante.email}</p>
                <p><b>Número de documento:</b> ${estudiante.numeroId}</p>
                <p><b>Celular:</b> ${estudiante.celular}</p>
                <p><b>Celular Adicional:</b> ${estudiante.celularAdicional}</p>
                <p><b>Ciudad:</b> ${estudiante.ciudadResidencia}</p>
                <p><b>Dirección:</b> ${estudiante.direccion}</p>
                <p><b>Apodo:</b> ${estudiante.comoTeGustariaQueTeLlamen}</p>
                <p><b>Cursos:</b> ${estudiante.cursos.map(curso => curso.nombreCurso).join(', ')}</p>
            `,
            icon: 'info'
        });
    };

    useEffect(() => {
        cargarEstudiantesPaginados();
    }, [pagina]);

    return (
        <div className='container mx-auto px-4'>
            <div className='flex gap-4 mb-4'>
                <input
                    type="text"
                    placeholder="Filtrar por número de ID"
                    className="input input-bordered w-full max-w-xs"
                    value={filtroNumeroId}
                    onChange={(e) => setFiltroNumeroId(e.target.value)}
                />
                <button
                    className="btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                    onClick={filtrarEstudiantesPorNumeroId}
                >
                    Buscar
                </button>
            </div>
            <table className='table w-full border-collapse shadow-lg'>
                <thead className='bg-gray-100'>
                    <tr>
                        <th className='border p-4'>Nombre</th>
                        <th className='border p-4'>Número de Identificación</th>
                        <th className='border p-4'>Cursos</th>
                        <th className='border p-4'>Acciones</th>
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
                            <td className='border p-4'>
                                <button
                                    className="btn bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded-lg"
                                    onClick={() => mostrarDetalles(estudiante)}
                                >
                                    Ver Información
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ClientesLista;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

const ClientesLista = () => {
    const [todosEstudiantes, setTodosEstudiantes] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [filtroNumeroId, setFiltroNumeroId] = useState('');
    const [pagina, setPagina] = useState(1);

    // Cargar estudiantes paginados desde la API
    const cargarEstudiantesPaginados = async () => {
        try {
            const response = await axios.get(`https://sabersalud-backend-e0a3010fab41.herokuapp.com/api/estudiantes?page=${pagina}&limit=10`);
            setTodosEstudiantes(response.data);
            setEstudiantes(response.data);  // Se cargan los estudiantes completos para filtrar
        } catch (error) {
            console.error('Error al cargar los estudiantes:', error);
        }
    };

    // Filtrar estudiantes por número de identificación
    const filtrarEstudiantesPorNumeroId = () => {
        if (!filtroNumeroId) {
            setEstudiantes(todosEstudiantes);  // Si el filtro está vacío, muestra todos los estudiantes
            return;
        }

        const filtrados = todosEstudiantes.filter(estudiante => {
            return estudiante.numeroId && estudiante.numeroId.includes(filtroNumeroId);  // Verifica que el número de ID exista y luego usa includes
        });
        setEstudiantes(filtrados);
    };

    // Descargar la base de datos como archivo Excel
    const descargarBaseDatos = async () => {
        try {
            const response = await axios.get('https://sabersalud-backend-e0a3010fab41.herokuapp.com/api/estudiantes');
            const estudiantesData = response.data;

            // Transformar los cursos en cadenas de texto
            const estudiantesConCursos = estudiantesData.map(estudiante => {
                const cursosTexto = estudiante.cursos.map(curso => 
                    `${curso.nombreCurso} (Vencimiento: ${new Date(curso.vencimiento).toLocaleDateString()})`
                ).join(', ');
                return {
                    ...estudiante,
                    cursos: cursosTexto  // Reemplaza el array de cursos por el string resultante
                };
            });

            // Crear y descargar el archivo Excel
            const worksheet = XLSX.utils.json_to_sheet(estudiantesConCursos);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Estudiantes');
            XLSX.writeFile(workbook, 'estudiantes.xlsx');
        } catch (error) {
            console.error('Error al descargar la base de datos:', error);
        }
    };

    // Mostrar detalles de un estudiante
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
                <p><b>Profesión:</b> ${estudiante.profesion}</p>
            `,
            icon: 'info'
        });
    };

    // Editar los detalles de un estudiante
    const editarEstudiante = (estudiante) => {
        Swal.fire({
            title: `Editar ${estudiante.nombres} ${estudiante.apellidos}`,
            html: `
                <input id="nombres" class="swal2-input" placeholder="Nombres" value="${estudiante.nombres}">
                <input id="apellidos" class="swal2-input" placeholder="Apellidos" value="${estudiante.apellidos}">
                <input id="email" class="swal2-input" placeholder="Email" value="${estudiante.email}">
                <input id="numeroId" class="swal2-input" placeholder="Número de documento" value="${estudiante.numeroId}">
                <input id="celular" class="swal2-input" placeholder="Celular" value="${estudiante.celular}">
                <input id="celularAdicional" class="swal2-input" placeholder="Celular adicional" value="${estudiante.celularAdicional}">
                <input id="ciudadResidencia" class="swal2-input" placeholder="Ciudad" value="${estudiante.ciudadResidencia}">
                <input id="direccion" class="swal2-input" placeholder="Dirección" value="${estudiante.direccion}">
                <input id="comoTeGustariaQueTeLlamen" class="swal2-input" placeholder="Apodo" value="${estudiante.comoTeGustariaQueTeLlamen}">
            `,
            confirmButtonText: 'Guardar Cambios',
            focusConfirm: false,
            preConfirm: () => {
                return {
                    nombres: Swal.getPopup().querySelector('#nombres').value,
                    apellidos: Swal.getPopup().querySelector('#apellidos').value,
                    email: Swal.getPopup().querySelector('#email').value,
                    numeroId: Swal.getPopup().querySelector('#numeroId').value,
                    celular: Swal.getPopup().querySelector('#celular').value,
                    celularAdicional: Swal.getPopup().querySelector('#celularAdicional').value,
                    ciudadResidencia: Swal.getPopup().querySelector('#ciudadResidencia').value,
                    direccion: Swal.getPopup().querySelector('#direccion').value,
                    comoTeGustariaQueTeLlamen: Swal.getPopup().querySelector('#comoTeGustariaQueTeLlamen').value
                };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                actualizarEstudiante(estudiante._id, result.value);
            }
        });
    };

    // Actualizar los datos de un estudiante
    const actualizarEstudiante = async (id, datos) => {
        try {
            await axios.put(`https://sabersalud-backend-e0a3010fab41.herokuapp.com/api/estudiantes/${id}`, datos);
            Swal.fire('¡Actualizado!', 'Los datos del estudiante han sido actualizados.', 'success');
            cargarEstudiantesPaginados();  // Recargar los estudiantes para reflejar los cambios
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar la información del estudiante.', 'error');
        }
    };

    // Efecto para cargar los estudiantes paginados cuando se cambia de página
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
            <button
                className="btn bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg mb-4"
                onClick={descargarBaseDatos}
            >
                Descargar Base de Datos
            </button>
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
                            <td className='border p-4 text-center'>
                                <button
                                    className="btn bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded-lg mr-2 mb-1"
                                    onClick={() => mostrarDetalles(estudiante)}
                                >
                                    Ver 
                                </button>
                                <button
                                    className="btn bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded-lg"
                                    onClick={() => editarEstudiante(estudiante)}
                                >
                                    Editar
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

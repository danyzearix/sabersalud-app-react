import React, { useState } from 'react';
import axios from 'axios';
import './FormularioRegistro.css';
import banner from "../../../public/banner-registro.jpg"
import Swal from 'sweetalert2';

const FormularioRegistro = () => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    edad: '',
    gradoEscolaridad: '',
    profesion: '',
    celular: '',
    celularAdicional: '', 
    comoTeGustariaQueTeLlamen: '', 
    ciudadResidencia: '',
    direccion: '',
    tipoIdentificacion: '',
    numeroId: '',
    cursos: []
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Mostrar SweetAlert para confirmación antes de enviar
    Swal.fire({
      title: 'Verifica tus datos',
      text: 'Por favor, verifica que todos tus datos sean correctos antes de enviar el formulario.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Enviar datos',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true); // Activa el indicador de carga
        sendFormData(); // Llama a sendFormData solo si se confirma la acción
      }
    });
  };
  
  const sendFormData = async () => {
    try {
      const response = await axios.post('https://sabersalud-backend-e0a3010fab41.herokuapp.com/api/estudiantes', formData);
      Swal.fire({
        icon: 'success',
        title: '¡Tu registro ha sido exitoso!',
        text: 'Informa al asesor para continuar el proceso 📲',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
      // Restablecer formData a su estado inicial
      setFormData({
        nombres: '',
        apellidos: '',
        email: '',
        edad: '',
        gradoEscolaridad: '',
        profesion: '',
        celular: '',
        celularAdicional: '',
        comoTeGustariaQueTeLlamen: '',
        ciudadResidencia: '',
        direccion: '',
        tipoIdentificacion: '',
        numeroId: '',
        cursos: []
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `No es posible registrarte en este momento: ${error.response.data.message}`,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Cerrar'
      });
    } finally {
      setLoading(false); // Desactiva el indicador de carga
    }
  };
  

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Cargando...</span>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
          <div className="rounded-t-md overflow-hidden">
            <img src={banner} alt="Encabezado Politécnico SaberSalud" className="w-full object-cover object-center h-auto sm:h-420px" />
          </div>
          <div className="bg-white p-6 rounded-b-md shadow-lg">
            <div className="text-center text-lg p-4 font-bold text-[#033047]">
              <p>A partir de este momento ingresa en calidad de estudiante de SaberSalud Centro de Capacitaciones.</p>
              <p>Diligencie el formulario en su totalidad, antes de enviar verifique que la información sea correcta y lea atentamente nuestra política de TRATAMIENTO DE DATOS PERSONALES Y USO DE LA IMAGEN🔐</p>
              <a href="https://sabersalud.co/wp-content/uploads/2024/05/AUTORIZACION-PARA-EL-TRATAMIENTO-DE-DATOS-PERSONALES-E-IMAGEN.pdf" target='_blank'>Ver política</a>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow-lg max-w-4xl mx-auto my-8 form-registro">
            <div>
        <label htmlFor="nombres" className="block text-sm font-medium text-gray-700">Nombres</label>
        <input
          type="text"
          name="nombres"
          id="nombres"
          placeholder='Nombres completos'
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-#0049CC focus:border-#0049CC sm:text-sm"
          value={formData.nombres}
          onChange={handleChange}
        />
      </div>
            {/* Apellidos */}
            <div>
        <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700">Apellidos</label>
        <input
          type="text"
          name="apellidos"
          id="apellidos"
          placeholder='Apellidos completos'
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-#0049CC focus:border-#0049CC sm:text-sm"
          value={formData.apellidos}
          onChange={handleChange}
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder='Correo electronico'
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-#0049CC focus:border-#0049CC sm:text-sm"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      {/* Celular */}
      <div>
        <label htmlFor="celular" className="block text-sm font-medium text-gray-700">Célular</label>
        <input
          type="text"
          name="celular"
          id="celular"
          placeholder='Numero celular con WhatsApp'
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-#0049CC focus:border-#0049CC sm:text-sm"
          value={formData.celular}
          onChange={handleChange}
        />
      </div>

      {/* Celular Adicional*/}
      <div>
            <label htmlFor="celularAdicional" className="block text-sm font-medium text-gray-700">Número de contacto adicional</label>
            <input
              type="text"
              name="celularAdicional"
              id="celularAdicional"
              placeholder='Otro número de celular'
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-#0049CC focus:border-#0049CC sm:text-sm"
              value={formData.celularAdicional}
              onChange={handleChange}
            />
          </div>

          {/* Nuevo campo para cómo le gusta que le llamen */}
          <div>
            <label htmlFor="comoTeGustariaQueTeLlamen" className="block text-sm font-medium text-gray-700">¿Cómo te gusta que te llamen?</label>
            <input
              type="text"
              name="comoTeGustariaQueTeLlamen"
              id="comoTeGustariaQueTeLlamen"
              placeholder='Nombre preferido'
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-#0049CC focus:border-#0049CC sm:text-sm"
              value={formData.comoTeGustariaQueTeLlamen}
              onChange={handleChange}
            />
          </div>

      {/* Edad */}
      <div>
        <label htmlFor="edad" className="block text-sm font-medium text-gray-700">Edad</label>
        <input
          type="number"
          name="edad"
          id="edad"
          required
          min="18"
          max="100"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-#0049CC focus:border-#0049CC sm:text-sm"
          value={formData.edad}
          onChange={handleChange}
        />
      </div>

      {/* Grado de Escolaridad */}
      <div>
        <label htmlFor="gradoEscolaridad" className="block text-sm font-medium text-gray-700">Grado de Escolaridad</label>
        <select
          name="gradoEscolaridad"
          id="gradoEscolaridad"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-#0049CC focus:border-#0049CC sm:text-sm"
          value={formData.gradoEscolaridad}
          onChange={handleChange}
        >
          <option value="">Seleccione una opción</option>
          <option value="Ninguno">Ninguno</option>
          <option value="basica_primaria">Básica Primaria</option>
          <option value="bachiller">Bachiller</option>
          <option value="tecnico">Técnico</option>
          <option value="tecnologo">Tecnólogo</option>
          <option value="profesional">Profesional</option>
          <option value="especialista">Especialista</option>
          <option value="maestria">Maestría</option>
          <option value="doctorado">Doctorado</option>
        </select>
      </div>

      {/* Profesión */}
      <div>
        <label htmlFor="profesion" className="block text-sm font-medium text-gray-700">Profesión</label>
        <input
          type="text"
          name="profesion"
          id="profesion"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-#0049CC focus:border-#0049CC sm:text-sm"
          value={formData.profesion}
          onChange={handleChange}
        />
      </div>

      {/* Ciudad de Residencia */}
      <div>
        <label htmlFor="ciudadResidencia" className="block text-sm font-medium text-gray-700">Ciudad de Residencia</label>
        <input
          type="text"
          name="ciudadResidencia"
          id="ciudadResidencia"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-#0049CC focus:border-#0049CC sm:text-sm"
          value={formData.ciudadResidencia}
          onChange={handleChange}
        />
      </div>

      {/* Direccion */}
      <div>
        <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">Dirección</label>
        <input
          type="text"
          name="direccion"
          id="direccion"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-#0049CC focus:border-#0049CC sm:text-sm"
          value={formData.direccion}
          onChange={handleChange}
        />
      </div>


      {/* Tipo de Documento de Identidad */}
      <div>
        <label htmlFor="tipoIdentificacion" className="block text-sm font-medium text-gray-700">Tipo de Documento de Identidad</label>
        <select
          name="tipoIdentificacion"
          id="tipoIdentificacion"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-#0049CC focus:border-#0049CC sm:text-sm"
          value={formData.tipoIdentificacion}
          onChange={handleChange}
        >
          <option value="">Seleccione una opción</option>
          <option value="T.I">T.I</option>
          <option value="C.C">C.C.</option>
          <option value="C.E">C.E.</option>
          <option value="P.A">P.A.</option>
          <option value="P.P.T">P.P.T</option>
        </select>
      </div>

      {/* Número de Identificación */}
<div>
  <label htmlFor="numeroId" className="block text-sm font-medium text-gray-700">Número de Identificación</label>
  <input
    type="text"
    name="numeroId"
    id="numeroId"
    required
    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-#0049CC focus:border-#0049CC sm:text-sm"
    placeholder="Ingresa tu numero de identificación sin puntos ni espacios"
    value={formData.numeroId}
    onChange={handleChange}
  />
</div>

      <div className="flex justify-center ">
        <button type="submit" className="mt-5 w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#007DFE] hover:bg-[#003DA5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#005BEE] registro-button">
        Registrar
        </button>
      </div>
            </form>

            <h2 className="text-md mt-18 mb-5 font-bold text-[#033047] text-center">LINEAMIENTOS</h2>
            <ul className="list-inside text-center">
              <li>No hacemos devolución de dinero.</li>
              <li>No canjeamos cursos por otros cursos, servicios y/o productos.</li>
              <li>Se compromete a cumplir con el agendamiento asignado por la institución.</li>
              <li>Se compromete a usar lenguaje verbal respetuoso correcto.</li>
              <li>Si por razón de fuerza mayor se ve la necesidad del cambio de fecha de sus clases, tendrá un cobro adicional para re-agendamiento.</li>
              <li>La academia se reserva el derecho de modificar agenda de clases según aforo y eventualidades ajenas.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormularioRegistro;

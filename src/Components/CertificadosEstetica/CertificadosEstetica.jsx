import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Document, Page, Text, View, StyleSheet, Image, PDFDownloadLink, Font } from '@react-pdf/renderer';
import Swal from 'sweetalert2';
import './CertificadosEstetica.css';

// Importa tu imagen de fondo
import backgroundImage from '../../../public/certificadosestetica.png';

// Estilos para el documento PDF

/// Registra la fuente Dancing Script desde Google Fonts
Font.register({
    family: 'Dancing Script',
    src: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400&display=swap'
  });
  
  // Registrar Montserrat desde Google Fonts
  Font.register({
    family: 'Montserrat',
    src: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap'
  });

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    width: '792px', // Ancho de una hoja carta en orientación horizontal
    height: '612px', // Alto de una hoja carta en orientación horizontal
  },
  section: {
    margin: 0,
    padding: 0,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  name: {
    textTransform: 'uppercase',
    fontFamily: 'Dancing Script',
    textAlign: 'center',
    fontSize: 30,
    marginBottom: 10,
    paddingTop: 208, // Agrega un espacio entre los elementos de nombre y identificación
  },
  identification: {
    textAlign: 'center',
    fontSize: 25,
    fontFamily: "Montserrat",
    fontWeight: "bold"
  },
  textouno: {
    textAlign: 'center',
    fontFamily: "Montserrat",
    fontSize: 16,
    marginTop: 8,
  },
  textodos: {
    textAlign: 'center',
    fontFamily: "Montserrat",
    fontSize: 10,
    marginTop: 8,
    marginHorizontal: 30,
  },
  textocurso: {
    textAlign: 'center',
    fontSize: 28,
    fontFamily: "Montserrat",
    fontWeight: 'bold',
    marginTop: 6,
  },
  dropdown: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1
  },
  timestamp: {
    textAlign: 'center',
    fontSize: 8,
    color: "#8C8C8C",
    marginTop: 18,
  } 
  
});

const CertificadosEstetica = () => {
  const [userData, setUserData] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [numeroId, setNumeroId] = useState(""); // Nuevo estado para manejar el numeroId ingresado
  const [courseValue, setCourseValue] = useState(""); // Estado para manejar el valor del curso
  const [invoiceDate, setInvoiceDate] = useState(""); // Estado para manejar la fecha de la factura

  const [cursosDisponibles, setCursosDisponibles] = useState([
    { nombre: "SUEROTERAPIA INHALATORIA", duracion: "20", textoLegal: `EDUCACIÓN INFORMAL DE ACUERDO AL DECRETO 1075 del 2015 MINISTERIO DE EDUCACIÓN NACIONAL Y LA NORMA DE COMPETENCIA LABORAL No. 230101259.` },
    { nombre: "MESOTERAPIA", duracion: "40", textoLegal: `EDUCACIÓN INFORMAL DE ACUERDO AL DECRETO 1075 del 2015 MINISTERIO DE EDUCACIÓN NACIONAL Y LA NORMA DE COMPETENCIA LABORAL No. 230101263.` },
    { nombre: "HIDROLIPOCLASIA", duracion: "40", textoLegal: `EDUCACIÓN INFORMAL DE ACUERDO AL DECRETO 1075 del 2015 MINISTERIO DE EDUCACIÓN NACIONAL Y LA NORMA DE COMPETENCIA LABORAL No. 230101259.` },
    { nombre: "AROMATERAPIA", duracion: "20", textoLegal: `EDUCACIÓN INFORMAL DE ACUERDO AL DECRETO 1075 del 2015 MINISTERIO DE EDUCACIÓN NACIONAL Y LA NORMA DE COMPETENCIA LABORAL 230101297 .`},
    { nombre: "SEMINARIO EN MEDICINA HOMEOPÁTICA", duracion: "20", textoLegal: `SEGÚN RESOLUCIÓN 3100 DE 2019 MINISTERIO DE SALUD Y PROTECCIÓN SOCIAL, EDUCACIÓN INFORMAL DE ACUERDO AL DECRETO 1075 DEL 2015 MINISTERIO DE EDUCACIÓN NACIONAL.`},
    { nombre: "ACTUALIZACIÓN EN TÉCNICA TRANSDÉRMICA BODYSHAPER", duracion: "10", textoLegal: `EDUCACIÓN INFORMAL DE ACUERDO AL DECRETO 1075 del 2015 MINISTERIO DE EDUCACIÓN NACIONAL Y LA NORMA DE COMPETENCIA LABORAL No. 230101263.`}
  ]);

  const [isDataReady, setIsDataReady] = useState(false);


  useEffect(() => {
    // Esta función ahora es condicional basada en si numeroId tiene valor
    const fetchUserData = async () => {
      try {
        let url = 'https://sabersalud-backend-e0a3010fab41.herokuapp.com/api/estudiantes';
        if (numeroId) {
          url += `/numeroId/${numeroId}`;
        }
        
        const response = await axios.get(url);
        console.log('Respuesta de la API:', response);
        
        setUserData(numeroId ? [response.data] : response.data);
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    };

    if (numeroId) {
      fetchUserData();
    }
  }, [numeroId]);

  const enviarCursoAUsuario = async () => {
    try {
      const response = await axios.post(`https://sabersalud-backend-e0a3010fab41.herokuapp.com/api/estudiantes/${numeroId}/addCurso`, {
        nombreCurso: selectedOption.nombre,
        vencimiento: selectedDate,
        valor: courseValue, // Agrega el valor del curso al cuerpo de la solicitud
        fechaFactura: invoiceDate // Agrega la fecha de la factura al cuerpo de la solicitud
      });
  
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Datos del certificado guardados',
          text: 'Ya puede generar el PDF',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al guardar los datos',
          text: 'No se pudieron guardar los datos del certificado',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al añadir el curso al estudiante',
        text: 'ID no encontrado o erróneo',
      });
      console.error('Error al añadir el curso al estudiante:', error);
    }
  };

  // Manejadores para los cambios en los inputs y el select
  // const handleNumeroIdChange = (event) => {
  //   setNumeroId(event.target.value);
  // };

  const handleNumeroIdChange = (event) => {
    setNumeroId(event.target.value);
};

  const handleSelectChange = (event) => {
    const cursoNombre = event.target.value;
    const curso = cursosDisponibles.find(curso => curso.nombre === cursoNombre);
    setSelectedOption(curso);  // Ahora guarda el objeto completo
    console.log("Curso seleccionado:", curso.textoLegal); 
  };

  // Función para manejar el cambio en la fecha seleccionada
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    console.log("Fecha seleccionada:", event.target.value);
  };

  const handleCourseValueChange = (event) => {
    setCourseValue(event.target.value);
  };
  
  const handleInvoiceDateChange = (event) => {
    setInvoiceDate(event.target.value);
  };

  const estampilla = new Date().toLocaleString();  // Formato local


  return (
    <div className='container flex flex-col items-center justify-center min-h-screen bg-soft-pink'>
    
    <img
    src="https://saberestetica.com/wp-content/uploads/2023/06/Saber-Estetica-Logo-Nuevo-02.png"
    alt="Descripción de la imagen"
    className="w-1/4 my-4" // Ajusta el tamaño y el margen según sea necesario
    />
  
  {/* Input para ingresar numeroId */}
  <input
    type="text"
    value={numeroId}
    onChange={handleNumeroIdChange}
    className='input w-3/4 p-2 border border-gray-300 rounded-md'
    placeholder='Ingrese el número de ID del usuario'
  />

  {/* Lista desplegable para seleccionar el curso */}
  <select onChange={handleSelectChange} className='dropdown w-3/4 p-2 border border-gray-300 rounded-md mt-4'>
    <option value="">Seleccione un curso</option>
    {cursosDisponibles.map((curso, index) => (
      <option key={index} value={curso.nombre}>{curso.nombre}</option>
    ))}
  </select>

  <input
  type="number"
  value={courseValue}
  onChange={handleCourseValueChange} 
  className='input w-3/4 p-2 border border-gray-300 rounded-md mt-4'
  placeholder='Ingresa el valor del curso'
/>

 {/* Selector de fecha */}
 <label className='w-3/4 text-center'>
 Selecciona la fecha del Certificado
  <input type="date" onChange={handleDateChange} className='date-input w-full p-2 border border-gray-300 rounded-md mt-4' />
  </label>

{/* Input para ingresar la fecha de la factura */}
<label className='w-3/4 text-center'>
  Selecciona la fecha de la Factura:
  <input
    type="date"
    value={invoiceDate}
    onChange={handleInvoiceDateChange} // Usar el handler aquí
    className='date-input w-full p-2 border border-gray-300 rounded-md mt-2'
  />
</label>

  {/* Botón para preparar los datos del curso */}
  <button onClick={enviarCursoAUsuario} className="btn-descargar mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    Paso 1: Guardar datos del certificado
  </button>

  {/* Link para descargar el PDF */}
  <PDFDownloadLink 
    document={<CertificadosPDF userData={userData} selectedOption={selectedOption} selectedDate={selectedDate}/>} 
    fileName={`${userData && userData[0] ? `${userData[0].nombres}  ${userData[0].apellidos}` : 'Usuario'}-${selectedOption || 'Curso'} ${estampilla} - Certificado.pdf`}
    className="btn-descargar-pdf mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
    {({ blob, url, loading, error }) => (loading ? 'Generando PDF...' : 'Paso 2: Descargar Certificado')}
  </PDFDownloadLink>
</div>

  );
};

const CertificadosPDF = ({ userData, selectedOption, selectedDate}) => {
  const timestamp = Date.now(); 
  return (
    <Document>
  <Page size="letter" orientation="landscape" style={styles.page}>
    {/* Agrega la imagen de fondo */}
    <Image src={backgroundImage} style={styles.backgroundImage} />

    <View style={styles.section}>
      {/* Renderizar los campos del usuario si se han encontrado */}
      {userData && userData.map(user => (
        <View key={user.id}>
        <Text style={styles.name}>{user.nombres} {user.apellidos}</Text>
        <Text style={styles.identification}>{user.tipoIdentificacion} {user.numeroId}</Text>
        <Text style={styles.textouno}>ASISTIÓ Y APROBÓ AL CURSO DE:</Text>
        {/* Asegurar que selectedOption no es null antes de intentar renderizar su contenido */}
        {selectedOption && <Text style={styles.textocurso}>{selectedOption.nombre}</Text>}
        {/* Agregar texto legal del curso si selectedOption no es null */}
        {selectedOption && <Text style={styles.textodos}>
          {selectedOption.textoLegal}
        </Text>}
        {selectedDate && selectedOption && (
          <Text style={styles.textodos}>
            DADO A LOS {selectedDate.split('-')[2]} DÍAS DEL MES DE {getMonthName(selectedDate.split('-')[1]).toUpperCase()} DEL AÑO {selectedDate.split('-')[0]}, CON UNA DURACIÓN DE {selectedOption.duracion} HORAS EN BOGOTÁ D.C.
          </Text>
        )}
        <Text style={styles.timestamp}>SE{timestamp}IT</Text>
      </View>
      ))}
    </View>
  </Page>
</Document>
    
  );
};

// Función auxiliar para obtener el nombre del mes
const getMonthName = (monthNumber) => {
  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return monthNames[parseInt(monthNumber, 10) - 1];
};

export default CertificadosEstetica;
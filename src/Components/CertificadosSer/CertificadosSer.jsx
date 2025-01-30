import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { Document, Page, Text, View, StyleSheet, Image, PDFDownloadLink, Font } from '@react-pdf/renderer';
import Swal from 'sweetalert2';
import './CertificadosSer.css';
import "../../Fonts/fonts.css"


// Importa tu imagen de fondo
const backgroundImage = 'https://sabersalud.co/wp-content/uploads/2025/01/plantilla-saberser-v1.png';

// Estilos para el documento PDF
Font.registerHyphenationCallback((word) => {
  return [word]; // Deja las palabras completas sin división
});

// Registra la fuente
Font.register({
  family: 'Dancing Script',
  src: 'https://sabersalud.co/DancingScript-Regular.ttf'
});

// Registrar Montserrat-Regular
Font.register({
  family: 'Montserrat',
  fonts: [
    { src: 'https://sabersalud.co/Montserrat-Regular.ttf' }, // Ruta relativa al archivo Montserrat Regular
    { src: 'https://sabersalud.co/Montserrat-Bold.ttf', fontWeight: 'bold' } // Ruta relativa al archivo Montserrat Bold
  ]
});

const styles = StyleSheet.create({
  page: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '792px', // Ancho de una hoja carta en orientación horizontal
    height: '612px', // Alto de una hoja carta en orientación horizontal
  },
  column: {
    flex: 1,
    marginHorizontal: 10,
    padding: 5,
  },
  name: {
    textTransform: 'uppercase',
    fontFamily: 'Montserrat',
    fontWeight: "900",
    textAlign: 'center',
    color: '#1D163A',
    fontSize: 25,
    marginHorizontal: 40,
    paddingTop: 220, // Agrega un espacio entre los elementos de nombre y identificación
    marginBottom: 30,
  },
  identification: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: "Montserrat",
    fontWeight: "normal",
  },
  textouno: {
    textAlign: 'center',
    fontFamily: "Montserrat",
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 45,
    color:'#ffffff'
  },
  textodos: {
    textAlign: 'left',
    fontFamily: "Montserrat",
    fontSize: 10,
    marginTop: 100,
    marginHorizontal: 10,
    color:'#ffffff',
  },
  textofecha: {
    textAlign: 'center',
    fontFamily: "Montserrat",
    fontWeight:'bold',
    fontSize: 14,
    marginTop:'50',
    marginHorizontal: 30,
    color:'#ffffff'
  },
  textovalido: {
    textAlign: 'center',
    fontFamily: "Montserrat",
    fontSize: 12,
    marginTop: 15,
    fontWeight: "bold",
    color:'#ffffff'
  },
  textocurso: {
    height: 100,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: "Montserrat",
    fontWeight: '900',
    marginRight: 2,
    marginLeft: 2,
    marginTop:'30',
    color: '#E2E419',
    wordBreak: 'keep-all', // No divide palabras en líneas
    overflowWrap: 'normal', // Asegura que no se corten palabras
    whiteSpace: 'pre-wrap', // Mantiene el formato y ajusta líneas completas
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
  },
  timestamp: {
    textAlign: 'center',
    fontSize: 8,
    color: "#8C8C8C",
    marginTop: 6,
    color:'#ffffff'
  },
  textoconcordancia: {
    textAlign: 'left',           // Alineado a la izquierda
    fontSize: 9,                // Tamaño de fuente adecuado
    fontFamily: "Montserrat",    // Fuente consistente con el diseño              // Espacio superior
    marginHorizontal: 10,        // Márgenes laterales para ajustar el texto
    whiteSpace: 'pre-wrap',      // Respeta los saltos de línea
    lineHeight: 1,
    color:'#ffffff'             // Espaciado entre líneas para mejor legibilidad
  },
  
});

const CertificadosSer = () => {
  const [userData, setUserData] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [numeroId, setNumeroId] = useState(""); // Nuevo estado para manejar el numeroId ingresado
  const [courseValue, setCourseValue] = useState(""); // Estado para manejar el valor del curso
  const [invoiceDate, setInvoiceDate] = useState(""); // Estado para manejar la fecha de la factura

  const [cursosDisponibles, setCursosDisponibles] = useState([
    { nombre: "SUEROTERAPIA AVANZADA", duracion: "40", textoLegal: `No. 230101259.`, tipo:"CURSO" },
    { nombre: "TERAPIA NEURAL & HOMEOSINIATRÍA", duracion: "40", textoLegal: `No. 230101259.` , tipo:"CURSO" },
    { nombre: "SUEROTERAPIA NO INVASIVA", duracion: "40", textoLegal: `No. 230101259.` , tipo:"CURSO" },


  ]);

  const [isDataReady, setIsDataReady] = useState(false);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let url = 'https://sabersalud-backend-e0a3010fab41.herokuapp.com/api/estudiantes';
        if (numeroId.length >= 5) { // Asegúrate de que el número de ID tenga al menos 5 caracteres
          url += `/numeroId/${numeroId}`;
        }
        
        const response = await axios.get(url);
        console.log('Respuesta de la API:', response);
        
        setUserData(numeroId.length >= 5 ? [response.data] : response.data);
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    };

    // Llama a fetchUserData solo si numeroId tiene al menos 5 caracteres
    if (numeroId.length >= 6) {
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
    console.log("Curso seleccionado:", curso); 
  };

  // Función para manejar el cambio en la fecha seleccionada
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    console.log("Fecha seleccionada:", event.target.value);
  };

  // Debounce handler
  const handleCourseValueChange = debounce((value) => {
    setCourseValue(value);
  }, 800); // Ajusta el tiempo de espera según la necesidad

  
  const handleInvoiceDateChange = (event) => {
    setInvoiceDate(event.target.value);
  };

  const estampilla = new Date().toLocaleString();  // Formato local


  return (
    <div className='container flex flex-col items-center justify-center min-h-screen'>
      <img
      src="https://sabersalud.co/wp-content/uploads/2020/10/Logo-Color-Original-Horizontal-con-Eslogan-Tiny.png"
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
    <option value="">Seleccione un curso o diplomado</option>
    {cursosDisponibles.map((curso, index) => (
      <option key={index} value={curso.nombre}>{curso.nombre}</option>
    ))}
  </select>

  <input
      type="number"
      onChange={(event) => handleCourseValueChange(event.target.value)}
      className='input input w-3/4 p-2 border border-gray-300 rounded-md'
      placeholder='Ingresa el valor del curso'
    />
    
 {/* Selector de fecha */}
 <label className='w-3/4 text-center'>
 Selecciona la fecha del <strong>Certificado:</strong>
  <input type="date" onChange={handleDateChange} className='date-input w-full p-2 border border-gray-300 rounded-md mt-4' />
  </label>

{/* Input para ingresar la fecha de la factura */}
<label className='w-3/4 text-center'>
  Selecciona la fecha de la <strong>Factura:</strong>
  <input
    type="date"
    value={invoiceDate}
    onChange={handleInvoiceDateChange} // Usar el handler aquí
    className='date-input w-full p-2 border border-gray-300 rounded-md mt-2'
  />
</label>

  {/* Botón para preparar los datos del curso */}
  <button onClick={enviarCursoAUsuario} className="btn-descargar mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    Paso 1: Guardar datos del certificado 💾
  </button>

  {/* Link para descargar el PDF s*/}
  <PDFDownloadLink 
    document={<CertificadosPDF userData={userData} selectedOption={selectedOption} selectedDate={selectedDate}/>} 
    fileName={`${userData && userData[0] ? `${userData[0].nombres} ${userData[0].apellidos} ${userData[0].numeroId}` : 'Usuario'}-${selectedOption ? selectedOption.nombre : 'Curso'} - Certificado.pdf`}

    className="btn-descargar-pdf mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
    {({ blob, url, loading, error }) => (loading ? 'Generando PDF...' : 'Paso 2: Descargar Certificado 📑')}
  </PDFDownloadLink>
</div>


  );
};

// Función para calcular el tamaño de fuente dinámico
const calculateFontSize = (text) => {
  const wordCount = text.split(' ').length;

  // Ajusta el tamaño de la fuente basado en el número de palabras
  if (wordCount <= 18) return 35; // Texto corto
  return 20; // Texto largo
};

const CertificadosPDF = ({ userData, selectedOption, selectedDate }) => {
  const timestamp = Date.now();
  return (
    <Document>
      <Page size="letter" orientation="landscape" style={styles.page}>
        {/* Agrega la imagen de fondo */}
        <Image src={backgroundImage} style={styles.backgroundImage} />
        <View style={styles.page}>
          {/* Renderizar los campos del usuario si se han encontrado */}
          {userData && userData.map((user) => (
            <View key={user.id} style={{ flexDirection: 'row', flex: 1 }}>
              {/* Columna izquierda */}
              <View style={styles.column}>
                <Text style={styles.name}>{user.nombres} {user.apellidos}</Text>
                <Text style={styles.identification}>
                  {user.tipoIdentificacion} {user.numeroId}
                </Text>
              </View>

              {/* Columna derecha */}
              <View style={styles.column}>
                <Text style={styles.textouno}>ASISTIÓ Y APROBÓ EL {selectedOption.tipo} {console.log(selectedOption.tipo)}DE:</Text>
                {/* Asegurar que selectedOption no es null antes de intentar renderizar su contenido */}
                {selectedOption && <Text style={styles.textocurso} wrap>{selectedOption.nombre}</Text>}
                {/* Agregar texto legal del curso si selectedOption no es null */}
                {selectedOption && (
                  <Text style={styles.textodos}>
                    En concordancia con:
                    {"\n"}{"\n"}- Resolución 3100 MINSALUD{"\n"}- Norma de competencia laboral SENA vigente {"\n"}{selectedOption.aha}
                  </Text>  
                )}
                {selectedDate && selectedOption && (
                  <Text style={styles.textofecha}>
                  {getMonthName(selectedDate.split('-')[1]).toUpperCase()} {selectedDate.split('-')[2]} DEL {selectedDate.split('-')[0]}{"\n"}INTENSIDAD HORARIA {selectedOption.duracion} HORAS.
                  </Text>
                )}
                <Text style={styles.timestamp}>SS{timestamp}IT</Text>
              </View>
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

export default CertificadosSer;
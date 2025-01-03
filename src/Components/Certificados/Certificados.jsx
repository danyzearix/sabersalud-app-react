import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { Document, Page, Text, View, StyleSheet, Image, PDFDownloadLink, Font } from '@react-pdf/renderer';
import Swal from 'sweetalert2';
import './Certificados.css';
import "../../Fonts/fonts.css"


// Importa tu imagen de fondo
const backgroundImage = 'https://sabersalud.co/wp-content/uploads/2025/01/plantilla-sabersalud-1.png';

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

const Certificados = () => {
  const [userData, setUserData] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [numeroId, setNumeroId] = useState(""); // Nuevo estado para manejar el numeroId ingresado
  const [courseValue, setCourseValue] = useState(""); // Estado para manejar el valor del curso
  const [invoiceDate, setInvoiceDate] = useState(""); // Estado para manejar la fecha de la factura

  const [cursosDisponibles, setCursosDisponibles] = useState([
{ nombre: "ACOMPAÑAMIENTO Y MANEJO BÁSICO DEL DUELO", duracion: "20", textoLegal: ` No. 260601023.`, tipo:"CURSO" },
{ nombre: "ACTUALIZACIÓN EN TÉCNICAS Y PROCEDIMIENTOS BÁSICOS DE ENFERMERÍA ", duracion: "40", textoLegal: `No. 230101266.`, tipo:"CURSO" },
{ nombre: "ADMINISTRACIÓN SEGURA DE MEDICAMENTOS", duracion: "40", textoLegal: `No. 230101259.`, tipo:"CURSO" },
{ nombre: "ASESORÍA PRE Y POST VIH", duracion: "30", textoLegal: ` No. 230101260.`, tipo:"CURSO" },
{ nombre: "ATENCIÓN AL PACIENTE EN CONDICIÓN DE FARMACODEPENDENCIA", duracion: "40", textoLegal: `No. 230101260.`, tipo:"CURSO" },
{ nombre: "ATENCIÓN CENTRADA EN EL USUARIO EN LOS SERVICIOS DE SALUD SEGURIDAD SOCIAL EN COLOMBIA  ", duracion: "120", textoLegal: `No. 230101266`, tipo:"CURSO" },
{ nombre: "ATENCIÓN INTEGRADA DE ENFERMEDADES PREVALENTES DE LA PRIMERA INFANCIA AIEPI", duracion: "40", textoLegal: ` No. 230101255.`, tipo:"CURSO" },
{ nombre: "ATENCIÓN INTEGRAL  AL ADULTO MAYOR", duracion: "20", textoLegal: ` No. 230101260.`, tipo:"CURSO" },
{ nombre: "ATENCIÓN INTEGRAL A VÍCTIMAS DE VIOLENCIA SEXUAL Y DE GÉNERO", duracion: "40", textoLegal: `No. 230101267`, tipo:"CURSO" },
{ nombre: "ATENCIÓN INTEGRAL AL RECIÉN NACIDO", duracion: "20", textoLegal: `No. 230101255.`, tipo:"CURSO" },
{ nombre: "ATENCIÓN INTEGRAL A VÍCTIMAS DE ATAQUES CON AGENTES QUÍMICOS", duracion: "40", textoLegal: `No. 230101267.`, tipo:"CURSO" },
{ nombre: "ATENCIÓN INTEGRAL DE PACIENTE CRÍTICO NEONATAL UCIN", duracion: "120", textoLegal: ` No. 230101268.`, tipo:"CURSO" },
{ nombre: "ATENCIÓN INTEGRAL DEL PACIENTE CRÍTICO PEDIATRICO UCI ", duracion: "120", textoLegal: `No. 230101268.` , tipo:"CURSO"},
{ nombre: "ATENCIÓN INTEGRAL DE PACIENTE CRÍTICO UCI", duracion: "120", textoLegal: ` No. 230101268.`, tipo:"CURSO" },
{ nombre: "ATENCIÓN PRE-HOSPITALARIA APH", duracion: "40", textoLegal: ` No. 230101237.`, tipo:"CURSO" },
{ nombre: "BIOSEGURIDAD APLICADA A LA COSMÉTICA EN TIEMPOS DEL COVID-19 CON ÉNFASIS EN SERVICIOS DE BELLEZA A DOMICILIO ", duracion: "20", textoLegal: `No. 230101289 y 2060602037.` , tipo:"CURSO" },
{ nombre: "BIOSEGURIDAD.", duracion: "20", textoLegal: `No. 230101289 y 2060602037.` , tipo:"CURSO"},
{ nombre: "BRIGADA DE EMERGENCIA EMPRESARIAL", duracion: "10", textoLegal: `No. 260401023.` , tipo:"CURSO"},
{ nombre: "BUENAS PRÁCTICAS DE MANUFACTURA (HIGIENE Y MANIPULACIÓN DE ALIMENTOS)", duracion: "10", textoLegal: `No. 290801023.` , tipo:"CURSO"},
{ nombre: "BUENAS PRÁCTICAS EN SEGURIDAD DE PACIENTE", duracion: "20", textoLegal: `No. 230101266` , tipo:"CURSO"},
{ nombre: "CIRCULANTE DE SALAS DE CIRUGÍA ", duracion: "120", textoLegal: `No. 230101290` , tipo:"CURSO" },
{ nombre: "CONDUCCIÓN DE VEHÍCULOS DE EMERGENCIA COVE", duracion: "60", textoLegal: ` No. 280601012` , tipo:"CURSO"},
{ nombre: "CUIDADO INTEGRAL DEL PACIENTE ONCOLÓGICO", duracion: "40", textoLegal: `No 230101261` , tipo:"CURSO"},
{ nombre: "MANEJO DEL DOLOR Y CUIDADOS PALIATIVOS", duracion: "40", textoLegal: `No. 230101261` , tipo:"CURSO"},
{ nombre: "CUIDADOS BÁSICOS AL RECIÉN NACIDO ", duracion: "20", textoLegal: `No. 230101255.` , tipo:"CURSO"},
{ nombre: "PREVENCIÓN Y CUIDADO DE ULCERAS POR PRESIÓN Y OTRAS LESIONES", duracion: "40", textoLegal: ` No. 230101258` , tipo:"CURSO"},
{ nombre: "CLÍNICA DE HERIDAS", duracion: "40", textoLegal: ` No. 230101258` , tipo:"CURSO"},
{ nombre: "CURSO DE SEGURIDAD SOCIAL EN COLOMBIA", duracion: "40", textoLegal: `No. 230101239` , tipo:"CURSO"},
{ nombre: "TOMA ELECTROCARDIOGRAMA ", duracion: "20", textoLegal: ` No. 230101064.` , tipo:"CURSO"},
{ nombre: "HUMANIZACIÓN EN LA PRESTACIÓN DE SERVICIOS DE SALUD", duracion: "20", textoLegal: ` No. 230101261.` , tipo:"CURSO"},
{ nombre: "INSERCIÓN DE DISPOSITIVO INTRAUTERINO DIU", duracion: "20", textoLegal: `No. 230101260.` , tipo:"CURSO"},
{ nombre: "INSERCIÓN Y RETIRO DE IMPLANTE SUBDÉRMICO", duracion: "20", textoLegal: `No. 230101260.` , tipo:"CURSO"},
{ nombre: "INSTITUCIÓN AMIGA DE LA MUJER Y LA INFANCIA ", duracion: "20", textoLegal: ` No. 230101260.` , tipo:"CURSO"},
{ nombre: "INYECTOLOGÍA", duracion: "40", textoLegal: `No. 230101263 ` , tipo:"CURSO"},
{ nombre: "VENOPUNCIÓN E INYECTOLOGÍA", duracion: "40", textoLegal: `No. 230101263 ` , tipo:"CURSO"},
{ nombre: "LACTANCIA MATERNA", duracion: "30", textoLegal: ` No. 230101260.` , tipo:"CURSO"},
{ nombre: "MANEJO INTEGRAL DE RESIDUOS HOSPITALARIOS", duracion: "40", textoLegal: ` No. 220201074.`, tipo:"CURSO"},
{ nombre: "MONITOREO AMBULATARIO DE LA PRESIÓN ARTERIAL", duracion: "20", textoLegal: ` No. 230101064` , tipo:"CURSO"},
{ nombre: "PROGRAMA AMPLIADO DE INMUNIZACIÓN PAI ", duracion: "60", textoLegal: `No. 230101257.` , tipo:"CURSO"},
{ nombre: "PLANIFICACIÓN FAMILIAR", duracion: "20", textoLegal: ` No. 230101239.` , tipo:"CURSO"},
{ nombre: "PREPARACION Y TOMA DE PRUEBA DE ESFUERZO", duracion: "20", textoLegal: ` No. 230101064`, tipo:"CURSO" },
{ nombre: "PRIMER RESPONDIENTE ", duracion: "20", textoLegal: `No. 230101267`, tipo:"CURSO"},
{ nombre: "PRIMEROS AUXILIOS BÁSICOS", duracion: "20", textoLegal: ` No. 230101267.`, tipo:"CURSO" },
{ nombre: "PRIMEROS AUXILIOS PEDIÁTRICOS", duracion: "20", textoLegal: ` No. 230101267.` , tipo:"CURSO"},
{ nombre: "PRIMEROS AUXILIOS PSICOLÓGICOS Y MANEJO DEL PACIENTE PSIQUIÁTRICO", duracion: "20", textoLegal: ` No. 230101267.` , tipo:"CURSO"},
{ nombre: "PROMOCIÓN Y PREVENCIÓN EN SALUD", duracion: "60", textoLegal: ` No. 230101239.` , tipo:"CURSO"},
{ nombre: "PRUEBAS RÁPIDAS DE APOYO DIAGNÓSTICO", duracion: "20", textoLegal: ` No. 230101064.` , tipo:"CURSO"},
{ nombre: "RADIOPROTECCIÓN", duracion: "30", textoLegal: `No. 230101282.` , tipo:"CURSO"},
{ nombre: "SOPORTE VITAL AVANZADO NEONATAL ", duracion: "48", textoLegal: `No. 230101268.`,aha:'- Lineamiento AHA', tipo:"CURSO"},
{ nombre: "SOPORTE VITAL AVANZADO PEDIÁTRICO PALS", duracion: "48", textoLegal: `No. 230101268.`,aha:'- Lineamiento AHA', tipo:"CURSO" },
{ nombre: "SOPORTE VITAL AVANZADO ACLS", duracion: "48", textoLegal: `No. 230101268.`,aha:'- Lineamiento AHA', tipo:"CURSO" },
{ nombre: "SOPORTE VITAL BÁSICO BLS Y MANEJO DEL DEA", duracion: "48", textoLegal: `No. 230101267.`,aha:'- Lineamiento AHA', tipo:"CURSO" },
{ nombre: "TALLER PARA LA PREVENCIÓN DE CONTAGIO Y MANEJO DEL PACIENTE CON CORONAVIRUS", duracion: "20", textoLegal: `No. 2301012058`, tipo:"CURSO" },
{ nombre: "TOMA DE CITOLOGÍA CERVICOUTERINA", duracion: "20", textoLegal: ` No. 230101239.`, tipo:"CURSO" },
{ nombre: "TOMA DE HOLTER", duracion: "20", textoLegal: ` No. 230101064` , tipo:"CURSO"},
{ nombre: "TOMA, CONSERVACIÓN Y TRANSPORTE DE MUESTRAS PARA EXÁMENES DE LABORATORIO CLÍNICO", duracion: "40", textoLegal: `No. 230101064.` , tipo:"CURSO"},
{ nombre: "TRANSFUSIÓN SANGUÍNEA Y HEMODERIVADOS", duracion: "20", textoLegal: `No. 230101268.` , tipo:"CURSO"},
{ nombre: "TRANSPORTE INTEGRAL DEL PACIENTE EN EL AMBIENTE INTRAHOSPITALARIO (CAMILLERO)", duracion: "60", textoLegal: `No. 230101280.` , tipo:"CURSO"},
{ nombre: "TRIAGE Y CLASIFICACIÓN DE PACIENTES EN LOS SERVICIOS DE URGENCIAS", duracion: "20", textoLegal: ` No. 230101280.` , tipo:"CURSO"},
{ nombre: "DIPLOMADO EN CUIDADO INTEGRAL AL PACIENTE RENAL ", duracion: "80", textoLegal: ` No. 230101269` , tipo:"CURSO"},
{ nombre: "GESTIÓN OPERATIVA DE DONACIÓN DE ÓRGANOS Y TEJIDOS", duracion: "60", textoLegal: ` No. 230101270` , tipo:"CURSO"},
{ nombre: "SEDACIÓN BÁSICA Y AVANZADA", duracion: "40", textoLegal: ` No. 230101271` , tipo:"CURSO"},
{ nombre: "ATENCIÓN BÁSICA DOMICILIARIA ", duracion: "20", textoLegal: `No. 230101261` , tipo:"CURSO"},
{ nombre: "ATENCIÓN INTEGRAL A USUARIO EN URGENCIA OBSTÉTRICA ", duracion: "40", textoLegal: ` No. 230101268.` , tipo:"CURSO"},
{ nombre: "BUENAS PRÁCTICAS EN ESTERILIZACIÓN ", duracion: "40", textoLegal: ` No. 230101289.` , tipo:"CURSO"},
{ nombre: "CERTIFICADO DE NACIDO VIVO Y DEFUNCIÓN", duracion: "20", textoLegal: `.`, tipo:"CURSO"},
{ nombre: "PLAN NACIONAL DE VACUNACIÓN CONTRA COVID-19", duracion: "40", textoLegal: `No. 230101257.`, tipo:"CURSO"},
{ nombre: "ATENCIÓN A VÍCTIMAS DE CONFLICTO ARMADO (PAPSIVI)", duracion: "40", textoLegal: `No. 230101267.`, tipo:"CURSO"},
{ nombre: "TELEMEDICINA", duracion: "20", textoLegal: `.`, tipo:"CURSO"},
{ nombre: "POCT", duracion: "20", textoLegal: `No.230101064.`, tipo:"CURSO"},
{ nombre: "PRÁCTICAS CLÍNICAS BASADAS EN LA EVIDENCIA", duracion: "20", textoLegal: `.`, tipo:"CURSO"}, //Diplomados
{ nombre: "ATENCIÓN INTEGRAL DE PACIENTE CRÍTICO NEONATAL UCIN", duracion: "120", textoLegal: `No. 230101268.`, tipo:"DIPLOMADO" },
{ nombre: "ATENCIÓN INTEGRAL DEL PACIENTE CRÍTICO PEDIATRICO UCIP ", duracion: "120", textoLegal: `No. 230101268.` , tipo:"DIPLOMADO"},
{ nombre: "ATENCIÓN INTEGRAL DE PACIENTE CRÍTICO UCI", duracion: "120", textoLegal: `No. 230101268.` , tipo:"DIPLOMADO"},
{ nombre: "CIRCULANTE DE SALAS DE CIRUGÍA ", duracion: "120", textoLegal: `No. 230101290` , tipo:"DIPLOMADO"},
{ nombre: "CUIDADO INTEGRAL AL PACIENTE RENAL ", duracion: "80", textoLegal: `No. 230101269` , tipo:"DIPLOMADO"},

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
    console.log("Curso seleccionado:", curso.textoLegal); 
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
                <Text style={styles.textouno}>ASISTIÓ Y APROBÓ EL {selectedOption.tipo} DE:</Text>
                {/* Asegurar que selectedOption no es null antes de intentar renderizar su contenido */}
                {selectedOption && <Text style={styles.textocurso} wrap>{selectedOption.nombre}</Text>}
                {/* Agregar texto legal del curso si selectedOption no es null */}
                {selectedOption && (
                  <Text style={styles.textodos}>
                    En concordancia con:
                    {"\n"}{"\n"}- Resolución 3100 de 2019 MINSALUD{"\n"}- NCLS {selectedOption.textoLegal}{"\n"}{selectedOption.aha}
                  </Text>  
                )}
                {selectedDate && selectedOption && (
                  <Text style={styles.textofecha}>
                  {getMonthName(selectedDate.split('-')[1]).toUpperCase()} {selectedDate.split('-')[2]} DEL {selectedDate.split('-')[0]}{"\n"}INTENSIDAD HORARIA {selectedOption.duracion} HORAS.
                  </Text>
                )}
                <Text style={styles.textovalido}>VÁLIDO POR 2 AÑOS</Text>
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

export default Certificados;





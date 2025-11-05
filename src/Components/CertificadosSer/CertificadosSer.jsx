import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { Document, Page, Text, View, StyleSheet, Image, PDFDownloadLink, Font } from '@react-pdf/renderer';
import Swal from 'sweetalert2';
import './CertificadosSer.css';
import "../../Fonts/fonts.css";
import { CURSOS_SER } from ".//../../data/cursosser.js";

// Fondo del PDF
const backgroundImage = 'https://sabersalud.co/wp-content/uploads/2025/10/CERTIFICADO-SABER-SER-2025-scaled.jpg';

/* ===== React-PDF: fuentes y estilos internos ===== */
Font.registerHyphenationCallback((word) => [word]);

Font.register({ family: 'Dancing Script', src: 'https://sabersalud.co/DancingScript-Regular.ttf' });

Font.register({
  family: 'Montserrat',
  fonts: [
    { src: 'https://sabersalud.co/Montserrat-Regular.ttf' },
    { src: 'https://sabersalud.co/Montserrat-Bold.ttf', fontWeight: 'bold' }
  ]
});

const styles = StyleSheet.create({
  page: { display: 'flex', flexDirection: 'row', backgroundColor: 'transparent', width: '792px', height: '612px' },
  column: { flex: 1, marginHorizontal: 10, padding: 5 },
  name: {
    textTransform: 'uppercase', fontFamily: 'Montserrat', fontWeight: "900", textAlign: 'center',
    color: '#1D163A', fontSize: 25, marginHorizontal: 40, paddingTop: 220, marginBottom: 30,
  },
  identification: { textAlign: 'center', fontSize: 16, fontFamily: "Montserrat" },
  textouno: { textAlign: 'center', fontFamily: "Montserrat", fontWeight: 'bold', fontSize: 12, marginTop: 45, color:'#ffffff' },
  textodos: { textAlign: 'left', fontFamily: "Montserrat", fontSize: 10, marginTop: 100, marginHorizontal: 30, color:'#ffffff' },
  textofecha: { textAlign: 'center', fontFamily: "Montserrat", fontWeight:'bold', fontSize: 14, marginTop:'50', marginHorizontal: 30, color:'#ffffff' },
  textovalido: { textAlign: 'center', fontFamily: "Montserrat", fontSize: 12, marginTop: 15, fontWeight: "bold", color:'#ffffff' },
  textocurso: {
    height: 100, textAlign: 'center', fontSize: 20, fontFamily: "Montserrat", fontWeight: '900',
    marginRight: 2, marginLeft: 2, marginTop:'30', color: '#E2E419',
    wordBreak: 'keep-all', overflowWrap: 'normal', whiteSpace: 'pre-wrap',
  },
  backgroundImage: { position: 'absolute', width: '100%', height: '100%' },
  timestamp: { textAlign: 'center', fontSize: 8, color:'#ffffff', marginTop: 6 },
});

/* ===== Componente principal con modo oscuro + validación búsqueda ===== */
const CertificadosSer = () => {
  const [userData, setUserData] = useState(null);
  const [selectedOption, setSelectedOption] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [numeroId, setNumeroId] = useState("");
  const [courseValue, setCourseValue] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [cursosDisponibles] = useState(() => [...CURSOS_SER]);
  const [searchStatus, setSearchStatus] = useState("idle"); // idle | searching | found | not_found

  // Tema: dark/light (igual que en los otros componentes)
  const systemPrefersDark =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [isDark, setIsDark] = useState(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (saved === "dark") return true;
    if (saved === "light") return false;
    return systemPrefersDark;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Fetch por numeroId con estados
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setSearchStatus("searching");
        let url = 'https://sabersalud-backend-e0a3010fab41.herokuapp.com/api/estudiantes';
        if (numeroId.length >= 5) url += `/numeroId/${numeroId}`;

        const response = await axios.get(url);
        const payload = numeroId.length >= 5 ? [response.data] : response.data;

        const found =
          Array.isArray(payload) ? payload.length > 0
          : payload && typeof payload === "object";

        setUserData(found ? payload : []);
        setSearchStatus(found ? "found" : "not_found");
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        setUserData([]);
        setSearchStatus("not_found");
      }
    };

    if (numeroId.length >= 6) {
      fetchUserData();
    } else {
      setUserData(null);
      setSearchStatus("idle");
    }
  }, [numeroId]);

  // Handlers
  const handleNumeroIdChange = (e) => setNumeroId(e.target.value);

  const handleSelectChange = (e) => {
    const nombre = e.target.value;
    const curso = cursosDisponibles.find(c => c.nombre === nombre);
    setSelectedOption(curso || {});
  };

  const handleDateChange = (e) => setSelectedDate(e.target.value);
  const handleCourseValueChange = debounce((value) => setCourseValue(value), 800);
  const handleInvoiceDateChange = (e) => setInvoiceDate(e.target.value);

  const enviarCursoAUsuario = async () => {
    try {
      const response = await axios.post(
        `https://sabersalud-backend-e0a3010fab41.herokuapp.com/api/estudiantes/${numeroId}/addCurso`,
        {
          nombreCurso: selectedOption.nombre,
          vencimiento: selectedDate,
          valor: courseValue,
          fechaFactura: invoiceDate
        }
      );
      if (response.status === 200) {
        Swal.fire({ icon: 'success', title: 'Datos del certificado guardados', text: 'Ya puede generar el PDF' });
      } else {
        Swal.fire({ icon: 'error', title: 'Error al guardar los datos', text: 'No se pudieron guardar los datos del certificado' });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error al añadir el curso al estudiante', text: 'ID no encontrado o erróneo' });
      console.error('Error al añadir el curso al estudiante:', error);
    }
  };

  // gating: habilitar solo si hubo resultado
  const userFound =
    searchStatus === "found" &&
    userData &&
    ((Array.isArray(userData) && userData.length > 0) || (!Array.isArray(userData) && userData));
  const canInteract = !!userFound;

  return (
    <div className="page-wrap">
      {/* Header con toggle */}
      <header className="header">
        <img
          src="https://sabersalud.co/wp-content/uploads/2020/10/Logo-Color-Original-Horizontal-con-Eslogan-Tiny.png"
          alt="SaberSalud"
          className="logo"
        />

        <button
          type="button"
          className="theme-toggle"
          aria-label={`Cambiar a modo ${isDark ? "claro" : "oscuro"}`}
          onClick={() => setIsDark(v => !v)}
        >
          <span className="theme-toggle__thumb" />
          <span className="theme-toggle__label">{isDark ? "Oscuro" : "Claro"}</span>
        </button>
      </header>

      <div className='container'>
        {/* numeroId */}
        <input
          type="text"
          value={numeroId}
          onChange={handleNumeroIdChange}
          className='input'
          placeholder='Ingrese el número de ID del usuario'
        />

        {/* Estado de búsqueda */}
        {searchStatus === "searching" && <p className="status status-info">Buscando usuario…</p>}
        {searchStatus === "not_found" && <p className="status status-error">No se encontró un usuario con ese ID.</p>}
        {searchStatus === "found" && <p className="status status-ok">Usuario encontrado ✅</p>}

        {/* Curso */}
        <select onChange={handleSelectChange} className='dropdown' disabled={!canInteract}>
          <option value="">Seleccione un curso o diplomado</option>
          {cursosDisponibles.map((curso, index) => (
            <option key={index} value={curso.nombre}>{curso.nombre}</option>
          ))}
        </select>

        {/* Valor */}
        <input
          type="number"
          onChange={(e) => handleCourseValueChange(e.target.value)}
          className='input'
          placeholder='Ingresa el valor del curso'
          disabled={!canInteract}
        />

        {/* Fecha certificado */}
        <label className='label'>
          Selecciona la fecha del <strong>Certificado:</strong>
          <input type="date" onChange={handleDateChange} className='date-input' disabled={!canInteract} />
        </label>

        {/* Fecha factura */}
        <label className='label'>
          Selecciona la fecha de la <strong>Factura:</strong>
          <input
            type="date"
            value={invoiceDate}
            onChange={handleInvoiceDateChange}
            className='date-input'
            disabled={!canInteract}
          />
        </label>

        {/* Guardar */}
        <button
          onClick={enviarCursoAUsuario}
          className="btn btn-primary"
          disabled={!canInteract}
          title={!canInteract ? "Busca un usuario válido para habilitar esta acción" : undefined}
        >
          Paso 1: Guardar datos del certificado 💾
        </button>

        {/* Descargar */}
        {canInteract ? (
          <PDFDownloadLink
            document={<CertificadosPDF userData={userData} selectedOption={selectedOption} selectedDate={selectedDate} />}
            fileName={`${userData && userData[0] ? `${userData[0].nombres} ${userData[0].apellidos} ${userData[0].numeroId}` : 'Usuario'}-${selectedOption ? selectedOption.nombre : 'Curso'} - Certificado.pdf`}
            className="btn btn-success"
          >
            {({ loading }) => (loading ? 'Generando PDF...' : 'Paso 2: Descargar Certificado 📑')}
          </PDFDownloadLink>
        ) : (
          <button className="btn btn-success" disabled title="Busca un usuario válido para habilitar esta acción">
            Paso 2: Descargar Certificado 📑
          </button>
        )}
      </div>
    </div>
  );
};

/* ===== PDF ===== */
const calculateFontSize = (text) => (text.split(' ').length <= 18 ? 35 : 20);

const CertificadosPDF = ({ userData, selectedOption, selectedDate }) => {
  const timestamp = Date.now();
  return (
    <Document>
      <Page size="letter" orientation="landscape" style={styles.page}>
        <Image src={backgroundImage} style={styles.backgroundImage} />
        <View style={styles.page}>
          {userData && userData.map((user) => (
            <View key={user.id} style={{ flexDirection: 'row', flex: 1 }}>
              <View style={styles.column}>
                <Text style={styles.name}>{user.nombres} {user.apellidos}</Text>
                <Text style={styles.identification}>{user.tipoIdentificacion} {user.numeroId}</Text>
              </View>

              <View style={styles.column}>
                <Text style={styles.textouno}>ASISTIÓ Y APROBÓ EL {selectedOption?.tipo} DE:</Text>
                {selectedOption && <Text style={styles.textocurso} wrap>{selectedOption?.nombre}</Text>}

                {selectedOption && (
                  <Text style={styles.textodos}>
                    En concordancia con:
                    {"\n"}{"\n"}- Resolución 3100 MINSALUD{"\n"}- Norma de competencia laboral SENA vigente {"\n"}{selectedOption?.aha}
                  </Text>
                )}

                {selectedDate && selectedOption && (
                  <Text style={styles.textofecha}>
                    {getMonthName(selectedDate.split('-')[1]).toUpperCase()} {selectedDate.split('-')[2]} DEL {selectedDate.split('-')[0]}
                    {"\n"}INTENSIDAD HORARIA {selectedOption?.duracion} HORAS.
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

const getMonthName = (m) => ([
  'Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
][parseInt(m,10)-1]);

export default CertificadosSer;

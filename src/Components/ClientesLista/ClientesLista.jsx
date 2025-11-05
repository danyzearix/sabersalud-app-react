import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import "./ClientesLista.css";

const API_BASE = "https://sabersalud-backend-e0a3010fab41.herokuapp.com/api";

// Normaliza texto para comparar sin acentos ni mayúsculas
const normalize = (s = "") =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const ClientesLista = () => {
  // Datos (todo el dataset en memoria)
  const [todosEstudiantes, setTodosEstudiantes] = useState([]);
  // Filtros
  const [filtroNumeroId, setFiltroNumeroId] = useState("");
  const [filtroNombre, setFiltroNombre] = useState("");
  // Agregar por correo
  const [nuevoEmail, setNuevoEmail] = useState("");
  // Paginación cliente
  const [pagina, setPagina] = useState(1);
  const [limit, setLimit] = useState(20);
  // Estado UI
  const [loading, setLoading] = useState(false);

  // Tema oscuro
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

  // Carga completa (sin parámetros de paginación)
  const cargarTodos = async () => {
    try {
      setLoading(true);
      const resp = await axios.get(`${API_BASE}/estudiantes`);
      setTodosEstudiantes(Array.isArray(resp.data) ? resp.data : []);
      // al recargar, vuelve a página 1
      setPagina(1);
    } catch (err) {
      console.error("Error al cargar estudiantes:", err);
      Swal.fire("Error", "No se pudieron cargar los estudiantes.", "error");
      setTodosEstudiantes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTodos();
  }, []);

  // Lista filtrada (ID + Nombre)
  const listaFiltrada = useMemo(() => {
    const idFilter = filtroNumeroId.trim();
    const nameFilter = normalize(filtroNombre.trim());
    if (!idFilter && !nameFilter) return todosEstudiantes;

    return (todosEstudiantes || []).filter((est) => {
      const matchId =
        !idFilter || (est.numeroId && String(est.numeroId).includes(idFilter));

      const fullName = `${est.nombres || ""} ${est.apellidos || ""}`;
      const matchName = !nameFilter || normalize(fullName).includes(nameFilter);

      return matchId && matchName;
    });
  }, [todosEstudiantes, filtroNumeroId, filtroNombre]);

  // Recalcular página si los filtros reducen el total
  const totalPaginas = Math.max(1, Math.ceil(listaFiltrada.length / limit));
  useEffect(() => {
    if (pagina > totalPaginas) setPagina(totalPaginas);
  }, [totalPaginas, pagina]);

  // Slice de la página actual
  const paginaData = useMemo(() => {
    const start = (pagina - 1) * limit;
    const end = start + limit;
    return listaFiltrada.slice(start, end);
  }, [listaFiltrada, pagina, limit]);

  // Descargar Excel (de todo)
  const descargarBaseDatos = async () => {
    try {
      const response = await axios.get(`${API_BASE}/estudiantes`);
      const estudiantesData = response.data || [];

      const estudiantesConCursos = estudiantesData.map((estudiante) => {
        const cursosTexto = (estudiante.cursos || [])
          .map(
            (curso) =>
              `${curso.nombreCurso} (Vencimiento: ${new Date(
                curso.vencimiento
              ).toLocaleDateString()})`
          )
          .join(", ");
        return { ...estudiante, cursos: cursosTexto };
      });

      const worksheet = XLSX.utils.json_to_sheet(estudiantesConCursos);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Estudiantes");
      XLSX.writeFile(workbook, "estudiantes.xlsx");
    } catch (error) {
      console.error("Error al descargar la base de datos:", error);
      Swal.fire("Error", "No se pudo descargar la base de datos.", "error");
    }
  };

  // Detalles
  const mostrarDetalles = (estudiante) => {
    Swal.fire({
      title: `${estudiante.nombres} ${estudiante.apellidos}`,
      html: `
        <p><b>Email:</b> ${estudiante.email || "-"}</p>
        <p><b>Número de documento:</b> ${estudiante.numeroId || "-"}</p>
        <p><b>Celular:</b> ${estudiante.celular || "-"}</p>
        <p><b>Celular Adicional:</b> ${estudiante.celularAdicional || "-"}</p>
        <p><b>Ciudad:</b> ${estudiante.ciudadResidencia || "-"}</p>
        <p><b>Dirección:</b> ${estudiante.direccion || "-"}</p>
        <p><b>Apodo:</b> ${estudiante.comoTeGustariaQueTeLlamen || "-"}</p>
        <p><b>Profesión:</b> ${estudiante.profesion || "-"}</p>
      `,
      icon: "info",
    });
  };

  // Editar/actualizar
  const editarEstudiante = (estudiante) => {
    Swal.fire({
      title: `Editar ${estudiante.nombres} ${estudiante.apellidos}`,
      html: `
        <input id="nombres" class="swal2-input" placeholder="Nombres" value="${estudiante.nombres || ""}">
        <input id="apellidos" class="swal2-input" placeholder="Apellidos" value="${estudiante.apellidos || ""}">
        <input id="email" class="swal2-input" placeholder="Email" value="${estudiante.email || ""}">
        <input id="numeroId" class="swal2-input" placeholder="Número de documento" value="${estudiante.numeroId || ""}">
        <input id="celular" class="swal2-input" placeholder="Celular" value="${estudiante.celular || ""}">
        <input id="celularAdicional" class="swal2-input" placeholder="Celular adicional" value="${estudiante.celularAdicional || ""}">
        <input id="ciudadResidencia" class="swal2-input" placeholder="Ciudad" value="${estudiante.ciudadResidencia || ""}">
        <input id="direccion" class="swal2-input" placeholder="Dirección" value="${estudiante.direccion || ""}">
        <input id="comoTeGustariaQueTeLlamen" class="swal2-input" placeholder="Apodo" value="${estudiante.comoTeGustariaQueTeLlamen || ""}">
      `,
      confirmButtonText: "Guardar Cambios",
      focusConfirm: false,
      preConfirm: () => {
        return {
          nombres: Swal.getPopup().querySelector("#nombres").value,
          apellidos: Swal.getPopup().querySelector("#apellidos").value,
          email: Swal.getPopup().querySelector("#email").value,
          numeroId: Swal.getPopup().querySelector("#numeroId").value,
          celular: Swal.getPopup().querySelector("#celular").value,
          celularAdicional: Swal.getPopup().querySelector("#celularAdicional").value,
          ciudadResidencia: Swal.getPopup().querySelector("#ciudadResidencia").value,
          direccion: Swal.getPopup().querySelector("#direccion").value,
          comoTeGustariaQueTeLlamen:
            Swal.getPopup().querySelector("#comoTeGustariaQueTeLlamen").value,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) actualizarEstudiante(estudiante._id, result.value);
    });
  };

  const actualizarEstudiante = async (id, datos) => {
    try {
      await axios.put(`${API_BASE}/estudiantes/${id}`, datos);
      Swal.fire("¡Actualizado!", "Los datos del estudiante han sido actualizados.", "success");
      cargarTodos();
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar la información del estudiante.", "error");
    }
  };

  // Agregar por correo
  const agregarPorCorreo = async () => {
    const email = nuevoEmail.trim();
    if (!email) {
      Swal.fire("Atención", "Ingresa un correo válido.", "warning");
      return;
    }
    try {
      await axios.post(`${API_BASE}/estudiantes`, { email });
      Swal.fire("Listo", "Estudiante creado por correo.", "success");
      setNuevoEmail("");
      cargarTodos();
    } catch (error) {
      console.error("Error al crear estudiante:", error);
      Swal.fire("Error", "No se pudo crear el estudiante.", "error");
    }
  };

  return (
    <div className="page-wrap">
      {/* Header con toggle */}
      <header className="header">
        <h1 className="title">Lista de estudiantes</h1>
        <button
          type="button"
          className="theme-toggle"
          aria-label={`Cambiar a modo ${isDark ? "claro" : "oscuro"}`}
          onClick={() => setIsDark((v) => !v)}
        >
          <span className="theme-toggle__thumb" />
          <span className="theme-toggle__label">{isDark ? "Oscuro" : "Claro"}</span>
        </button>
      </header>

      {/* Controles */}
      <section className="toolbar">
        <div className="filters">
          <input
            type="text"
            placeholder="Filtrar por número de ID"
            className="input"
            value={filtroNumeroId}
            onChange={(e) => setFiltroNumeroId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Buscar por nombre y apellido"
            className="input"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={() => setPagina(1)}  // solo resetea a página 1; filtros son reactivos
            disabled={loading}
          >
            Buscar
          </button>
          <button
            className="btn"
            onClick={() => {
              setFiltroNombre("");
              setFiltroNumeroId("");
              setPagina(1);
            }}
            disabled={loading}
            title="Limpiar filtros"
          >
            Limpiar
          </button>
        </div>

        <div className="adder">
          
          <button className="btn btn-outline" onClick={descargarBaseDatos} disabled={loading}>
            Descargar Base de Datos (Excel)
          </button>
        </div>
      </section>

      {/* Tabla */}
      <div className="card-list">
  <div className="table-wrap">
    <table className="data-table">   {/* <-- antes: className="table" */}
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Número de ID</th>
          <th>Cursos</th>
          <th style={{ width: 180 }}>Acciones</th>
        </tr>
      </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="center">Cargando…</td></tr>
              ) : paginaData.length === 0 ? (
                <tr><td colSpan={4} className="center">Sin resultados</td></tr>
              ) : (
                paginaData.map((estudiante, idx) => (
                  <tr key={estudiante._id || idx}>
                    <td>
                      {estudiante.nombres} {estudiante.apellidos}
                      <div className="muted">{estudiante.email}</div>
                    </td>
                    <td>{estudiante.numeroId}</td>
                    <td>
                      {(estudiante.cursos || []).map((curso, i) => (
                        <div key={i} className="course">
                          <div>{curso.nombreCurso}</div>
                          <div className="muted small">
                            {new Date(curso.vencimiento).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </td>
                    <td className="center">
                      <button className="btn btn-ghost" onClick={() => mostrarDetalles(estudiante)}>
                        Ver
                      </button>
                      <button className="btn btn-warning" onClick={() => editarEstudiante(estudiante)}>
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación cliente */}
        <div className="pagination">
          <div className="pager">
            <button className="btn" onClick={() => setPagina(1)} disabled={loading || pagina === 1} title="Primera">
              «
            </button>
            <button
              className="btn"
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={loading || pagina === 1}
              title="Anterior"
            >
              ‹
            </button>
            <span className="page-indicator">
              Página <strong>{pagina}</strong> de <strong>{totalPaginas}</strong>
            </span>
            <button
              className="btn"
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              disabled={loading || pagina >= totalPaginas}
              title="Siguiente"
            >
              ›
            </button>
          </div>

          <div className="page-size">
            <label>
              Por página:
              <select
                className="select"
                value={limit}
                onChange={(e) => {
                  setPagina(1);
                  setLimit(Number(e.target.value));
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </label>
            <span className="muted small">
              {listaFiltrada.length} resultados
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientesLista;

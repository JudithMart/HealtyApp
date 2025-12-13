// src/modules/pacientes/PacientesList.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPacientes, deletePaciente } from "./pacientes.api";
import { ui } from "../../styles/ui";

export default function PacientesList() {
  const [pacientes, setPacientes] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [genero, setGenero] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function cargarPacientes() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchPacientes({ page, search, genero });
      setPacientes(data.resultados);
      setTotal(data.total);
    } catch (e) {
      setError("No se pudieron cargar los pacientes.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarPacientes();
  }, [page, search, genero]);

  function handleNuevo() {
    navigate("/pacientes/nuevo");
  }

  async function handleEliminar(id) {
    if (!window.confirm("¿Seguro que deseas eliminar este paciente?")) return;
    try {
      await deletePaciente(id);
      cargarPacientes();
    } catch (e) {
      alert("Ocurrió un error al eliminar el paciente.");
      console.error(e);
    }
  }

  function handleEditar(id) {
    navigate(`/pacientes/${id}/editar`);
  }

  const pageSize = 10;
  const totalPaginas = Math.ceil(total / pageSize) || 1;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Pacientes</h2>
            <p style={styles.subtitle}>
              Administra la información de tus pacientes
            </p>
          </div>
          <button style={styles.btnPrimary} onClick={handleNuevo}>
            Nuevo paciente
          </button>
        </div>

        {/* Filtros */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>Filtros de búsqueda</h3>
          <div style={styles.filterGrid}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Buscar</label>
              <input
                style={styles.input}
                placeholder="Nombre o apellido"
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Género</label>
              <select
                style={styles.select}
                value={genero}
                onChange={(e) => {
                  setPage(1);
                  setGenero(e.target.value);
                }}
              >
                <option value="">Todos</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>
            Lista de pacientes
            {total > 0 && (
              <span style={styles.badge}>{total} total</span>
            )}
          </h3>

          {error && <p style={styles.error}>{error}</p>}
          
          {loading ? (
            <div style={styles.emptyState}>
              <p>Cargando pacientes...</p>
            </div>
          ) : pacientes.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyTitle}>No hay pacientes para mostrar</p>
              <p style={styles.emptyText}>
                {search || genero 
                  ? "No se encontraron pacientes con los filtros aplicados"
                  : "Comienza agregando tu primer paciente"
                }
              </p>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Nombre</th>
                    <th style={styles.th}>Apellido</th>
                    <th style={styles.th}>Género</th>
                    <th style={styles.th}>Edad</th>
                    <th style={styles.th}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pacientes.map((p) => (
                    <tr key={p.id} style={styles.tr}>
                      <td style={styles.td}>
                        <strong>{p.nombre}</strong>
                      </td>
                      <td style={styles.td}>{p.apellido}</td>
                      <td style={styles.td}>
                        {p.genero || '-'}
                      </td>
                      <td style={styles.td}>{p.edad || '-'}</td>
                      <td style={styles.td}>
                        <div style={styles.actionButtons}>
                          <button
                            style={styles.btnAction}
                            onClick={() => handleEditar(p.id)}
                          >
                            Editar
                          </button>
                          <button
                            style={styles.btnView}
                            onClick={() => navigate(`/pacientes/${p.id}/citas`)}
                          >
                            Ver citas
                          </button>
                          <button
                            style={styles.btnDelete}
                            onClick={() => handleEliminar(p.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div style={styles.pagination}>
              <button
                style={{
                  ...styles.btnSecondary,
                  opacity: page === 1 ? 0.5 : 1,
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                }}
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </button>

              <span style={styles.pageInfo}>
                Página {page} de {totalPaginas}
              </span>

              <button
                style={{
                  ...styles.btnSecondary,
                  opacity: page >= totalPaginas ? 0.5 : 1,
                  cursor: page >= totalPaginas ? 'not-allowed' : 'pointer',
                }}
                disabled={page >= totalPaginas}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: 20,
    background: "#F5F3FF",
    minHeight: "100vh",
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  title: {
    color: "#5D3FD3",
    fontSize: 28,
    fontWeight: 700,
    margin: 0,
    marginBottom: 4,
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 14,
    margin: 0,
  },
  card: {
    background: "#fff",
    padding: 24,
    borderRadius: 12,
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#374151",
    fontSize: 16,
    fontWeight: 600,
    margin: 0,
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  badge: {
    background: "#EDE9FE",
    color: "#5D3FD3",
    padding: "4px 12px",
    borderRadius: 16,
    fontSize: 12,
    fontWeight: 600,
  },
  filterGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 16,
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontWeight: 600,
    marginBottom: 6,
    color: "#374151",
    fontSize: 14,
  },
  input: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #D1D5DB",
    fontSize: 14,
    transition: "border-color 0.2s",
  },
  select: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #D1D5DB",
    fontSize: 14,
    background: "#fff",
    cursor: "pointer",
    transition: "border-color 0.2s",
  },
  btnPrimary: {
    background: "#7B4BDB",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
    transition: "background 0.2s",
  },
  btnSecondary: {
    background: "#EDE9FE",
    color: "#5D3FD3",
    border: "none",
    padding: "10px 20px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
    transition: "background 0.2s",
  },
  error: {
    color: "#B91C1C",
    background: "#FEE2E2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  emptyState: {
    textAlign: "center",
    padding: 60,
    color: "#9CA3AF",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#6B7280",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    background: "#EDE9FE",
    padding: 12,
    textAlign: "left",
    fontWeight: 600,
    color: "#5D3FD3",
    fontSize: 14,
    borderBottom: "2px solid #D8B4FE",
  },
  tr: {
    transition: "background 0.2s",
  },
  td: {
    padding: 12,
    borderBottom: "1px solid #E5E7EB",
    fontSize: 14,
    color: "#374151",
  },
  actionButtons: {
    display: "flex",
    gap: 6,
  },
  btnAction: {
    background: "#7B4BDB",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    transition: "background 0.2s",
  },
  btnView: {
    background: "#EDE9FE",
    color: "#5B21B6",
    border: "none",
    borderRadius: 6,
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    transition: "background 0.2s",
  },
  btnDelete: {
    background: "#FEE2E2",
    color: "#991B1B",
    border: "none",
    borderRadius: 6,
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
    transition: "background 0.2s",
  },
  pagination: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 20,
    borderTop: "1px solid #E5E7EB",
  },
  pageInfo: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: 500,
  },
};
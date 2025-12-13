// src/modules/notas/NotasList.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { fetchNotas, deleteNota } from "./notas.api";
import { ui } from "../../styles/ui";

export default function NotasList() {
  const navigate = useNavigate();
  const { id: routeCitaId } = useParams();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const citaQuery = params.get("cita") || "";

  const citaFilter = citaQuery || routeCitaId || "";

  const [notas, setNotas] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const pageSize = 10;
  const totalPages = Math.ceil(total / pageSize) || 1;

  async function cargarNotas() {
    setLoading(true);
    try {
      const data = await fetchNotas({ page, cita: citaFilter });
      setNotas(data.resultados);
      setTotal(data.total);
    } catch (e) {
      console.error("Error al cargar notas:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarNotas();
  }, [page, citaFilter]);

  function handleNuevo() {
    navigate(`/notas/nueva${citaFilter ? `?cita=${citaFilter}` : ""}`);
  }

  function handleEditar(id) {
    navigate(`/notas/${id}/editar${citaFilter ? `?cita=${citaFilter}` : ""}`);
  }

  async function handleEliminar(id) {
    if (!window.confirm("¿Deseas eliminar este registro psicológico?")) return;
    try {
      await deleteNota(id);
      cargarNotas();
    } catch (e) {
      console.error("Error al eliminar:", e);
      alert("Error al eliminar el registro");
    }
  }

  return (
    <div style={ui.page}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={ui.title}>Registro psicológico</h2>
          <p style={ui.subtitle}>
            Seguimiento emocional del paciente
            {citaFilter && ` · Cita #${citaFilter}`}
          </p>
        </div>

        <button style={ui.button} onClick={handleNuevo}>
          Nuevo registro
        </button>
      </div>

      {loading ? (
        <p>Cargando registros...</p>
      ) : notas.length === 0 ? (
        <div style={{ ...ui.card, textAlign: "center", color: "#6B7280" }}>
          No hay registros psicológicos para mostrar.
        </div>
      ) : (
        notas.map((nota) => (
          <div key={nota.id} style={ui.card}>
            <div style={{ marginBottom: 8, fontWeight: 600 }}>
              {nota.fecha}
            </div>

            <div style={{ color: "#6B7280", marginBottom: 8 }}>
              Cumplió: <strong>{nota.cumplio ? "Sí" : "No"}</strong>
            </div>

            <div style={{ marginBottom: 12 }}>
              {nota.observaciones || "Sin observaciones"}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button style={ui.buttonSecondary} onClick={() => handleEditar(nota.id)}>
                Editar
              </button>

              <button
                style={{ ...ui.buttonSecondary, color: "#B91C1C" }}
                onClick={() => handleEliminar(nota.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))
      )}

      <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 12 }}>
        <button
          style={ui.button}
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Anterior
        </button>

        <span>
          Página {page} de {totalPages}
        </span>

        <button
          style={ui.button}
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
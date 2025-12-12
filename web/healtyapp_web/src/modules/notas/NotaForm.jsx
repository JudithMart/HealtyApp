import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { createNota, fetchNotaById, updateNota } from "./notas.api";

const style = {
  page: { padding: 18, background: "#FFFFFF", minHeight: "80vh", color: "#333" },
  card: { background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 6px 18px rgba(0,0,0,0.06)" },
  label: { display: "block", marginTop: 12, marginBottom: 6, fontWeight: 600, color: "#333" },
  input: { width: "100%", padding: 10, borderRadius: 8, border: "1px solid #E0E0E0" },
  btnPrimary: { background: "#7B4BDB", color: "#fff", padding: "10px 14px", border: "none", borderRadius: 8, cursor: "pointer", marginTop: 14 }
};

export default function NotaForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // id de la nota si estamos editando
  const location = useLocation();
  const qs = new URLSearchParams(location.search);
  const citaQuery = qs.get("cita");

  const [citaId, setCitaId] = useState(citaQuery || "");
  const [fecha, setFecha] = useState("");
  const [estadoEmocional, setEstadoEmocional] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [recomendaciones, setRecomendaciones] = useState("");
  const [riesgos, setRiesgos] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchNotaById(id).then(n => {
        setCitaId(n.citaId || "");
        setFecha(n.fecha || "");
        setEstadoEmocional(n.estado_emocional || "");
        setObservaciones(n.observaciones || "");
        setRecomendaciones(n.recomendaciones || "");
        setRiesgos(n.riesgos || "");
      }).catch(e => {
        console.error(e);
        setError("Error al cargar nota");
      }).finally(() => setLoading(false));
    }
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!citaId) {
      alert("El registro debe estar asociado a una cita válida (param cita).");
      return;
    }
    const payload = {
      cita: citaId,
      fecha,
      estado_emocional: estadoEmocional,
      observaciones,
      recomendaciones,
      riesgos
    };
    setLoading(true);
    try {
      if (id) {
        await updateNota(id, payload);
      } else {
        await createNota(payload);
      }
      navigate("/notas");
    } catch (e) {
      console.error(e);
      alert("Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={style.page}>
      <div style={style.card}>
        <h3 style={{ color: "#5D3FD3" }}>{id ? "Editar nota psicológica" : "Nueva nota psicológica"}</h3>

        <form onSubmit={handleSubmit}>
          <label style={style.label}>Cita (ID)</label>
          <input style={style.input} value={citaId} onChange={e => setCitaId(e.target.value)} placeholder="ID de la cita" />

          <label style={style.label}>Fecha</label>
          <input style={style.input} type="date" value={fecha} onChange={e => setFecha(e.target.value)} />

          <label style={style.label}>Estado emocional</label>
          <input style={style.input} value={estadoEmocional} onChange={e => setEstadoEmocional(e.target.value)} placeholder="Ej. Ansioso, Triste, Estable" />

          <label style={style.label}>Observaciones</label>
          <textarea style={{ ...style.input, minHeight: 100 }} value={observaciones} onChange={e => setObservaciones(e.target.value)} />

          <label style={style.label}>Recomendaciones</label>
          <textarea style={{ ...style.input, minHeight: 80 }} value={recomendaciones} onChange={e => setRecomendaciones(e.target.value)} />

          <label style={style.label}>Riesgos detectados</label>
          <input style={style.input} value={riesgos} onChange={e => setRiesgos(e.target.value)} placeholder="Si aplica" />

          <div style={{ marginTop: 12 }}>
            <button type="submit" style={style.btnPrimary} disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </button>
            <button type="button" onClick={() => navigate(-1)} style={{ marginLeft: 10 }}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

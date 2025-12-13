// src/modules/notas/NotaForm.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { createNota, fetchNotaById, updateNota } from "./notas.api";
import { ui } from "../../styles/ui";

export default function NotaForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const qs = new URLSearchParams(location.search);
  const citaQuery = qs.get("cita");

  const [form, setForm] = useState({
    cita: citaQuery || "",
    fecha: "",
    cumplio: false,
    observaciones: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchNotaById(id)
        .then((n) => {
          setForm({
            cita: n.citaId || "",
            fecha: n.fecha || "",
            cumplio: n.cumplio || false,
            observaciones: n.observaciones || "",
          });
        })
        .catch((e) => {
          console.error(e);
          setError("Error al cargar registro");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!form.cita) {
      alert("El registro debe estar asociado a una cita válida.");
      return;
    }

    const payload = {
      cita: parseInt(form.cita),
      fecha: form.fecha,
      cumplio: form.cumplio,
      observaciones: form.observaciones,
    };

    setLoading(true);
    try {
      if (id) {
        await updateNota(id, payload);
      } else {
        await createNota(payload);
      }
      // Redirigir a la lista de notas
      if (form.cita) {
        navigate(`/citas/${form.cita}/notas`);
      } else {
        navigate("/notas");
      }
    } catch (e) {
      console.error(e);
      setError("Error al guardar el registro");
      alert("Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={ui.page}>
      <div style={ui.card}>
        <h2 style={ui.title}>
          {id ? "Editar registro psicológico" : "Nuevo registro psicológico"}
        </h2>

        {error && <div style={{ color: "#B91C1C", marginBottom: 12 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", marginTop: 12, marginBottom: 6, fontWeight: 600 }}>
            Cita (ID) *
          </label>
          <input
            style={ui.input}
            name="cita"
            value={form.cita}
            onChange={handleChange}
            placeholder="ID de la cita"
            required
            disabled={!!citaQuery}
          />

          <label style={{ display: "block", marginTop: 12, marginBottom: 6, fontWeight: 600 }}>
            Fecha *
          </label>
          <input
            style={ui.input}
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            required
          />

          <label style={{ display: "flex", alignItems: "center", marginTop: 12, marginBottom: 6, fontWeight: 600 }}>
            <input
              type="checkbox"
              name="cumplio"
              checked={form.cumplio}
              onChange={handleChange}
              style={{ marginRight: 8 }}
            />
            ¿Cumplió con la actividad?
          </label>

          <label style={{ display: "block", marginTop: 12, marginBottom: 6, fontWeight: 600 }}>
            Observaciones
          </label>
          <textarea
            style={{ ...ui.textarea, minHeight: 100 }}
            name="observaciones"
            value={form.observaciones}
            onChange={handleChange}
          />

          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <button type="submit" style={ui.button} disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={ui.buttonSecondary}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
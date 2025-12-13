// src/modules/citas/CitaForm.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { createCita, fetchCitaById, updateCita } from "./citas.api";
import { fetchPacientes } from "../pacientes/pacientes.api";
import { ui } from "../../styles/ui";

export default function CitaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const esEdicion = Boolean(id);

  const qs = new URLSearchParams(location.search);
  const pacienteQuery = qs.get("paciente");

  // ✅ PRIMERO: Estados
  const [form, setForm] = useState({
    paciente: pacienteQuery || "",
    fecha: "",
    hora: "",
    tipo: "primera",
    motivo: "",
    estado: "pendiente",
  });

  const [pacientes, setPacientes] = useState([]);
  const [cargandoInicial, setCargandoInicial] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ SEGUNDO: Funciones
  async function cargarPacientes() {
    try {
      const data = await fetchPacientes({ page: 1, search: "" });
      setPacientes(data.resultados);
    } catch (e) {
      console.error("Error al cargar pacientes:", e);
    }
  }

  async function cargarCita() {
    if (!esEdicion) return;
    try {
      setCargandoInicial(true);
      const data = await fetchCitaById(id);
      setForm({
        paciente: data.pacienteId,
        fecha: data.fecha,
        hora: data.hora,
        tipo: data.tipo,
        motivo: data.motivo,
        estado: data.estado || "pendiente",
      });
    } catch (e) {
      setError("No se pudo cargar la información de la cita.");
      console.error(e);
    } finally {
      setCargandoInicial(false);
    }
  }

  // ✅ TERCERO: Effects
  useEffect(() => {
    cargarPacientes();
    cargarCita();
  }, [id, esEdicion]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const citaData = {
      paciente: parseInt(form.paciente),
      fecha: form.fecha,
      hora: form.hora,
      tipo: form.tipo,
      motivo: form.motivo,
      estado: form.estado,
    };

    try {
      if (esEdicion) {
        await updateCita(id, citaData);
      } else {
        await createCita(citaData);
      }
      navigate("/citas");
    } catch (e) {
      setError("Ocurrió un error al guardar la cita.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (cargandoInicial) {
    return <p style={{ padding: 20 }}>Cargando información...</p>;
  }

  return (
    <div style={ui.page}>
      <div style={ui.card}>
        <h2 style={ui.title}>
          {esEdicion ? "Editar cita psicológica" : "Nueva cita psicológica"}
        </h2>

        {error && <div style={{ color: "#B91C1C", marginBottom: 12 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", marginTop: 12, marginBottom: 6, fontWeight: 600 }}>
            Paciente *
          </label>
          <select
            style={ui.select}
            name="paciente"
            value={form.paciente}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un paciente</option>
            {pacientes.map((pac) => (
              <option key={pac.id} value={pac.id}>
                {pac.nombre} {pac.apellido}
              </option>
            ))}
          </select>

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

          <label style={{ display: "block", marginTop: 12, marginBottom: 6, fontWeight: 600 }}>
            Hora *
          </label>
          <input
            style={ui.input}
            type="time"
            name="hora"
            value={form.hora}
            onChange={handleChange}
            required
          />

          <label style={{ display: "block", marginTop: 12, marginBottom: 6, fontWeight: 600 }}>
            Tipo *
          </label>
          <select
            style={ui.select}
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona tipo</option>
            <option value="primera">Primera vez</option>
            <option value="seguimiento">Seguimiento</option>
          </select>

          <label style={{ display: "block", marginTop: 12, marginBottom: 6, fontWeight: 600 }}>
            Motivo *
          </label>
          <textarea
            style={ui.textarea}
            name="motivo"
            value={form.motivo}
            onChange={handleChange}
            required
          />

          <label style={{ display: "block", marginTop: 12, marginBottom: 6, fontWeight: 600 }}>
            Estado
          </label>
          <select
            style={ui.select}
            name="estado"
            value={form.estado}
            onChange={handleChange}
          >
            <option value="pendiente">Pendiente</option>
            <option value="asistida">Asistida</option>
            <option value="cancelada">Cancelada</option>
          </select>

          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <button style={ui.button} type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              style={ui.buttonSecondary}
              onClick={() => navigate("/citas")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
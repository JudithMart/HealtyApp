// src/modules/citas/CitaForm.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createCita, fetchCitaById, updateCita } from "./citas.api";
import { fetchPacientes } from "../pacientes/pacientes.api";

export default function CitaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const esEdicion = Boolean(id);

  const [pacientes, setPacientes] = useState([]);
  const [form, setForm] = useState({
    paciente: "",
    fecha: "",
    hora: "",
    tipo: "",
    motivo: "",
    notas: "",
  });

  const [cargandoInicial, setCargandoInicial] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        notas: data.notas || "",
      });
    } catch (e) {
      setError("No se pudo cargar la información de la cita.");
    } finally {
      setCargandoInicial(false);
    }
  }

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
      paciente: form.paciente,
      fecha: form.fecha,
      hora: form.hora,
      tipo: form.tipo,
      motivo: form.motivo,
      notas: form.notas,
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
    } finally {
      setLoading(false);
    }
  }

  if (cargandoInicial) {
    return <p>Cargando información...</p>;
  }

  return (
    <div>
      <h2>{esEdicion ? "Editar cita" : "Nueva cita"}</h2>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Paciente</label>
          <select
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
        </div>

        <div>
          <label>Fecha</label>
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Hora</label>
          <input
            type="time"
            name="hora"
            value={form.hora}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Tipo de cita</label>
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un tipo</option>
            <option value="Primera vez">Primera vez</option>
            <option value="Seguimiento">Seguimiento</option>
          </select>
        </div>

        <div>
          <label>Motivo</label>
          <textarea
            name="motivo"
            value={form.motivo}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Notas</label>
          <textarea
            name="notas"
            value={form.notas}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>

        <button type="button" onClick={() => navigate("/citas")}>
          Cancelar
        </button>
      </form>
    </div>
  );
}

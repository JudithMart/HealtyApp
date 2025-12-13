// src/modules/pacientes/PacienteForm.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createPaciente, fetchPacienteById, updatePaciente } from "./pacientes.api";
import { ui } from "../../styles/ui";

export default function PacienteForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    genero: "",
    edad: "",
  });

  const [loading, setLoading] = useState(false);
  const [cargandoInicial, setCargandoInicial] = useState(false);
  const [error, setError] = useState("");

  const esEdicion = Boolean(id);

  useEffect(() => {
    if (!esEdicion) return;

    async function cargarPaciente() {
      try {
        setCargandoInicial(true);
        const data = await fetchPacienteById(id);
        setForm({
          nombre: data.nombre || "",
          apellido: data.apellido || "",
          genero: data.genero || "",
          edad: data.edad || "",
        });
      } catch (e) {
        setError("No se pudo cargar la información del paciente.");
        console.error(e);
      } finally {
        setCargandoInicial(false);
      }
    }

    cargarPaciente();
  }, [id, esEdicion]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (esEdicion) {
        await updatePaciente(id, form);
      } else {
        await createPaciente(form);
      }
      navigate("/pacientes");
    } catch (e) {
      setError("Ocurrió un error al guardar el paciente.");
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
          {esEdicion ? "Editar paciente" : "Nuevo paciente"}
        </h2>

        {error && <div style={{ color: "#B91C1C", marginBottom: 12 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", marginTop: 12, marginBottom: 6, fontWeight: 600 }}>
            Nombre *
          </label>
          <input
            style={ui.input}
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />

          <label style={{ display: "block", marginTop: 12, marginBottom: 6, fontWeight: 600 }}>
            Apellido *
          </label>
          <input
            style={ui.input}
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            required
          />

          <label style={{ display: "block", marginTop: 12, marginBottom: 6, fontWeight: 600 }}>
            Género
          </label>
          <select
            style={ui.select}
            name="genero"
            value={form.genero}
            onChange={handleChange}
          >
            <option value="">Selecciona una opción</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>

          <label style={{ display: "block", marginTop: 12, marginBottom: 6, fontWeight: 600 }}>
            Edad
          </label>
          <input
            style={ui.input}
            type="number"
            name="edad"
            value={form.edad}
            onChange={handleChange}
          />

          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <button type="submit" style={ui.button} disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              style={ui.buttonSecondary}
              onClick={() => navigate("/pacientes")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
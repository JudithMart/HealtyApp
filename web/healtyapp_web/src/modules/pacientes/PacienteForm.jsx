// src/modules/pacientes/PacienteForm.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createPaciente,
  fetchPacienteById,
  updatePaciente,
} from "./pacientes.api";

export default function PacienteForm() {
  const { id } = useParams(); // si existe, estamos en modo edición
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    genero: "",
    edad: "",
    telefono: "",
    email: "",
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
          telefono: data.telefono || "",
          email: data.email || "",
        });
      } catch (e) {
        setError("No se pudo cargar la información del paciente.");
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
    } finally {
      setLoading(false);
    }
  }

  if (cargandoInicial) {
    return <p>Cargando información...</p>;
  }

  return (
    <div>
      <h2>{esEdicion ? "Editar paciente" : "Nuevo paciente"}</h2>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Apellido</label>
          <input
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Género</label>
          <select name="genero" value={form.genero} onChange={handleChange}>
            <option value="">Selecciona una opción</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
        </div>

        <div>
          <label>Edad</label>
          <input
            name="edad"
            type="number"
            value={form.edad}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Teléfono</label>
          <input
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Correo electrónico</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Guardar"}
        </button>
        <button type="button" onClick={() => navigate("/pacientes")}>
          Cancelar
        </button>
      </form>
    </div>
  );
}

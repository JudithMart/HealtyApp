// src/modules/citas/CitasList.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCitas, deleteCita } from "./citas.api";
import { fetchPacientes } from "../pacientes/pacientes.api"; // usando la API ya creada
import { ui } from "../../styles/ui";


export default function CitasList() {
  const navigate = useNavigate();
  const { id } = useParams();
  const pacienteRutaId = id ? id.toString() : "";





  const [citas, setCitas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [pacienteId, setPacienteId] = useState(pacienteRutaId || "");
  const [tipo, setTipo] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pageSize = 10; // ajusta a tu configuración
  const totalPaginas = Math.ceil(total / pageSize);

 async function cargarPacientes() {
  try {
    const data = await fetchPacientes({ page: 1 });
    setPacientes(data.resultados);
  } catch (e) {
    console.error(e);
  }
}


  async function cargarCitas() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchCitas({
        page,
        pacienteId,
        tipo,
        fechaInicio,
        fechaFin,
      });
      setCitas(data.resultados);
      setTotal(data.total);
    } catch (e) {
      setError("No se pudieron cargar las citas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarPacientes();
  }, []);

  // Cuando la ruta cambia (/pacientes/:id/citas)
  useEffect(() => {
    if (pacienteRutaId && pacienteRutaId !== pacienteId) {
      setPacienteId(pacienteRutaId);
      setPage(1);
    }
  }, [pacienteRutaId]);


  useEffect(() => {
    cargarCitas();
  }, [page, pacienteId, tipo, fechaInicio, fechaFin]);

  function handleNuevaCita() {
    navigate("/citas/nueva");
  }

  function handleEditar(id) {
    navigate(`/citas/${id}/editar`);
  }

  async function handleEliminar(id) {
    const confirmar = window.confirm("¿Seguro que deseas eliminar esta cita?");
    if (!confirmar) return;

    try {
      await deleteCita(id);
      cargarCitas();
    } catch (e) {
      alert("Ocurrió un error al eliminar la cita.");
    }
  }

  return (
    <div style={ui.page}>
      <h2 style={ui.title}>Citas psicológicas</h2>

      <button
        style={ui.button}
        onClick={() =>
          pacienteId
            ? navigate(`/citas/nueva?paciente=${pacienteId}`)
            : navigate("/citas/nueva")
        }
      >
        Nueva cita
      </button>



      {citas.map((cita) => (
        <div key={cita.id} style={ui.card}>
          <strong>{cita.fecha} – {cita.hora}</strong>
          <p style={{ color: "#6B7280" }}>{cita.tipo}</p>
          <p>{cita.motivo}</p>

          <div style={{ display: "flex", gap: 10 }}>
            <button style={ui.button} onClick={() => handleEditar(cita.id)}>Editar</button>
            <button style={ui.buttonSecondary} onClick={() => navigate(`/citas/${cita.id}/notas`)}>
              Ver registros
            </button>
            <button
              style={ui.buttonSecondary}
              onClick={() => navigate(`/notas/nueva?cita=${cita.id}`)}
            >
              Registrar nota
            </button>

          </div>
        </div>
      ))}
    </div>

  );
}

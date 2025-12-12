// src/modules/pacientes/PacientesList.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPacientes, deletePaciente } from "./pacientes.api";

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
    const confirmar = window.confirm("¿Seguro que deseas eliminar este paciente?");
    if (!confirmar) return;

    try {
      await deletePaciente(id);
      cargarPacientes();
    } catch (e) {
      alert("Ocurrió un error al eliminar el paciente.");
    }
  }

  function handleEditar(id) {
    navigate(`/pacientes/${id}/editar`);
  }

  const pageSize = 10; // ajusta al page_size que uses
  const totalPaginas = Math.ceil(total / pageSize);

  return (
    <div>
      <h2>Pacientes</h2>

      {error && <p>{error}</p>}

      {/* Filtros */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Buscar por nombre o apellido"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        {/* Filtro por género */}
        <select
          value={genero}
          onChange={(e) => {
            setPage(1);
            setGenero(e.target.value);
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          <option value="">Todos los géneros</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select>

        <button onClick={handleNuevo} style={{ marginLeft: "1rem" }}>
          Nuevo paciente
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <table border="1" cellPadding="6" cellSpacing="0">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Género</th>
              <th>Edad</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.length === 0 ? (
              <tr>
                <td colSpan="6">No hay pacientes para mostrar.</td>
              </tr>
            ) : (
              pacientes.map((paciente) => (
                <tr key={paciente.id}>
                  <td>{paciente.nombre}</td>
                  <td>{paciente.apellido}</td>
                  <td>{paciente.genero}</td>
                  <td>{paciente.edad}</td>
                  <td>{paciente.telefono}</td>
                  <td>
                    <button onClick={() => handleEditar(paciente.id)}>Editar</button>
                    <button onClick={() => handleEliminar(paciente.id)}>Eliminar</button>
                    <button onClick={() => navigate(`/pacientes/${paciente.id}/citas`)}>
                      Ver citas
                    </button>

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Paginación simple */}
      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
          Anterior
        </button>

        <span style={{ margin: "0 0.5rem" }}>
          Página {page} de {totalPaginas || 1}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPaginas}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

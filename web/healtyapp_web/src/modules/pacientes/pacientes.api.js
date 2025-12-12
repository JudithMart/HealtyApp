// src/modules/pacientes/pacientes.api.js
import api from "../../api/axios";
import { mapPacienteFromApi, mapPageResponse } from "./types";

// Obtener lista de pacientes con paginación y filtros
export async function fetchPacientes({ page = 1, search = "", genero = "" }) {
  const params = { page };

  if (search) {
    // si configuraste search en tu backend (por nombre/apellido)
    params.search = search;
  }

  if (genero) {
    params.genero = genero; // ajusta al nombre real del filtro si aplica
  }

  const response = await api.get("/pacientes/", { params });
  return mapPageResponse(response.data, mapPacienteFromApi);
}

// Obtener un paciente por id (para editar)
export async function fetchPacienteById(id) {
  const response = await api.get(`/pacientes/${id}/`);
  return mapPacienteFromApi(response.data);
}

// Crear nuevo paciente
export async function createPaciente(pacienteData) {
  const response = await api.post("/pacientes/", pacienteData);
  return mapPacienteFromApi(response.data);
}

// Actualizar paciente existente
export async function updatePaciente(id, pacienteData) {
  const response = await api.put(`/pacientes/${id}/`, pacienteData);
  return mapPacienteFromApi(response.data);
}

// Eliminar paciente
export async function deletePaciente(id) {
  await api.delete(`/pacientes/${id}/`);
}

// src/modules/citas/citas.api.js
import api from "../../api/axios";
import { mapCitaFromApi, mapPageResponse } from "./types";

// Obtener citas con paginación y filtros
export async function fetchCitas({
  page = 1,
  pacienteId = "",
  tipo = "",
  fechaInicio = "",
  fechaFin = "",
}) {
  const params = { page };

  if (pacienteId) {
    params.paciente = pacienteId; // ajusta al nombre real del filtro en tu backend
  }
  if (tipo) {
    params.tipo = tipo;
  }
  if (fechaInicio) {
    params.fecha_inicio = fechaInicio; // ajusta a tus filtros
  }
  if (fechaFin) {
    params.fecha_fin = fechaFin;
  }

  const response = await api.get("/citas/", { params });
  return mapPageResponse(response.data, mapCitaFromApi);
}

// Obtener cita por id (para edición)
export async function fetchCitaById(id) {
  const response = await api.get(`/citas/${id}/`);
  return mapCitaFromApi(response.data);
}

// Crear cita
export async function createCita(citaData) {
  const response = await api.post("/citas/", citaData);
  return mapCitaFromApi(response.data);
}

// Actualizar cita
export async function updateCita(id, citaData) {
  const response = await api.put(`/citas/${id}/`, citaData);
  return mapCitaFromApi(response.data);
}

// Eliminar cita
export async function deleteCita(id) {
  await api.delete(`/citas/${id}/`);
}

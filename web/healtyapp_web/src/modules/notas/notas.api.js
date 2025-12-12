// src/modules/notas/notas.api.js
import api from "../../api/axios";
import { mapNotaFromApi, mapPageResponse } from "./types";

// *** RUTA REAL DEL BACKEND ***
const BASE = "/registros/";

export async function fetchNotas({ page = 1, cita = "" }) {
  const params = { page };
  if (cita) params.cita = cita;

  const res = await api.get(BASE, { params });
  return mapPageResponse(res.data, mapNotaFromApi);
}

export async function fetchNotaById(id) {
  const res = await api.get(`${BASE}${id}/`);
  return mapNotaFromApi(res.data);
}

export async function createNota(data) {
  const res = await api.post(BASE, data);
  return mapNotaFromApi(res.data);
}

export async function updateNota(id, data) {
  const res = await api.put(`${BASE}${id}/`, data);
  return mapNotaFromApi(res.data);
}

export async function deleteNota(id) {
  await api.delete(`${BASE}${id}/`);
}

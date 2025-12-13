// src/modules/reportes/reportes.api.js
import api from "../../api/axios";
import { mapReporteFromApi } from "./types";

export async function fetchReportes({ pacienteId }) {
  const params = {};
  if (pacienteId) params.paciente = pacienteId;

  const res = await api.get("/citas/", { params });

  return res.data.results.map(mapReporteFromApi);
}



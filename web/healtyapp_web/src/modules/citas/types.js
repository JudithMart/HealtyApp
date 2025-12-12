// src/modules/citas/types.js

// Mapear cita desde la respuesta de la API
export function mapCitaFromApi(apiCita) {
  return {
    id: apiCita.id,
    pacienteId: apiCita.paciente,                  // id del paciente
    // Si quieres mostrar el nombre, expónlo en el backend (SerializerMethodField) o déjalo null/''
    pacienteNombre: apiCita.paciente_nombre ?? "",
    fecha: apiCita.fecha,
    hora: apiCita.hora,
    motivo: apiCita.motivo,
    tipo: apiCita.tipo,                          // "primera" | "seguimiento"
    estado: apiCita.estado,                      // "pendiente" | "asistida" | "cancelada"
    actividadPsicologica: apiCita.actividad_psicologica ?? "",
    afirmacion: apiCita.afirmacion ?? "",
    createdAt: apiCita.created_at,
  };
}

// Mapear respuesta paginada de DRF
export function mapPageResponse(apiResponse, mapItemFn) {
  return {
    total: apiResponse.count,
    next: apiResponse.next,
    previous: apiResponse.previous,
    resultados: apiResponse.results.map(mapItemFn),
  };
}

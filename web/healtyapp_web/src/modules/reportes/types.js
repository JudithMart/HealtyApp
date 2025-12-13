// src/modules/reportes/types.js
export function mapReporteFromApi(apiCita) {
  return {
    id: apiCita.id,
    paciente: apiCita.paciente_nombre || apiCita.paciente,
    fecha: apiCita.fecha,
    hora: apiCita.hora,
    tipo: apiCita.tipo,
    motivo: apiCita.motivo,
    especialidad: apiCita.especialidad || "",
  };
}

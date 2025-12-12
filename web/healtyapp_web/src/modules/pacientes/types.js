// src/modules/pacientes/types.js

export function mapPacienteFromApi(apiPaciente) {
  return {
    id: apiPaciente.id,
    nombre: apiPaciente.nombre,
    apellido: apiPaciente.apellido,
    genero: apiPaciente.genero, // si existe en tu modelo
    edad: apiPaciente.edad,     // si existe en tu modelo
    telefono: apiPaciente.telefono, // si lo tienes definido
    email: apiPaciente.email,       // opcional
  };
}

// Estructura típica de respuesta de DRF:
// { count, next, previous, results }

export function mapPageResponse(apiResponse, mapItemFn) {
  return {
    total: apiResponse.count,
    next: apiResponse.next,
    previous: apiResponse.previous,
    resultados: apiResponse.results.map(mapItemFn),
  };
}

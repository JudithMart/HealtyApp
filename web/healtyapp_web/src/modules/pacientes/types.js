
// src/modules/pacientes/types.js

export function mapPacienteFromApi(apiPaciente) {
  return {
    id: apiPaciente.id,
    nombre: apiPaciente.nombre,
    apellido: apiPaciente.apellido,
    genero: apiPaciente.genero,
    edad: apiPaciente.edad,
  };
}

export function mapPageResponse(apiResponse, mapItemFn) {
  return {
    total: apiResponse.count,
    next: apiResponse.next,
    previous: apiResponse.previous,
    resultados: apiResponse.results.map(mapItemFn),
  };
}
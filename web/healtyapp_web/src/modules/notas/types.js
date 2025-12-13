
// src/modules/notas/types.js
export function mapNotaFromApi(apiItem) {
  return {
    id: apiItem.id,
    citaId: apiItem.cita,
    fecha: apiItem.fecha || "",
    cumplio: apiItem.cumplio || false,
    observaciones: apiItem.observaciones || "",
  };
}

export function mapPageResponse(apiResponse, mapFn) {
  return {
    total: apiResponse.count ?? 0,
    resultados: (apiResponse.results ?? []).map(mapFn),
    next: apiResponse.next ?? null,
    previous: apiResponse.previous ?? null,
  };
}
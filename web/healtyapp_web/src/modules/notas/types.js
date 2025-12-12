// mapeo de la API a la UI - ajustar campos si tu backend usa otros nombres
export function mapNotaFromApi(apiItem) {
  return {
    id: apiItem.id,
    citaId: apiItem.cita,               // FK a la cita
    fecha: apiItem.fecha || apiItem.created_at || "",
    estado_emocional: apiItem.estado_emocional || "",
    observaciones: apiItem.observaciones || "",
    recomendaciones: apiItem.recomendaciones || "",
    riesgos: apiItem.riesgos || "",
    // campos extra si existen...
  };
}

export function mapPageResponse(apiResponse, mapFn) {
  return {
    total: apiResponse.count ?? 0,
    resultados: (apiResponse.results ?? []).map(mapFn),
    next: apiResponse.next ?? null,
    previous: apiResponse.previous ?? null
  };
}

export interface PuntoMaterial {
  texto: string;
  fuenteId: string;
  /** Artículo, control o sección; vacío cuando es conocimiento técnico general. */
  referencia?: string;
}

/** Material de estudio de un tema. Pendiente de revisión humana, como el banco semilla. */
export interface MaterialTema {
  temaId: string;
  resumen: string;
  puntos: PuntoMaterial[];
  /** Confusiones frecuentes que suelen aparecer como distractores. */
  trampas?: string[];
}

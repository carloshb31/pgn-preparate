import type { Dificultad, ModuloId, Nucleo, Pregunta, TipoPregunta } from "@/lib/domain/types";

type OpcionCorta = [texto: string, justificacion: string];

export interface PreguntaCorta {
  id: string;
  modulo: ModuloId;
  temaId: string;
  subtema?: string;
  nucleo?: Nucleo;
  dificultad: Dificultad;
  tipo: TipoPregunta;
  enunciado: string;
  /** Exactamente 4 opciones en orden A, B, C, D. */
  opciones: [OpcionCorta, OpcionCorta, OpcionCorta, OpcionCorta];
  correcta: "A" | "B" | "C" | "D";
  explicacion: string;
  fuenteId: string;
  referencia?: string;
  esInferencia?: boolean;
  etiquetas?: string[];
}

const LETRAS = ["A", "B", "C", "D"] as const;

/** Hash estable del id (FNV-1a) para ubicar la respuesta correcta de forma pareja entre A y D. */
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/**
 * Reordena las opciones para que la posición de la correcta no siga un patrón
 * (se redactaron con la correcta casi siempre en B). Las demás conservan su orden relativo.
 */
function reubicar(p: PreguntaCorta): { opciones: PreguntaCorta["opciones"]; correcta: PreguntaCorta["correcta"] } {
  const idx = LETRAS.indexOf(p.correcta);
  const destino = hash(p.id) % 4;
  const otras = p.opciones.filter((_, i) => i !== idx);
  const ordenadas = [...otras];
  ordenadas.splice(destino, 0, p.opciones[idx]);
  return { opciones: ordenadas as PreguntaCorta["opciones"], correcta: LETRAS[destino] };
}

/**
 * Las preguntas semilla se publican en estado `pendiente_revision`:
 * fueron redactadas para esta convocatoria pero aún no han sido validadas por una persona.
 */
export function q(original: PreguntaCorta): Pregunta {
  const p = { ...original, ...reubicar(original) };
  return {
    id: p.id,
    modulo: p.modulo,
    temaId: p.temaId,
    subtema: p.subtema,
    nucleo: p.nucleo ?? (p.modulo === "M7_INSTITUCIONAL" ? "general" : "especifico"),
    dificultad: p.dificultad,
    tipo: p.tipo,
    enunciado: p.enunciado,
    opciones: p.opciones.map(([texto, justificacion], i) => ({ id: LETRAS[i], texto, justificacion })),
    correcta: p.correcta,
    explicacion: p.explicacion,
    fuenteId: p.fuenteId,
    referencia: p.referencia,
    esInferencia: p.esInferencia ?? false,
    etiquetas: p.etiquetas ?? [],
    estado: "pendiente_revision",
    autor: "semilla"
  };
}

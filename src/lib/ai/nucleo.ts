// Prompts, esquemas y validación de la IA, compartidos por el servidor Next y el artifact.
import { z } from "zod";
import type { Pregunta } from "@/lib/domain/types";
import { temaPorId } from "@/lib/content/temario";
import { FUENTE_POR_ID } from "@/lib/content/fuentes";
import { CONVOCATORIA } from "@/lib/config/convocatoria";
import { uid } from "@/lib/domain/util";
import { corpusBase, formatearContexto, ordenarPorRelevancia, type Fragmento } from "./corpus";

export const SolicitudGeneracion = z.object({
  temaId: z.string().min(2),
  subtema: z.string().max(200).optional(),
  dificultad: z.number().int().min(1).max(5),
  tipo: z.enum(["conceptual", "normativa", "interpretacion", "escenario", "resolucion_problemas", "decision_tecnica", "asesoria_institucional", "caso_ciberseguridad"]),
  cantidad: z.number().int().min(1).max(5),
  escenario: z.string().max(300).optional()
});
export type Solicitud = z.infer<typeof SolicitudGeneracion>;

export const RespuestaModelo = z.object({
  preguntas: z.array(
    z.object({
      enunciado: z.string().min(30),
      opciones: z.array(z.object({ letra: z.enum(["A", "B", "C", "D"]), texto: z.string().min(1), justificacion: z.string().min(10) })).length(4),
      correcta: z.enum(["A", "B", "C", "D"]),
      explicacion: z.string().min(40),
      fuenteId: z.string(),
      referencia: z.string().optional().default(""),
      esInferencia: z.boolean()
    })
  )
});

export const SISTEMA_GENERADOR = `Eres el equipo académico de PGN PREPÁRATE. Redactas preguntas originales de selección múltiple con ÚNICA respuesta para el concurso de méritos de la Procuraduría General de la Nación, Convocatoria ${CONVOCATORIA.codigo}, empleo ${CONVOCATORIA.denominacion} ${CONVOCATORIA.codigoGrado} (${CONVOCATORIA.dependencia}).
Reglas obligatorias:
- Usa SOLO la información de los fragmentos de contexto. Si el contexto no basta para afirmar algo con certeza, formula la pregunta como inferencia técnica y marca "esInferencia": true.
- Nunca inventes números de artículo, citas normativas, fechas ni cifras. Si el contexto no trae el artículo, deja "referencia" vacía.
- "fuenteId" debe ser exactamente uno de los fuenteId del contexto.
- Exactamente 4 opciones (A-D), una sola correcta, distractores plausibles; cada opción con su justificación.
- Sin respuestas obvias ni distractores absurdos; prioriza escenarios de asesoría en una entidad pública.
- Español de Colombia, registro técnico y claro.
Responde SOLO con JSON válido: {"preguntas":[{"enunciado","opciones":[{"letra","texto","justificacion"}],"correcta","explicacion","fuenteId","referencia","esInferencia"}]}`;

export const SISTEMA_TUTOR = `Eres tutor académico de PGN PREPÁRATE para el empleo Asesor 1AS-19 de la Procuraduría General de la Nación (seguridad informática y ciberseguridad).
- Responde en español de Colombia, claro y preciso, en máximo 250 palabras salvo que se pida más.
- Fundamenta en los fragmentos de contexto y cítalos como [n]. Distingue entre lo que dice una norma y tu inferencia técnica.
- Si el contexto no alcanza, dilo y sugiere qué fuente oficial consultar. No inventes artículos ni fechas.
- Nunca afirmes reglas del concurso (número de preguntas, duración, fecha) que no estén en el contexto oficial.`;

/** Recuperación sobre el corpus versionado (sin servidor). */
export function recuperarLocal(consulta: string, temaId?: string, limite = 8): Fragmento[] {
  return ordenarPorRelevancia(corpusBase(temaId), consulta, temaId, limite);
}

export function consultaDeSolicitud(sol: Solicitud) {
  const ref = temaPorId(sol.temaId);
  if (!ref) throw new Error("Tema inexistente en el temario.");
  return { ref, consulta: [ref.tema.nombre, sol.subtema, ...ref.tema.subtemas, sol.escenario].filter(Boolean).join(" ") };
}

export function promptSolicitud(sol: Solicitud, contexto: Fragmento[]) {
  const { ref } = consultaDeSolicitud(sol);
  return `CONTEXTO RECUPERADO:\n${formatearContexto(contexto)}\n\nSOLICITUD: Genera ${sol.cantidad} pregunta(s) del módulo "${ref.modulo.nombre}", tema "${ref.tema.nombre}"${sol.subtema ? `, subtema "${sol.subtema}"` : ""}. Dificultad ${sol.dificultad}/5. Tipo: ${sol.tipo}.${sol.escenario ? ` Escenario: ${sol.escenario}.` : ""}`;
}

export function extraerJSON(texto: string): unknown {
  const i = texto.indexOf("{");
  const j = texto.lastIndexOf("}");
  if (i < 0 || j < i) throw new Error("La IA no devolvió JSON.");
  return JSON.parse(texto.slice(i, j + 1));
}

/** Convierte la respuesta del modelo en preguntas `borrador_ia`, descartando las que no cumplen. */
export function validarGeneradas(bruto: unknown, sol: Solicitud, contexto: Fragmento[]): { preguntas: Pregunta[]; descartadas: string[] } {
  const { ref } = consultaDeSolicitud(sol);
  const parsed = RespuestaModelo.safeParse(bruto);
  if (!parsed.success) throw new Error("La respuesta de la IA no cumple el formato exigido.");
  const permitidas = new Set(contexto.map((c) => c.fuenteId));
  const descartadas: string[] = [];
  const preguntas: Pregunta[] = [];
  for (const g of parsed.data.preguntas) {
    if (new Set(g.opciones.map((o) => o.letra)).size !== 4) {
      descartadas.push("Opciones repetidas");
      continue;
    }
    if (!permitidas.has(g.fuenteId) || !FUENTE_POR_ID[g.fuenteId]) {
      descartadas.push(`Fuente no recuperada: ${g.fuenteId}`);
      continue;
    }
    preguntas.push({
      id: uid("IA"),
      modulo: ref.modulo.id,
      temaId: sol.temaId,
      subtema: sol.subtema,
      nucleo: ref.modulo.nucleo,
      dificultad: sol.dificultad as Pregunta["dificultad"],
      tipo: sol.tipo,
      enunciado: g.enunciado,
      opciones: [...g.opciones].sort((a, b) => a.letra.localeCompare(b.letra)).map((o) => ({ id: o.letra, texto: o.texto, justificacion: o.justificacion })),
      correcta: g.correcta,
      explicacion: g.explicacion,
      fuenteId: g.fuenteId,
      referencia: g.referencia || undefined,
      esInferencia: g.esInferencia,
      etiquetas: ["ia"],
      estado: "borrador_ia",
      autor: "ia"
    });
  }
  return { preguntas, descartadas };
}

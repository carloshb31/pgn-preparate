import type { Intento, ModuloId, Pregunta } from "./types";
import { TEMARIO } from "@/lib/content/temario";

export interface RegistroRespuesta {
  preguntaId: string;
  modulo: ModuloId;
  temaId: string;
  dificultad: number;
  correcta: boolean;
  respondida: boolean;
  segundos: number;
  fecha: string;
}

/** Aplana todas las respuestas de los intentos finalizados. */
export function registros(intentos: Intento[], banco: Pregunta[]): RegistroRespuesta[] {
  const porId = new Map(banco.map((p) => [p.id, p]));
  const out: RegistroRespuesta[] = [];
  for (const it of intentos) {
    if (!it.finalizado) continue;
    for (const r of it.respuestas) {
      const p = porId.get(r.preguntaId);
      if (!p || p.modulo === "M9_COMPORTAMENTALES") continue;
      out.push({
        preguntaId: p.id,
        modulo: p.modulo,
        temaId: p.temaId,
        dificultad: p.dificultad,
        correcta: r.correcta,
        respondida: r.seleccion !== null,
        segundos: r.segundos,
        fecha: it.fin ?? it.inicio
      });
    }
  }
  return out.sort((a, b) => a.fecha.localeCompare(b.fecha));
}

export const MIN_RESPUESTAS_DOMINIO = 5;

/**
 * Dominio por módulo (0-100): aciertos ponderados por dificultad y por recencia
 * (las 30 respuestas más recientes del módulo pesan el doble). null si hay menos de 5 respuestas.
 */
export function dominioPorModulo(regs: RegistroRespuesta[]): Record<ModuloId, { dominio: number | null; respuestas: number }> {
  const out = {} as Record<ModuloId, { dominio: number | null; respuestas: number }>;
  for (const m of TEMARIO) {
    const rs = regs.filter((r) => r.modulo === m.id);
    if (rs.length < MIN_RESPUESTAS_DOMINIO) {
      out[m.id] = { dominio: null, respuestas: rs.length };
      continue;
    }
    let num = 0,
      den = 0;
    rs.forEach((r, i) => {
      const w = (0.6 + 0.2 * r.dificultad) * (i >= rs.length - 30 ? 2 : 1);
      den += w;
      if (r.correcta) num += w;
    });
    out[m.id] = { dominio: Math.round((num / den) * 100), respuestas: rs.length };
  }
  return out;
}

export interface IndicePreparacion {
  total: number;
  componentes: { nombre: string; valor: number; peso: number; detalle: string }[];
  nivel: "Inicial" | "En desarrollo" | "Competitivo" | "Alto desempeño";
}

export const PESOS_INDICE = { cobertura: 0.25, dominio: 0.45, dificultad: 0.15, reciente: 0.15 };

/**
 * Índice de preparación: no es el promedio de aciertos.
 * Combina cobertura del temario, dominio ponderado por prioridad del módulo,
 * desempeño en preguntas difíciles (4-5) y los tres últimos simulacros de conocimientos.
 */
export function indicePreparacion(
  regs: RegistroRespuesta[],
  intentos: Intento[],
  prioridades: Record<ModuloId, number>
): IndicePreparacion {
  const modulosConocimiento = TEMARIO.filter((m) => m.id !== "M9_COMPORTAMENTALES");
  const temas = modulosConocimiento.flatMap((m) => m.temas.map((t) => t.id));
  const conteoTema = new Map<string, number>();
  regs.forEach((r) => conteoTema.set(r.temaId, (conteoTema.get(r.temaId) ?? 0) + 1));
  const cubiertos = temas.filter((t) => (conteoTema.get(t) ?? 0) >= 3).length;
  const cobertura = temas.length ? (cubiertos / temas.length) * 100 : 0;

  const dom = dominioPorModulo(regs);
  let num = 0,
    den = 0;
  for (const m of modulosConocimiento) {
    const w = prioridades[m.id] ?? m.prioridadBase;
    den += w;
    num += w * (dom[m.id].dominio ?? 0);
  }
  const dominio = den ? num / den : 0;

  const dificiles = regs.filter((r) => r.dificultad >= 4);
  const dificultad = dificiles.length >= 5 ? (dificiles.filter((r) => r.correcta).length / dificiles.length) * 100 : 0;

  const simulacros = intentos
    .filter((i) => i.finalizado && i.puntaje !== null && ["integral", "especifico", "general"].includes(i.config.modalidad))
    .sort((a, b) => (b.fin ?? "").localeCompare(a.fin ?? ""))
    .slice(0, 3);
  const reciente = simulacros.length ? simulacros.reduce((s, i) => s + (i.puntaje ?? 0), 0) / simulacros.length : 0;

  const total = Math.round(
    cobertura * PESOS_INDICE.cobertura + dominio * PESOS_INDICE.dominio + dificultad * PESOS_INDICE.dificultad + reciente * PESOS_INDICE.reciente
  );
  const nivel = total >= 85 ? "Alto desempeño" : total >= 70 ? "Competitivo" : total >= 40 ? "En desarrollo" : "Inicial";
  return {
    total,
    nivel,
    componentes: [
      { nombre: "Cobertura del temario", valor: Math.round(cobertura), peso: PESOS_INDICE.cobertura, detalle: `${cubiertos} de ${temas.length} temas con 3 o más respuestas` },
      { nombre: "Dominio ponderado", valor: Math.round(dominio), peso: PESOS_INDICE.dominio, detalle: "Aciertos por módulo, ponderados por dificultad, recencia y prioridad" },
      { nombre: "Preguntas difíciles", valor: Math.round(dificultad), peso: PESOS_INDICE.dificultad, detalle: dificiles.length >= 5 ? `${dificiles.length} respuestas de dificultad 4-5` : "Se requieren al menos 5 respuestas de dificultad 4-5" },
      { nombre: "Simulacros recientes", valor: Math.round(reciente), peso: PESOS_INDICE.reciente, detalle: simulacros.length ? `Promedio de los últimos ${simulacros.length}` : "Sin simulacros de conocimientos" }
    ]
  };
}

export function preguntasMasFalladas(regs: RegistroRespuesta[], banco: Pregunta[], n = 10) {
  const conteo = new Map<string, { fallos: number; intentos: number }>();
  for (const r of regs) {
    const c = conteo.get(r.preguntaId) ?? { fallos: 0, intentos: 0 };
    c.intentos++;
    if (!r.correcta) c.fallos++;
    conteo.set(r.preguntaId, c);
  }
  const porId = new Map(banco.map((p) => [p.id, p]));
  return [...conteo.entries()]
    .filter(([, c]) => c.fallos > 0)
    .sort((a, b) => b[1].fallos - a[1].fallos || b[1].intentos - a[1].intentos)
    .slice(0, n)
    .map(([id, c]) => ({ pregunta: porId.get(id)!, ...c }))
    .filter((x) => x.pregunta);
}

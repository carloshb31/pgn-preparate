import type { EstadoRepaso } from "./types";
import { sumarDias } from "./util";

/**
 * Repetición espaciada basada en SM-2.
 * calidad: 0-5 (0-2 = fallo, 3 = correcto con dificultad, 4 = correcto, 5 = correcto y rápido).
 */
export function actualizarRepaso(prev: EstadoRepaso | undefined, preguntaId: string, calidad: number, hoy: string): EstadoRepaso {
  const q = Math.max(0, Math.min(5, Math.round(calidad)));
  const base: EstadoRepaso = prev ?? { preguntaId, facilidad: 2.5, intervaloDias: 0, repeticiones: 0, proxima: hoy };
  let { facilidad, intervaloDias, repeticiones } = base;

  if (q < 3) {
    repeticiones = 0;
    intervaloDias = 1;
  } else {
    repeticiones += 1;
    intervaloDias = repeticiones === 1 ? 1 : repeticiones === 2 ? 6 : Math.round(intervaloDias * facilidad);
  }
  facilidad = Math.max(1.3, facilidad + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  return { preguntaId, facilidad: Math.round(facilidad * 100) / 100, intervaloDias, repeticiones, proxima: sumarDias(hoy, intervaloDias) };
}

/** Calidad estimada a partir del resultado y el tiempo frente al promedio esperado. */
export function calidadDesdeRespuesta(correcta: boolean, segundos: number, esperado = 90): number {
  if (!correcta) return 1;
  if (segundos > 0 && segundos <= esperado * 0.6) return 5;
  if (segundos > esperado * 1.5) return 3;
  return 4;
}

export const pendientesHoy = (estados: EstadoRepaso[], hoy: string) => estados.filter((e) => e.proxima <= hoy);

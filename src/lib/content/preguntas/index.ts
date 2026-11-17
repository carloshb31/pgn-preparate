import { M1 } from "./m1-seguridad";
import { M2, M3 } from "./m2-m3";
import { M4, M5, M6 } from "./m4-m6";
import { M7, M8 } from "./m7-m8";
import { M1_AMPLIACION } from "./ampliacion-m1";
import { M2_AMPLIACION, M3_AMPLIACION, M4_M6_AMPLIACION, M7_M8_AMPLIACION } from "./ampliacion-m2-m8";
import type { Pregunta } from "@/lib/domain/types";

/** Banco semilla: preguntas originales para la Convocatoria 51-2026, todas pendientes de revisión humana. */
export const BANCO_SEMILLA: Pregunta[] = [
  ...M1, ...M1_AMPLIACION, ...M2, ...M2_AMPLIACION, ...M3, ...M3_AMPLIACION, ...M4, ...M5, ...M6, ...M4_M6_AMPLIACION, ...M7, ...M8, ...M7_M8_AMPLIACION
];

/**
 * Metas de construcción del banco (NO son la distribución oficial del examen,
 * que aún no ha sido publicada).
 */
export const META_BANCO: Record<string, number> = {
  M1_SEGURIDAD: 250,
  M2_REDES: 150,
  M3_SO: 100,
  M4_CLOUD_ARQ: 100,
  M5_CONTINUIDAD: 100,
  M6_PROYECTOS: 80,
  M7_INSTITUCIONAL: 120,
  M8_NORMATIVA_TIC: 60,
  M9_COMPORTAMENTALES: 40
};

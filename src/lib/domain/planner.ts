import type { ActividadEstudio, ConfigPlan, ModuloId, TipoActividad } from "./types";
import { TEMARIO, MODULO_POR_ID } from "@/lib/content/temario";
import { diaSemana, sumarDias, uid, diasEntre } from "./util";

/** Horizonte usado SOLO cuando el usuario no ha ingresado una fecha de examen. */
export const HORIZONTE_SIN_FECHA_DIAS = 56;

const ORDEN_DIAS = [1, 2, 3, 4, 5, 6, 7]; // lunes primero
const CICLO: TipoActividad[] = ["lectura", "practica", "cuestionario"];

export function prioridadesPorDefecto(): Record<ModuloId, number> {
  return Object.fromEntries(TEMARIO.map((m) => [m.id, m.prioridadBase])) as Record<ModuloId, number>;
}

/** Necesidad = prioridad × brecha de dominio. Un módulo sin datos se trata como brecha alta. */
export function necesidad(prioridad: number, dominio: number | null) {
  const brecha = dominio === null ? 1.5 : 1 + (100 - dominio) / 100;
  return Math.max(0.1, prioridad * brecha);
}

/** Reparto suave ponderado (smooth weighted round-robin) para intercalar módulos. */
function* rotacion(pesos: { id: ModuloId; w: number }[]) {
  const actual = new Map<ModuloId, number>(pesos.map((p) => [p.id, 0]));
  const total = pesos.reduce((s, p) => s + p.w, 0);
  while (true) {
    let mejor: ModuloId = pesos[0].id;
    let max = -Infinity;
    for (const p of pesos) {
      const v = (actual.get(p.id) ?? 0) + p.w;
      actual.set(p.id, v);
      if (v > max) {
        max = v;
        mejor = p.id;
      }
    }
    actual.set(mejor, (actual.get(mejor) ?? 0) - total);
    yield mejor;
  }
}

function diasDeEstudio(desde: string, hasta: string, diasPorSemana: number): string[] {
  const permitidos = new Set(ORDEN_DIAS.slice(0, Math.max(1, Math.min(7, diasPorSemana))));
  const out: string[] = [];
  for (let d = desde; d <= hasta; d = sumarDias(d, 1)) if (permitidos.has(diaSemana(d))) out.push(d);
  return out;
}

export function generarPlan(cfg: ConfigPlan, dominio: Record<ModuloId, number | null>, desde = cfg.fechaInicio): ActividadEstudio[] {
  const hasta = cfg.fechaExamen ? sumarDias(cfg.fechaExamen, -1) : sumarDias(desde, HORIZONTE_SIN_FECHA_DIAS - 1);
  if (hasta < desde) return [];
  const dias = diasDeEstudio(desde, hasta, cfg.diasPorSemana);
  const minutosDia = Math.round(cfg.horasPorDia * 60);
  const minRepaso = minutosDia >= 60 ? 15 : 0;
  const sesiones = Math.max(1, Math.floor((minutosDia - minRepaso) / cfg.minutosPorSesion));
  const conocimiento = TEMARIO.filter((m) => m.id !== "M9_COMPORTAMENTALES");

  const pesos = TEMARIO.map((m) => ({
    id: m.id,
    w: necesidad(cfg.prioridades[m.id] ?? m.prioridadBase, dominio[m.id] ?? null) * (m.id === "M9_COMPORTAMENTALES" ? 0.6 : 1)
  }));
  const turno = rotacion(pesos);
  const ciclo = new Map<ModuloId, number>();
  const punteroTema = new Map<ModuloId, number>();
  const factorNivel = cfg.nivelInicial === "basico" ? 0 : cfg.nivelInicial === "intermedio" ? 1 : 2;

  const actividades: ActividadEstudio[] = [];
  const ultimaSemana = cfg.fechaExamen ? sumarDias(cfg.fechaExamen, -7) : null;
  let semanaActual = -1;

  dias.forEach((fecha, idx) => {
    const semana = Math.floor(diasEntre(desde, fecha) / 7);
    const esUltimoDiaSemana = idx === dias.length - 1 || Math.floor(diasEntre(desde, dias[idx + 1]) / 7) !== semana;
    if (semana !== semanaActual) semanaActual = semana;

    if (minRepaso) actividades.push({ id: uid("act"), fecha, modulo: null, tipo: "repaso", titulo: "Repaso espaciado de preguntas falladas", minutos: minRepaso, completada: false });

    // Recta final: simulacros integrales en días alternos.
    if (ultimaSemana && fecha >= ultimaSemana) {
      if (diasEntre(ultimaSemana, fecha) % 2 === 0) {
        actividades.push({ id: uid("act"), fecha, modulo: null, tipo: "simulacro_integral", titulo: "Simulacro integral cronometrado", minutos: Math.max(cfg.minutosPorSesion, minutosDia - minRepaso), completada: false });
        return;
      }
    }

    if (esUltimoDiaSemana && semana > 0) {
      const integral = (semana + 1) % 3 === 0;
      if (integral) {
        actividades.push({ id: uid("act"), fecha, modulo: null, tipo: "simulacro_integral", titulo: "Simulacro integral (todos los módulos)", minutos: Math.max(cfg.minutosPorSesion, minutosDia - minRepaso), completada: false });
        return;
      }
      const debil = [...conocimiento].sort((a, b) => (dominio[a.id] ?? -1) - (dominio[b.id] ?? -1))[0];
      actividades.push({ id: uid("act"), fecha, modulo: debil.id, tipo: "simulacro_parcial", titulo: `Simulacro parcial: ${debil.nombre}`, minutos: cfg.minutosPorSesion, completada: false });
      for (let s = 1; s < sesiones; s++) actividades.push(sesionModulo(turno.next().value as ModuloId, fecha));
      return;
    }

    for (let s = 0; s < sesiones; s++) actividades.push(sesionModulo(turno.next().value as ModuloId, fecha));
  });

  function sesionModulo(modulo: ModuloId, fecha: string): ActividadEstudio {
    const m = MODULO_POR_ID[modulo];
    const n = ciclo.get(modulo) ?? factorNivel;
    ciclo.set(modulo, n + 1);
    const tipo = CICLO[n % CICLO.length];
    const ti = punteroTema.get(modulo) ?? 0;
    const tema = m.temas[ti % m.temas.length];
    if (tipo === "cuestionario") punteroTema.set(modulo, ti + 1);
    const titulo =
      tipo === "lectura" ? `Lectura: ${tema.nombre}` : tipo === "practica" ? `Práctica guiada: ${tema.nombre}` : `Cuestionario: ${tema.nombre}`;
    return { id: uid("act"), fecha, modulo, tipo, titulo, minutos: cfg.minutosPorSesion, completada: false };
  }

  return actividades;
}

/**
 * Replanificación: conserva lo completado, mueve lo vencido no completado al primer día
 * de estudio disponible y regenera lo futuro con el dominio actualizado.
 */
export function replanificar(
  actuales: ActividadEstudio[],
  cfg: ConfigPlan,
  dominio: Record<ModuloId, number | null>,
  hoy: string
): ActividadEstudio[] {
  const completadas = actuales.filter((a) => a.completada);
  const vencidas = actuales.filter((a) => !a.completada && a.fecha < hoy && a.tipo !== "repaso");
  const futuras = generarPlan({ ...cfg, fechaInicio: hoy }, dominio, hoy);
  const diasFuturos = [...new Set(futuras.map((a) => a.fecha))];
  const movidas = vencidas.map((a, i) => ({
    ...a,
    id: uid("act"),
    reprogramadaDesde: a.reprogramadaDesde ?? a.fecha,
    fecha: diasFuturos[Math.min(i % Math.max(1, Math.ceil(vencidas.length / 2)), diasFuturos.length - 1)] ?? hoy
  }));
  return [...completadas, ...movidas, ...futuras].sort((a, b) => a.fecha.localeCompare(b.fecha));
}

export function avancePlan(acts: ActividadEstudio[], hoy: string) {
  const hastaHoy = acts.filter((a) => a.fecha <= hoy);
  const total = acts.length;
  const hechas = acts.filter((a) => a.completada).length;
  return {
    total,
    hechas,
    pctTotal: total ? Math.round((hechas / total) * 100) : 0,
    pendientesVencidas: hastaHoy.filter((a) => !a.completada && a.fecha < hoy).length
  };
}

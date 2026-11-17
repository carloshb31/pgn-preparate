import type { ConfigSimulacro, Dificultad, Intento, ModuloId, Pregunta, RespuestaIntento } from "./types";
import { barajar, rng, uid } from "./util";
import { temaPorId } from "@/lib/content/temario";

export const ESTADOS_JUGABLES = new Set(["validada", "publicada"]);
export const ESTADOS_EXPERIMENTALES = new Set(["pendiente_revision", "borrador_ia"]);

export const MODALIDADES: Record<ConfigSimulacro["modalidad"], { titulo: string; descripcion: string }> = {
  general: { titulo: "Conocimientos generales", descripcion: "Núcleo común: Procuraduría, Estado y gestión pública." },
  especifico: { titulo: "Conocimientos específicos", descripcion: "Seguridad, redes, sistemas operativos, cloud, continuidad, proyectos y normativa TIC." },
  modulo: { titulo: "Por módulo", descripcion: "Un solo módulo del temario, para reforzar." },
  comportamental: { titulo: "Competencias comportamentales", descripcion: "Casos situacionales sobre las 7 competencias oficiales." },
  integral: { titulo: "Integral", descripcion: "Todos los módulos de conocimientos, mezclados." },
  personalizado: { titulo: "Personalizado", descripcion: "Usted elige módulos, dificultad, cantidad y tiempo." }
};

export function filtrarElegibles(banco: Pregunta[], cfg: ConfigSimulacro): Pregunta[] {
  return banco.filter((p) => {
    if (p.estado === "descartada") return false;
    if (!cfg.incluirNoValidadas && !ESTADOS_JUGABLES.has(p.estado)) return false;
    if (cfg.modulos.length && !cfg.modulos.includes(p.modulo)) return false;
    if (cfg.dificultades.length && !cfg.dificultades.includes(p.dificultad)) return false;
    if (cfg.modalidad === "general" && p.nucleo !== "general") return false;
    if (cfg.modalidad === "especifico" && p.nucleo !== "especifico") return false;
    return true;
  });
}

/**
 * Selección estratificada por módulo para que ninguno quede sobrerrepresentado
 * cuando hay más preguntas disponibles que las solicitadas.
 */
export function seleccionar(elegibles: Pregunta[], cantidad: number, aleatorio: () => number): Pregunta[] {
  if (elegibles.length <= cantidad) return barajar(elegibles, aleatorio);
  const porModulo = new Map<ModuloId, Pregunta[]>();
  for (const p of barajar(elegibles, aleatorio)) {
    const lista = porModulo.get(p.modulo) ?? [];
    lista.push(p);
    porModulo.set(p.modulo, lista);
  }
  const seleccion: Pregunta[] = [];
  const colas = [...porModulo.values()];
  let i = 0;
  while (seleccion.length < cantidad) {
    const cola = colas[i % colas.length];
    const p = cola.shift();
    if (p) seleccion.push(p);
    i++;
    if (colas.every((c) => c.length === 0)) break;
  }
  return seleccion;
}

export function crearIntento(banco: Pregunta[], cfg: ConfigSimulacro, semilla = Date.now()): Intento {
  const aleatorio = rng(semilla);
  const elegibles = filtrarElegibles(banco, cfg);
  if (elegibles.length === 0) throw new Error("No hay preguntas que cumplan los filtros seleccionados.");
  let preguntas = seleccionar(elegibles, cfg.cantidad, aleatorio);
  if (!cfg.aleatorizarPreguntas) preguntas = [...preguntas].sort((a, b) => a.id.localeCompare(b.id));

  return {
    id: uid("int"),
    inicio: new Date().toISOString(),
    fin: null,
    config: { ...cfg, cantidad: preguntas.length },
    orden: preguntas.map((p) => ({
      preguntaId: p.id,
      opciones: cfg.aleatorizarOpciones ? barajar(p.opciones.map((o) => o.id), aleatorio) : p.opciones.map((o) => o.id)
    })),
    respuestas: preguntas.map((p) => ({ preguntaId: p.id, seleccion: null, correcta: false, marcada: false, segundos: 0 })),
    puntaje: null,
    finalizado: false
  };
}

export function responder(intento: Intento, preguntaId: string, seleccion: string | null): Intento {
  if (intento.finalizado) throw new Error("El simulacro ya fue finalizado; las respuestas no se pueden modificar.");
  return {
    ...intento,
    respuestas: intento.respuestas.map((r) => (r.preguntaId === preguntaId ? { ...r, seleccion } : r))
  };
}

export function alternarMarca(intento: Intento, preguntaId: string): Intento {
  if (intento.finalizado) return intento;
  return { ...intento, respuestas: intento.respuestas.map((r) => (r.preguntaId === preguntaId ? { ...r, marcada: !r.marcada } : r)) };
}

export function sumarTiempo(intento: Intento, preguntaId: string, segundos: number): Intento {
  if (intento.finalizado || segundos <= 0) return intento;
  return { ...intento, respuestas: intento.respuestas.map((r) => (r.preguntaId === preguntaId ? { ...r, segundos: r.segundos + segundos } : r)) };
}

/** Califica sobre 100. Sin penalización por respuesta incorrecta (no hay regla oficial publicada que la establezca). */
export function finalizar(intento: Intento, banco: Pregunta[]): Intento {
  if (intento.finalizado) return intento;
  const porId = new Map(banco.map((p) => [p.id, p]));
  const respuestas: RespuestaIntento[] = intento.respuestas.map((r) => {
    const p = porId.get(r.preguntaId);
    return { ...r, correcta: !!p && r.seleccion !== null && r.seleccion === p.correcta };
  });
  const aciertos = respuestas.filter((r) => r.correcta).length;
  const puntaje = respuestas.length ? Math.round((aciertos / respuestas.length) * 1000) / 10 : 0;
  return { ...intento, respuestas, puntaje, finalizado: true, fin: new Date().toISOString() };
}

export interface InformeIntento {
  correctas: number;
  incorrectas: number;
  sinResponder: number;
  total: number;
  segundosTotales: number;
  segundosPromedio: number;
  porModulo: { modulo: ModuloId; correctas: number; total: number; pct: number }[];
  porDificultad: { dificultad: Dificultad; correctas: number; total: number; pct: number }[];
  temasARepasar: { tema: string; modulo: ModuloId; errores: number }[];
}

export function informe(intento: Intento, banco: Pregunta[]): InformeIntento {
  const porId = new Map(banco.map((p) => [p.id, p]));
  const modulos = new Map<ModuloId, { c: number; t: number }>();
  const difs = new Map<Dificultad, { c: number; t: number }>();
  const temas = new Map<string, { modulo: ModuloId; errores: number }>();
  let correctas = 0,
    incorrectas = 0,
    sinResponder = 0,
    seg = 0;

  for (const r of intento.respuestas) {
    const p = porId.get(r.preguntaId);
    seg += r.segundos;
    if (!p) continue;
    if (r.seleccion === null) sinResponder++;
    else if (r.correcta) correctas++;
    else incorrectas++;
    const m = modulos.get(p.modulo) ?? { c: 0, t: 0 };
    m.t++;
    if (r.correcta) m.c++;
    modulos.set(p.modulo, m);
    const d = difs.get(p.dificultad) ?? { c: 0, t: 0 };
    d.t++;
    if (r.correcta) d.c++;
    difs.set(p.dificultad, d);
    if (!r.correcta) {
      const nombreTema = temaPorId(p.temaId)?.tema.nombre ?? p.temaId;
      const k = p.subtema ? `${nombreTema} · ${p.subtema}` : nombreTema;
      const x = temas.get(k) ?? { modulo: p.modulo, errores: 0 };
      x.errores++;
      temas.set(k, x);
    }
  }
  const total = intento.respuestas.length;
  return {
    correctas,
    incorrectas,
    sinResponder,
    total,
    segundosTotales: seg,
    segundosPromedio: total ? Math.round(seg / total) : 0,
    porModulo: [...modulos.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([modulo, v]) => ({ modulo, correctas: v.c, total: v.t, pct: Math.round((v.c / v.t) * 100) })),
    porDificultad: [...difs.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([dificultad, v]) => ({ dificultad, correctas: v.c, total: v.t, pct: Math.round((v.c / v.t) * 100) })),
    temasARepasar: [...temas.entries()].map(([tema, v]) => ({ tema, ...v })).sort((a, b) => b.errores - a.errores)
  };
}

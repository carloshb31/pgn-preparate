"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { obtenerRepositorio, supabaseConfigurado } from "@/lib/data";
import { getSupabase } from "@/lib/data/supabase";
import type { EstadoApp, Repositorio } from "@/lib/data/repository";
import type { ActividadEstudio, Ajustes, CategoriaBiblioteca, ConfigPlan, ConfigSimulacro, Ficha, Intento, ModuloId, Pregunta, ResultadoComportamental } from "@/lib/domain/types";
import { crearIntento, finalizar as finalizarIntento } from "@/lib/domain/exam";
import { actualizarRepaso, calidadDesdeRespuesta } from "@/lib/domain/srs";
import { generarPlan, replanificar as replan } from "@/lib/domain/planner";
import { dominioPorModulo, indicePreparacion, registros } from "@/lib/domain/analytics";
import { hoyISO } from "@/lib/domain/util";
import { prioridadesPorDefecto } from "@/lib/domain/planner";

const CLAVE_EN_CURSO = "pgn-preparate:intento-en-curso";

interface Ctx {
  repo: Repositorio;
  estado: EstadoApp | null;
  cargando: boolean;
  error: string | null;
  enCurso: Intento | null;
  recargar(): Promise<void>;
  iniciarSimulacro(cfg: ConfigSimulacro): Intento;
  actualizarEnCurso(i: Intento): void;
  descartarEnCurso(): void;
  finalizarSimulacro(): Promise<Intento | null>;
  registrarPractica(preguntaId: string, seleccion: string, segundos: number): Promise<Intento>;
  guardarPlan(cfg: ConfigPlan): Promise<void>;
  replanificar(): Promise<void>;
  marcarActividad(a: ActividadEstudio, completada: boolean): Promise<void>;
  guardarAjustes(a: Ajustes): Promise<void>;
  guardarFicha(f: Ficha): Promise<void>;
  borrarFicha(id: string): Promise<void>;
  guardarPreguntas(ps: Pregunta[]): Promise<void>;
  subirDocumento(f: File, c: CategoriaBiblioteca): Promise<void>;
  borrarDocumento(id: string): Promise<void>;
  guardarComportamental(r: ResultadoComportamental): Promise<void>;
}

const StoreCtx = createContext<Ctx | null>(null);

function leerEnCurso(): Intento | null {
  try {
    const raw = localStorage.getItem(CLAVE_EN_CURSO);
    return raw ? (JSON.parse(raw) as Intento) : null;
  } catch {
    return null;
  }
}
function escribirEnCurso(i: Intento | null) {
  try {
    if (i) localStorage.setItem(CLAVE_EN_CURSO, JSON.stringify(i));
    else localStorage.removeItem(CLAVE_EN_CURSO);
  } catch {
    /* almacenamiento no disponible: el intento sigue en memoria */
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const repo = useMemo(() => obtenerRepositorio(), []);
  const [estado, setEstado] = useState<EstadoApp | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enCurso, setEnCurso] = useState<Intento | null>(null);
  const estadoRef = useRef(estado);
  estadoRef.current = estado;

  const recargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setEstado(await repo.cargar());
    } catch (e) {
      setError(e instanceof Error ? e.message : "No fue posible cargar la información.");
    } finally {
      setCargando(false);
    }
  }, [repo]);

  useEffect(() => {
    setEnCurso(leerEnCurso());
    recargar();
  }, [recargar]);

  const mutar = useCallback(async (fn: () => Promise<void>, optimista?: (e: EstadoApp) => EstadoApp) => {
    if (optimista && estadoRef.current) setEstado(optimista(estadoRef.current));
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar.");
      await recargar();
      throw e;
    }
  }, [recargar]);

  const ctx: Ctx = {
    repo,
    estado,
    cargando,
    error,
    enCurso,
    recargar,
    iniciarSimulacro(cfg) {
      if (!estadoRef.current) throw new Error("Datos no cargados.");
      const i = crearIntento(estadoRef.current.preguntas, cfg);
      setEnCurso(i);
      escribirEnCurso(i);
      repo.registrar("simulacro_iniciado", { modalidad: cfg.modalidad, cantidad: i.respuestas.length }).catch(() => {});
      return i;
    },
    actualizarEnCurso(i) {
      setEnCurso(i);
      escribirEnCurso(i);
    },
    descartarEnCurso() {
      setEnCurso(null);
      escribirEnCurso(null);
    },
    async finalizarSimulacro() {
      const e = estadoRef.current;
      const actual = leerEnCurso() ?? enCurso;
      if (!e || !actual) return null;
      const fin = finalizarIntento(actual, e.preguntas);
      const hoy = hoyISO();
      const previos = new Map(e.repasos.map((r) => [r.preguntaId, r]));
      const repasos = fin.respuestas
        .filter((r) => r.seleccion !== null)
        .map((r) => actualizarRepaso(previos.get(r.preguntaId), r.preguntaId, calidadDesdeRespuesta(r.correcta, r.segundos), hoy));
      await mutar(
        async () => {
          await repo.guardarIntento(fin);
          if (repasos.length) await repo.guardarRepasos(repasos);
          await repo.registrar("simulacro_finalizado", { id: fin.id, puntaje: fin.puntaje }).catch(() => {});
        },
        (s) => {
          const m = new Map(s.repasos.map((r) => [r.preguntaId, r]));
          repasos.forEach((r) => m.set(r.preguntaId, r));
          return { ...s, intentos: [...s.intentos, fin], repasos: [...m.values()] };
        }
      );
      setEnCurso(null);
      escribirEnCurso(null);
      return fin;
    },
    async registrarPractica(preguntaId, seleccion, segundos) {
      const e = estadoRef.current!;
      const p = e.preguntas.find((x) => x.id === preguntaId);
      if (!p) throw new Error("Pregunta no encontrada.");
      const base = crearIntento([p], { modalidad: "modulo", cantidad: 1, duracionMin: 1, dificultades: [], modulos: [p.modulo], aleatorizarPreguntas: false, aleatorizarOpciones: false, incluirNoValidadas: true, practica: true });
      const conResp = { ...base, respuestas: base.respuestas.map((r) => ({ ...r, seleccion, segundos })) };
      const fin = finalizarIntento(conResp, e.preguntas);
      const rep = actualizarRepaso(e.repasos.find((r) => r.preguntaId === preguntaId), preguntaId, calidadDesdeRespuesta(fin.respuestas[0].correcta, segundos), hoyISO());
      await mutar(
        async () => {
          await repo.guardarIntento(fin);
          await repo.guardarRepasos([rep]);
        },
        (s) => ({ ...s, intentos: [...s.intentos, fin], repasos: [...s.repasos.filter((r) => r.preguntaId !== preguntaId), rep] })
      );
      return fin;
    },
    async guardarPlan(cfg) {
      const e = estadoRef.current!;
      const dom = dominioPorModulo(registros(e.intentos, e.preguntas));
      const d = Object.fromEntries(Object.entries(dom).map(([k, v]) => [k, v.dominio])) as Record<ModuloId, number | null>;
      const completadas = e.actividades.filter((a) => a.completada);
      const acts = [...completadas, ...generarPlan(cfg, d, cfg.fechaInicio < hoyISO() ? hoyISO() : cfg.fechaInicio)];
      await mutar(() => repo.guardarPlan(cfg, acts), (s) => ({ ...s, planConfig: cfg, actividades: acts }));
    },
    async replanificar() {
      const e = estadoRef.current!;
      if (!e.planConfig) return;
      const dom = dominioPorModulo(registros(e.intentos, e.preguntas));
      const d = Object.fromEntries(Object.entries(dom).map(([k, v]) => [k, v.dominio])) as Record<ModuloId, number | null>;
      const acts = replan(e.actividades, e.planConfig, d, hoyISO());
      await mutar(() => repo.guardarPlan(e.planConfig!, acts), (s) => ({ ...s, actividades: acts }));
    },
    async marcarActividad(a, completada) {
      const n = { ...a, completada };
      await mutar(() => repo.actualizarActividad(n), (s) => ({ ...s, actividades: s.actividades.map((x) => (x.id === a.id ? n : x)) }));
    },
    async guardarAjustes(a) {
      await mutar(() => repo.guardarAjustes(a), (s) => ({ ...s, ajustes: a }));
    },
    async guardarFicha(f) {
      await mutar(() => repo.guardarFicha(f), (s) => ({ ...s, fichas: [...s.fichas.filter((x) => x.id !== f.id), f] }));
    },
    async borrarFicha(id) {
      await mutar(() => repo.borrarFicha(id), (s) => ({ ...s, fichas: s.fichas.filter((x) => x.id !== id) }));
    },
    async guardarPreguntas(ps) {
      const ids = new Set(ps.map((p) => p.id));
      await mutar(() => repo.guardarPreguntas(ps), (s) => ({ ...s, preguntas: [...s.preguntas.filter((p) => !ids.has(p.id)), ...ps] }));
    },
    async subirDocumento(f, c) {
      const doc = await repo.subirDocumento(f, c);
      setEstado((s) => (s ? { ...s, documentos: [doc, ...s.documentos] } : s));
    },
    async borrarDocumento(id) {
      const doc = estadoRef.current?.documentos.find((d) => d.id === id);
      if (!doc) return;
      await mutar(() => repo.borrarDocumento(doc), (s) => ({ ...s, documentos: s.documentos.filter((d) => d.id !== id) }));
    },
    async guardarComportamental(r) {
      await mutar(() => repo.guardarComportamental(r), (s) => ({ ...s, comportamentales: [...s.comportamentales, r] }));
    }
  };

  return <StoreCtx.Provider value={ctx}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore fuera de StoreProvider");
  return c;
}

/** Métricas derivadas, memorizadas. */
export function useDerivados() {
  const { estado } = useStore();
  return useMemo(() => {
    if (!estado) return null;
    const regs = registros(estado.intentos, estado.preguntas);
    const prioridades = estado.planConfig?.prioridades ?? prioridadesPorDefecto();
    const dominio = dominioPorModulo(regs);
    const indice = indicePreparacion(regs, estado.intentos, prioridades);
    const finalizados = estado.intentos.filter((i) => i.finalizado);
    const segundosSimulacros = finalizados.reduce((s, i) => s + i.respuestas.reduce((a, r) => a + r.segundos, 0), 0);
    const minutosActividades = estado.actividades.filter((a) => a.completada && !a.tipo.startsWith("simulacro")).reduce((s, a) => s + a.minutos, 0);
    return {
      regs,
      dominio,
      indice,
      finalizados,
      minutosEstudio: Math.round(segundosSimulacros / 60) + minutosActividades + estado.ajustes.minutosEstudioManual
    };
  }, [estado]);
}

/** Token de sesión para las rutas de IA cuando hay Supabase. */
export async function cabecerasAuth(): Promise<HeadersInit> {
  if (!supabaseConfigurado()) return { "content-type": "application/json" };
  const { data } = await getSupabase().auth.getSession();
  return { "content-type": "application/json", authorization: `Bearer ${data.session?.access_token ?? ""}` };
}

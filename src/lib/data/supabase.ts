"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ActividadEstudio, Intento, ModuloId, Pregunta } from "@/lib/domain/types";
import { AJUSTES_INICIALES, type EstadoApp, type Repositorio } from "./repository";

let cliente: SupabaseClient | null = null;

export function supabaseConfigurado() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabase(): SupabaseClient {
  if (!supabaseConfigurado()) throw new Error("Supabase no está configurado.");
  cliente ??= createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  return cliente;
}

function ok<T>(r: { data: T; error: { message: string } | null }): T {
  if (r.error) throw new Error(r.error.message);
  return r.data;
}

async function usuarioActual() {
  const { data } = await getSupabase().auth.getUser();
  if (!data.user) throw new Error("Sesión no iniciada.");
  return data.user;
}

type FilaPregunta = {
  id: string; modulo_id: ModuloId; tema_id: string; subtema: string | null; nucleo: Pregunta["nucleo"]; dificultad: Pregunta["dificultad"];
  tipo: Pregunta["tipo"]; enunciado: string; explicacion: string; fuente_id: string; referencia: string | null; es_inferencia: boolean;
  competencia_id: string | null; etiquetas: string[]; estado: Pregunta["estado"]; autor: Pregunta["autor"];
  opciones: { letra: string; texto: string; justificacion: string; es_correcta: boolean }[];
};

const aPregunta = (f: FilaPregunta): Pregunta => {
  const opciones = [...f.opciones].sort((a, b) => a.letra.localeCompare(b.letra));
  return {
    id: f.id, modulo: f.modulo_id, temaId: f.tema_id, subtema: f.subtema ?? undefined, nucleo: f.nucleo, dificultad: f.dificultad, tipo: f.tipo,
    enunciado: f.enunciado, explicacion: f.explicacion, fuenteId: f.fuente_id, referencia: f.referencia ?? undefined, esInferencia: f.es_inferencia,
    competencia: f.competencia_id ?? undefined, etiquetas: f.etiquetas ?? [], estado: f.estado, autor: f.autor,
    opciones: opciones.map((o) => ({ id: o.letra, texto: o.texto, justificacion: o.justificacion })),
    correcta: opciones.find((o) => o.es_correcta)?.letra ?? ""
  };
};

const aActividad = (a: Record<string, unknown>): ActividadEstudio => ({
  id: a.id as string, fecha: a.fecha as string, modulo: (a.modulo_id as ModuloId) ?? null, tipo: a.tipo as ActividadEstudio["tipo"],
  titulo: a.titulo as string, minutos: a.minutos as number, completada: a.completada as boolean,
  reprogramadaDesde: (a.reprogramada_desde as string) ?? undefined
});

export const repositorioSupabase: Repositorio = {
  modo: "supabase",

  async cargar(): Promise<EstadoApp> {
    const sb = getSupabase();
    const user = await usuarioActual();
    const [perfil, preguntas, intentos, plan, actividades, repasos, fichas, documentos, config, resultados] = await Promise.all([
      sb.from("user_profiles").select("rol").eq("user_id", user.id).maybeSingle(),
      sb.from("preguntas").select("*, opciones(letra, texto, justificacion, es_correcta)"),
      sb.from("intentos").select("*").order("inicio", { ascending: true }),
      sb.from("planes_estudio").select("*").maybeSingle(),
      sb.from("actividades_estudio").select("*").order("fecha"),
      sb.from("historial_repasos").select("*"),
      sb.from("fichas_estudio").select("*"),
      sb.from("documentos").select("*").order("subido", { ascending: false }),
      sb.from("configuraciones").select("clave, valor, user_id"),
      sb.from("resultados").select("*").eq("tipo", "comportamental_practica").order("creado")
    ]);

    // Respuestas de los intentos finalizados
    const ints = ok(intentos) as Record<string, unknown>[];
    const resp = ok(await sb.from("respuestas").select("intento_id, pregunta_id, seleccion, correcta, marcada, segundos")) as Record<string, unknown>[];
    const porIntento = new Map<string, Intento["respuestas"]>();
    for (const r of resp) {
      const l = porIntento.get(r.intento_id as string) ?? [];
      l.push({ preguntaId: r.pregunta_id as string, seleccion: (r.seleccion as string) ?? null, correcta: r.correcta as boolean, marcada: r.marcada as boolean, segundos: r.segundos as number });
      porIntento.set(r.intento_id as string, l);
    }

    const cfgs = (ok(config) ?? []) as { clave: string; valor: unknown; user_id: string | null }[];
    const global = cfgs.find((c) => c.clave === "ajustes" && c.user_id === null)?.valor as Partial<EstadoApp["ajustes"]> | undefined;
    const propio = cfgs.find((c) => c.clave === "ajustes" && c.user_id === user.id)?.valor as Partial<EstadoApp["ajustes"]> | undefined;
    const p = ok(plan) as Record<string, unknown> | null;

    return {
      preguntas: (ok(preguntas) as FilaPregunta[]).map(aPregunta),
      intentos: ints.map((i) => {
        const orden = i.orden as Intento["orden"];
        const rs = porIntento.get(i.id as string) ?? orden.map((o) => ({ preguntaId: o.preguntaId, seleccion: null, correcta: false, marcada: false, segundos: 0 }));
        return { id: i.id as string, inicio: i.inicio as string, fin: (i.fin as string) ?? null, config: i.config as Intento["config"], orden, respuestas: rs, puntaje: i.puntaje === null ? null : Number(i.puntaje), finalizado: i.finalizado as boolean };
      }),
      planConfig: p
        ? { fechaExamen: (p.fecha_examen as string) ?? null, fechaInicio: p.fecha_inicio as string, horasPorDia: Number(p.horas_por_dia), diasPorSemana: p.dias_por_semana as number, minutosPorSesion: p.minutos_por_sesion as number, nivelInicial: p.nivel_inicial as "basico", prioridades: p.prioridades as Record<ModuloId, number> }
        : null,
      actividades: (ok(actividades) as Record<string, unknown>[]).map(aActividad),
      repasos: (ok(repasos) as Record<string, unknown>[]).map((r) => ({ preguntaId: r.pregunta_id as string, facilidad: Number(r.facilidad), intervaloDias: r.intervalo_dias as number, repeticiones: r.repeticiones as number, proxima: r.proxima as string })),
      fichas: (ok(fichas) as Record<string, unknown>[]).map((f) => ({ id: f.id as string, titulo: f.titulo as string, modulo: (f.modulo_id as ModuloId) ?? null, contenido: f.contenido as string, fuenteId: (f.fuente_id as string) ?? undefined, creada: f.creada as string })),
      documentos: (ok(documentos) as Record<string, unknown>[]).map((d) => ({ id: d.id as string, nombre: d.nombre as string, categoria: d.categoria as never, tamano: Number(d.tamano), subido: d.subido as string, ruta: d.ruta_storage as string })),
      ajustes: { ...AJUSTES_INICIALES, ...global, ...propio },
      comportamentales: (ok(resultados) as Record<string, unknown>[]).map((r) => ({ id: r.id as string, fecha: r.creado as string, porCompetencia: (r.detalle as { porCompetencia: never }).porCompetencia, total: Number(r.comportamentales) })),
      esAdmin: (ok(perfil) as { rol: string } | null)?.rol === "admin",
      usuario: { id: user.id, email: user.email ?? null }
    };
  },

  async guardarIntento(i) {
    const sb = getSupabase();
    const user = await usuarioActual();
    ok(await sb.from("intentos").upsert({ id: i.id, user_id: user.id, modalidad: i.config.modalidad, config: i.config, orden: i.orden, inicio: i.inicio, fin: i.fin, puntaje: i.puntaje, finalizado: i.finalizado }));
    if (i.finalizado) {
      ok(await sb.from("respuestas").insert(i.respuestas.map((r) => ({ intento_id: i.id, user_id: user.id, pregunta_id: r.preguntaId, seleccion: r.seleccion, correcta: r.correcta, marcada: r.marcada, segundos: Math.round(r.segundos) }))));
    }
  },

  async guardarPlan(cfg, actividades) {
    const sb = getSupabase();
    const user = await usuarioActual();
    const plan = ok(
      await sb.from("planes_estudio").upsert({ user_id: user.id, fecha_examen: cfg.fechaExamen, fecha_inicio: cfg.fechaInicio, horas_por_dia: cfg.horasPorDia, dias_por_semana: cfg.diasPorSemana, minutos_por_sesion: cfg.minutosPorSesion, nivel_inicial: cfg.nivelInicial, prioridades: cfg.prioridades, actualizado: new Date().toISOString() }, { onConflict: "user_id" }).select("id").single()
    ) as { id: string };
    ok(await sb.from("actividades_estudio").delete().eq("user_id", user.id));
    if (actividades.length) {
      ok(await sb.from("actividades_estudio").insert(actividades.map((a) => ({ id: a.id, user_id: user.id, plan_id: plan.id, fecha: a.fecha, modulo_id: a.modulo, tipo: a.tipo, titulo: a.titulo, minutos: a.minutos, completada: a.completada, reprogramada_desde: a.reprogramadaDesde ?? null }))));
    }
  },

  async actualizarActividad(a) {
    ok(await getSupabase().from("actividades_estudio").update({ completada: a.completada, fecha: a.fecha }).eq("id", a.id));
  },

  async guardarRepasos(estados) {
    const user = await usuarioActual();
    ok(await getSupabase().from("historial_repasos").upsert(estados.map((e) => ({ user_id: user.id, pregunta_id: e.preguntaId, facilidad: e.facilidad, intervalo_dias: e.intervaloDias, repeticiones: e.repeticiones, proxima: e.proxima }))));
  },

  async guardarFicha(f) {
    const user = await usuarioActual();
    const id = /^[0-9a-f-]{36}$/.test(f.id) ? f.id : crypto.randomUUID();
    ok(await getSupabase().from("fichas_estudio").upsert({ id, user_id: user.id, titulo: f.titulo, modulo_id: f.modulo, contenido: f.contenido, fuente_id: f.fuenteId ?? null }));
  },
  async borrarFicha(id) {
    ok(await getSupabase().from("fichas_estudio").delete().eq("id", id));
  },

  async guardarAjustes(a) {
    const user = await usuarioActual();
    ok(await getSupabase().from("configuraciones").upsert({ user_id: user.id, clave: "ajustes", valor: a, actualizado: new Date().toISOString() }, { onConflict: "user_id,clave" }));
  },

  async guardarComportamental(r) {
    const user = await usuarioActual();
    ok(await getSupabase().from("resultados").insert({ user_id: user.id, tipo: "comportamental_practica", comportamentales: r.total, detalle: { porCompetencia: r.porCompetencia } }));
  },

  async guardarPreguntas(ps) {
    const sb = getSupabase();
    ok(await sb.from("preguntas").upsert(ps.map((p) => ({ id: p.id, modulo_id: p.modulo, tema_id: p.temaId, subtema: p.subtema ?? null, nucleo: p.nucleo, dificultad: p.dificultad, tipo: p.tipo, enunciado: p.enunciado, explicacion: p.explicacion, fuente_id: p.fuenteId, referencia: p.referencia ?? null, es_inferencia: p.esInferencia, etiquetas: p.etiquetas, estado: p.estado, autor: p.autor }))));
    ok(await sb.from("opciones").upsert(ps.flatMap((p) => p.opciones.map((o) => ({ pregunta_id: p.id, letra: o.id, texto: o.texto, justificacion: o.justificacion, es_correcta: o.id === p.correcta })))));
  },

  async subirDocumento(archivo, categoria) {
    if (archivo.size > 25 * 1024 * 1024) throw new Error("El archivo supera 25 MB.");
    const sb = getSupabase();
    const user = await usuarioActual();
    const ruta = `${user.id}/${crypto.randomUUID()}-${archivo.name.replace(/[^\w.-]+/g, "_")}`;
    ok(await sb.storage.from("documentos").upload(ruta, archivo, { contentType: archivo.type || "application/pdf" }));
    const d = ok(await sb.from("documentos").insert({ user_id: user.id, nombre: archivo.name, categoria, ruta_storage: ruta, tamano: archivo.size }).select("*").single()) as Record<string, unknown>;
    return { id: d.id as string, nombre: archivo.name, categoria, tamano: archivo.size, subido: d.subido as string, ruta };
  },
  async urlDocumento(doc) {
    const r = ok(await getSupabase().storage.from("documentos").createSignedUrl(doc.ruta, 600)) as { signedUrl: string };
    return r.signedUrl;
  },
  async borrarDocumento(doc) {
    const sb = getSupabase();
    ok(await sb.storage.from("documentos").remove([doc.ruta]));
    ok(await sb.from("documentos").delete().eq("id", doc.id));
  },

  async registrar(accion, detalle) {
    const user = await usuarioActual();
    await getSupabase().from("registro_actividad").insert({ user_id: user.id, accion, detalle: detalle ?? null });
  },

  async exportar() {
    const estado = await this.cargar();
    return JSON.stringify({ ...estado, preguntas: undefined }, null, 2);
  }
};

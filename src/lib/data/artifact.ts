"use client";

/**
 * Persistencia del artifact publicado en claude.ai: capacidad `db`, en el subárbol privado
 * del usuario (`data/users/<id>/...`), que nadie más puede leer. Los PDF van a `assets`.
 * Si la vista no ofrece `db`, cae al modo local del navegador y lo indica.
 */
import { BANCO_SEMILLA } from "@/lib/content/preguntas";
import type { DocumentoUsuario, EstadoPregunta, Ficha, Intento, Pregunta, ResultadoComportamental } from "@/lib/domain/types";
import { uid } from "@/lib/domain/util";
import { capacidad } from "@/lib/plataforma";
import { repositorioLocal } from "./local";
import { AJUSTES_INICIALES, type EstadoApp, type ModoDatos, type Repositorio } from "./repository";

type Snap = { exists: boolean; id: string; data(): Record<string, unknown> | undefined };
type DocRef = { get(): Promise<Snap>; set(d: Record<string, unknown>): Promise<void>; delete(): Promise<void>; collection(p: string): ColRef };
type ColRef = { doc(id?: string): DocRef; get(): Promise<{ docs: Snap[] }> };
type DB = { doc(p: string): DocRef; collection(p: string): ColRef };
type User = { id(): Promise<string | null> };
type Assets = { upload(b: Blob): Promise<{ id: string; url: string; sizeBytes: number }>; delete(ref: string): Promise<unknown> };

const ESPERA_MS = 12_000;
function conTiempo<T>(p: Promise<T>, que: string): Promise<T> {
  return Promise.race([p, new Promise<T>((_, rej) => setTimeout(() => rej(new Error(`No fue posible conectar con el almacenamiento (${que}). Revise su conexión y recargue.`)), ESPERA_MS))]);
}

let db: DB | null = null;
let base = "";
let modo: ModoDatos = "artifact";
let serial = Promise.resolve();

/** Una escritura a la vez (la capacidad pide no solapar escrituras al mismo documento). */
function enCola<T>(f: () => Promise<T>): Promise<T> {
  const r = serial.then(f, f);
  serial = r.then(() => undefined, () => undefined);
  return r;
}

const doc = (k: string) => db!.doc(`${base}/${k}`);
const col = (contenedor: string, nombre: string) => db!.doc(`${base}/${contenedor}`).collection(nombre);
const limpio = <T,>(x: T) => JSON.parse(JSON.stringify(x)) as T;

async function leerDoc<T>(k: string, defecto: T): Promise<T> {
  const s = await conTiempo(doc(k).get(), k);
  return s.exists ? ((s.data() as T) ?? defecto) : defecto;
}
async function leerCol<T>(c: string, n: string): Promise<T[]> {
  const q = await conTiempo(col(c, n).get(), n);
  return q.docs.filter((d) => d.exists).map((d) => d.data() as T);
}

async function iniciar(): Promise<boolean> {
  if (db) return true;
  const [d, u] = await Promise.all([capacidad<DB>("db"), capacidad<User>("user")]);
  const id = u ? await u.id().catch(() => null) : null;
  if (!d || !id) return false;
  db = d;
  base = `data/users/${id}`;
  return true;
}

export const repositorioArtifact: Repositorio = {
  get modo() {
    return modo;
  },

  async cargar(): Promise<EstadoApp> {
    if (!(await iniciar())) {
      modo = "local";
      return repositorioLocal.cargar();
    }
    modo = "artifact";
    const [perfil, actividades, repasos, banco, intentos, fichas, comps, docs, extra] = await Promise.all([
      leerDoc<{ planConfig?: EstadoApp["planConfig"]; ajustes?: EstadoApp["ajustes"] }>("perfil", {}),
      leerDoc<{ items: EstadoApp["actividades"] }>("actividades", { items: [] }),
      leerDoc<{ items: EstadoApp["repasos"] }>("repasos", { items: [] }),
      leerDoc<{ estados: Record<string, EstadoPregunta> }>("banco", { estados: {} }),
      leerCol<Intento>("historial", "intentos"),
      leerCol<Ficha>("estudio", "fichas"),
      leerCol<ResultadoComportamental>("estudio", "comportamentales"),
      leerCol<DocumentoUsuario>("estudio", "documentos"),
      leerCol<Pregunta>("banco", "preguntas")
    ]);
    const extraPorId = new Map(extra.map((p) => [p.id, p]));
    const preguntas = [...BANCO_SEMILLA.map((p) => extraPorId.get(p.id) ?? p), ...extra.filter((p) => !BANCO_SEMILLA.some((b) => b.id === p.id))].map((p) =>
      banco.estados?.[p.id] ? { ...p, estado: banco.estados[p.id] } : p
    );
    return {
      preguntas,
      intentos: intentos.sort((a, b) => a.inicio.localeCompare(b.inicio)),
      planConfig: perfil.planConfig ?? null,
      actividades: actividades.items ?? [],
      repasos: repasos.items ?? [],
      fichas,
      documentos: docs.sort((a, b) => b.subido.localeCompare(a.subido)),
      ajustes: { ...AJUSTES_INICIALES, ...(perfil.ajustes ?? {}) },
      comportamentales: comps.sort((a, b) => a.fecha.localeCompare(b.fecha)),
      esAdmin: true,
      usuario: null
    };
  },

  async guardarIntento(i) {
    if (modo === "local") return repositorioLocal.guardarIntento(i);
    await enCola(() => col("historial", "intentos").doc(i.id).set(limpio(i) as unknown as Record<string, unknown>));
  },

  async guardarPlan(cfg, actividades) {
    if (modo === "local") return repositorioLocal.guardarPlan(cfg, actividades);
    const perfil = await leerDoc<Record<string, unknown>>("perfil", {});
    await enCola(() => doc("perfil").set(limpio({ ...perfil, planConfig: cfg })));
    await enCola(() => doc("actividades").set(limpio({ items: actividades })));
  },

  async actualizarActividad(a) {
    if (modo === "local") return repositorioLocal.actualizarActividad(a);
    const actual = await leerDoc<{ items: EstadoApp["actividades"] }>("actividades", { items: [] });
    await enCola(() => doc("actividades").set(limpio({ items: actual.items.map((x) => (x.id === a.id ? a : x)) })));
  },

  async guardarRepasos(estados) {
    if (modo === "local") return repositorioLocal.guardarRepasos(estados);
    const actual = await leerDoc<{ items: EstadoApp["repasos"] }>("repasos", { items: [] });
    const m = new Map(actual.items.map((r) => [r.preguntaId, r]));
    estados.forEach((e) => m.set(e.preguntaId, e));
    await enCola(() => doc("repasos").set(limpio({ items: [...m.values()] })));
  },

  async guardarFicha(f) {
    if (modo === "local") return repositorioLocal.guardarFicha(f);
    await enCola(() => col("estudio", "fichas").doc(f.id).set(limpio(f) as unknown as Record<string, unknown>));
  },
  async borrarFicha(id) {
    if (modo === "local") return repositorioLocal.borrarFicha(id);
    await enCola(() => col("estudio", "fichas").doc(id).delete());
  },

  async guardarAjustes(a) {
    if (modo === "local") return repositorioLocal.guardarAjustes(a);
    const perfil = await leerDoc<Record<string, unknown>>("perfil", {});
    await enCola(() => doc("perfil").set(limpio({ ...perfil, ajustes: a })));
  },

  async guardarComportamental(r) {
    if (modo === "local") return repositorioLocal.guardarComportamental(r);
    await enCola(() => col("estudio", "comportamentales").doc(r.id).set(limpio(r) as unknown as Record<string, unknown>));
  },

  async guardarPreguntas(ps) {
    if (modo === "local") return repositorioLocal.guardarPreguntas(ps);
    const banco = await leerDoc<{ estados: Record<string, EstadoPregunta> }>("banco", { estados: {} });
    const estados = { ...(banco.estados ?? {}) };
    for (const p of ps) {
      const semilla = BANCO_SEMILLA.find((b) => b.id === p.id);
      if (semilla && JSON.stringify({ ...semilla, estado: p.estado }) === JSON.stringify(p)) {
        estados[p.id] = p.estado;
      } else {
        delete estados[p.id];
        await enCola(() => col("banco", "preguntas").doc(p.id).set(limpio(p) as unknown as Record<string, unknown>));
      }
    }
    await enCola(() => doc("banco").set({ estados }));
  },

  async subirDocumento(archivo, categoria) {
    if (modo === "local") return repositorioLocal.subirDocumento(archivo, categoria);
    const assets = await capacidad<Assets>("assets");
    if (!assets) throw new Error("La carga de archivos no está disponible en esta vista.");
    if (archivo.size > 20 * 1024 * 1024) throw new Error("El archivo supera 20 MB.");
    let r: { id: string; url: string; sizeBytes: number };
    try {
      r = await assets.upload(archivo);
    } catch (e) {
      throw new Error(`No fue posible subir el archivo (${(e as { code?: string }).code ?? "error"}).`);
    }
    const d: DocumentoUsuario = { id: uid("doc"), nombre: archivo.name, categoria, tamano: r.sizeBytes ?? archivo.size, subido: new Date().toISOString(), ruta: r.id, url: r.url };
    await enCola(() => col("estudio", "documentos").doc(d.id).set(limpio(d) as unknown as Record<string, unknown>));
    return d;
  },
  async urlDocumento(d) {
    if (modo === "local") return repositorioLocal.urlDocumento(d);
    return d.url ?? `/_blob/${d.ruta}`;
  },
  async borrarDocumento(d) {
    if (modo === "local") return repositorioLocal.borrarDocumento(d);
    const assets = await capacidad<Assets>("assets");
    await assets?.delete(d.ruta).catch(() => undefined);
    await enCola(() => col("estudio", "documentos").doc(d.id).delete());
  },

  async registrar() {
    /* sin bitácora en el artifact: evita escrituras innecesarias */
  },

  async exportar() {
    if (modo === "local") return repositorioLocal.exportar();
    const e = await this.cargar();
    return JSON.stringify({ ...e, preguntas: e.preguntas.filter((p) => p.autor !== "semilla") }, null, 2);
  }
};

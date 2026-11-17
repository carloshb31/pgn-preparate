"use client";

import { BANCO_SEMILLA } from "@/lib/content/preguntas";
import type { DocumentoUsuario, EstadoPregunta, Pregunta } from "@/lib/domain/types";
import { uid } from "@/lib/domain/util";
import { AJUSTES_INICIALES, type EstadoApp, type Repositorio } from "./repository";

/**
 * MODO LOCAL DE DEMOSTRACIÓN.
 * Persiste solo en el navegador (localStorage + IndexedDB para PDF). No hay sincronización remota.
 */
const CLAVE = "pgn-preparate:v1";

interface Guardado {
  version: 1;
  preguntasExtra: Pregunta[];
  estados: Record<string, EstadoPregunta>;
  intentos: EstadoApp["intentos"];
  planConfig: EstadoApp["planConfig"];
  actividades: EstadoApp["actividades"];
  repasos: EstadoApp["repasos"];
  fichas: EstadoApp["fichas"];
  documentos: EstadoApp["documentos"];
  ajustes: EstadoApp["ajustes"];
  comportamentales: EstadoApp["comportamentales"];
  registro: { fecha: string; accion: string; detalle?: unknown }[];
}

const vacio = (): Guardado => ({
  version: 1,
  preguntasExtra: [],
  estados: {},
  intentos: [],
  planConfig: null,
  actividades: [],
  repasos: [],
  fichas: [],
  documentos: [],
  ajustes: AJUSTES_INICIALES,
  comportamentales: [],
  registro: []
});

function leer(): Guardado {
  try {
    const raw = localStorage.getItem(CLAVE);
    if (!raw) return vacio();
    const g = JSON.parse(raw) as Guardado;
    return { ...vacio(), ...g, ajustes: { ...AJUSTES_INICIALES, ...g.ajustes } };
  } catch {
    return vacio();
  }
}

function escribir(mutar: (g: Guardado) => void) {
  const g = leer();
  mutar(g);
  g.registro = g.registro.slice(-500);
  try {
    localStorage.setItem(CLAVE, JSON.stringify(g));
  } catch (e) {
    throw new Error("No fue posible guardar en el navegador (almacenamiento lleno o bloqueado).", { cause: e });
  }
}

// ---------- IndexedDB para PDF ----------
const DB = "pgn-preparate-docs";
function abrirDB(): Promise<IDBDatabase> {
  return new Promise((ok, mal) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore("archivos");
    req.onsuccess = () => ok(req.result);
    req.onerror = () => mal(req.error);
  });
}
async function idb<T>(modo: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await abrirDB();
  return new Promise((ok, mal) => {
    const tx = db.transaction("archivos", modo);
    const req = fn(tx.objectStore("archivos"));
    req.onsuccess = () => ok(req.result);
    req.onerror = () => mal(req.error);
  });
}

function combinar(g: Guardado): Pregunta[] {
  const extra = new Map(g.preguntasExtra.map((p) => [p.id, p]));
  const base = BANCO_SEMILLA.map((p) => extra.get(p.id) ?? p);
  const nuevas = g.preguntasExtra.filter((p) => !BANCO_SEMILLA.some((b) => b.id === p.id));
  return [...base, ...nuevas].map((p) => (g.estados[p.id] ? { ...p, estado: g.estados[p.id] } : p));
}

export const repositorioLocal: Repositorio = {
  modo: "local",
  async cargar() {
    const g = leer();
    return {
      preguntas: combinar(g),
      intentos: g.intentos,
      planConfig: g.planConfig,
      actividades: g.actividades,
      repasos: g.repasos,
      fichas: g.fichas,
      documentos: g.documentos,
      ajustes: g.ajustes,
      comportamentales: g.comportamentales,
      esAdmin: true, // un solo usuario local
      usuario: null
    };
  },
  async guardarIntento(i) {
    escribir((g) => {
      const idx = g.intentos.findIndex((x) => x.id === i.id);
      if (idx >= 0) {
        if (g.intentos[idx].finalizado) throw new Error("Intento finalizado: no se puede modificar.");
        g.intentos[idx] = i;
      } else g.intentos.push(i);
    });
  },
  async guardarPlan(cfg, actividades) {
    escribir((g) => {
      g.planConfig = cfg;
      g.actividades = actividades;
    });
  },
  async actualizarActividad(a) {
    escribir((g) => {
      g.actividades = g.actividades.map((x) => (x.id === a.id ? a : x));
    });
  },
  async guardarRepasos(estados) {
    escribir((g) => {
      const m = new Map(g.repasos.map((r) => [r.preguntaId, r]));
      estados.forEach((e) => m.set(e.preguntaId, e));
      g.repasos = [...m.values()];
    });
  },
  async guardarFicha(f) {
    escribir((g) => {
      g.fichas = [...g.fichas.filter((x) => x.id !== f.id), f];
    });
  },
  async borrarFicha(id) {
    escribir((g) => {
      g.fichas = g.fichas.filter((x) => x.id !== id);
    });
  },
  async guardarAjustes(a) {
    escribir((g) => {
      g.ajustes = a;
    });
  },
  async guardarComportamental(r) {
    escribir((g) => {
      g.comportamentales.push(r);
    });
  },
  async guardarPreguntas(ps) {
    escribir((g) => {
      for (const p of ps) {
        const semilla = BANCO_SEMILLA.find((b) => b.id === p.id);
        if (semilla && JSON.stringify({ ...semilla, estado: p.estado }) === JSON.stringify(p)) {
          g.estados[p.id] = p.estado; // solo cambió el estado
        } else {
          g.preguntasExtra = [...g.preguntasExtra.filter((x) => x.id !== p.id), p];
          delete g.estados[p.id];
        }
      }
    });
  },
  async subirDocumento(archivo, categoria) {
    if (archivo.size > 25 * 1024 * 1024) throw new Error("El archivo supera 25 MB.");
    const id = uid("doc");
    await idb("readwrite", (s) => s.put(archivo, id));
    const doc: DocumentoUsuario = { id, nombre: archivo.name, categoria, tamano: archivo.size, subido: new Date().toISOString(), ruta: id };
    escribir((g) => {
      g.documentos.push(doc);
    });
    return doc;
  },
  async urlDocumento(doc) {
    const blob = await idb<Blob>("readonly", (s) => s.get(doc.ruta) as IDBRequest<Blob>);
    if (!blob) throw new Error("El archivo no está en este navegador.");
    return URL.createObjectURL(blob);
  },
  async borrarDocumento(doc) {
    await idb("readwrite", (s) => s.delete(doc.ruta));
    escribir((g) => {
      g.documentos = g.documentos.filter((d) => d.id !== doc.id);
    });
  },
  async registrar(accion, detalle) {
    escribir((g) => {
      g.registro.push({ fecha: new Date().toISOString(), accion, detalle });
    });
  },
  async exportar() {
    return JSON.stringify(leer(), null, 2);
  },
  async restablecer() {
    localStorage.removeItem(CLAVE);
    try {
      indexedDB.deleteDatabase(DB);
    } catch {
      /* noop */
    }
  }
};

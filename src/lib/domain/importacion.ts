import { z } from "zod";
import type { Pregunta } from "./types";
import { MODULO_IDS, temaPorId } from "@/lib/content/temario";
import { FUENTE_POR_ID } from "@/lib/content/fuentes";

const LETRAS = ["A", "B", "C", "D"] as const;

const EsquemaPregunta = z
  .object({
    id: z.string().regex(/^[\w-]{3,40}$/, "id inválido"),
    modulo: z.enum(MODULO_IDS as [string, ...string[]]),
    temaId: z.string(),
    subtema: z.string().optional(),
    nucleo: z.enum(["general", "especifico"]).optional(),
    dificultad: z.coerce.number().int().min(1).max(5),
    tipo: z.enum(["conceptual", "normativa", "interpretacion", "escenario", "resolucion_problemas", "decision_tecnica", "asesoria_institucional", "caso_ciberseguridad"]),
    enunciado: z.string().min(20),
    opciones: z.array(z.object({ id: z.enum(LETRAS), texto: z.string().min(1), justificacion: z.string().min(5) })).length(4),
    correcta: z.enum(LETRAS),
    explicacion: z.string().min(20),
    fuenteId: z.string(),
    referencia: z.string().optional(),
    esInferencia: z.union([z.boolean(), z.string()]).transform((v) => v === true || v === "true" || v === "si" || v === "sí").optional(),
    etiquetas: z.union([z.array(z.string()), z.string()]).optional()
  })
  .superRefine((p, ctx) => {
    const t = temaPorId(p.temaId);
    if (!t) ctx.addIssue({ code: "custom", message: `tema ${p.temaId} no existe` });
    else if (t.modulo.id !== p.modulo) ctx.addIssue({ code: "custom", message: `el tema ${p.temaId} no pertenece a ${p.modulo}` });
    if (!FUENTE_POR_ID[p.fuenteId]) ctx.addIssue({ code: "custom", message: `fuente ${p.fuenteId} no está en el repositorio` });
    if (new Set(p.opciones.map((o) => o.id)).size !== 4) ctx.addIssue({ code: "custom", message: "opciones repetidas" });
  });

/** Parser CSV (RFC 4180): comillas dobles, comas y saltos de línea dentro de campos. */
export function parsearCSV(texto: string): string[][] {
  const filas: string[][] = [];
  let fila: string[] = [];
  let campo = "";
  let comillas = false;
  const t = texto.replace(/^﻿/, "");
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (comillas) {
      if (c === '"' && t[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') comillas = false;
      else campo += c;
    } else if (c === '"') comillas = true;
    else if (c === "," || c === ";") { fila.push(campo); campo = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && t[i + 1] === "\n") i++;
      fila.push(campo);
      if (fila.some((x) => x.trim() !== "")) filas.push(fila);
      fila = [];
      campo = "";
    } else campo += c;
  }
  fila.push(campo);
  if (fila.some((x) => x.trim() !== "")) filas.push(fila);
  return filas;
}

export const COLUMNAS_CSV = [
  "id", "modulo", "temaId", "subtema", "dificultad", "tipo", "enunciado",
  "A", "A_justificacion", "B", "B_justificacion", "C", "C_justificacion", "D", "D_justificacion",
  "correcta", "explicacion", "fuenteId", "referencia", "esInferencia", "etiquetas"
];

function filaAObjeto(cab: string[], f: string[]) {
  const o: Record<string, string> = {};
  cab.forEach((c, i) => (o[c.trim()] = (f[i] ?? "").trim()));
  return {
    ...o,
    subtema: o.subtema || undefined,
    referencia: o.referencia || undefined,
    opciones: LETRAS.map((l) => ({ id: l, texto: o[l], justificacion: o[`${l}_justificacion`] })),
    etiquetas: o.etiquetas ? o.etiquetas.split("|").map((x) => x.trim()).filter(Boolean) : []
  };
}

export interface ResultadoImportacion {
  validas: Pregunta[];
  errores: { fila: number; mensaje: string }[];
}

/** Toda pregunta importada entra como `pendiente_revision`, sin importar lo que diga el archivo. */
export function importarPreguntas(contenido: string, formato: "csv" | "json"): ResultadoImportacion {
  let crudos: unknown[];
  if (formato === "json") {
    const j = JSON.parse(contenido);
    crudos = Array.isArray(j) ? j : Array.isArray(j.preguntas) ? j.preguntas : [];
  } else {
    const filas = parsearCSV(contenido);
    const [cab, ...resto] = filas;
    const faltan = COLUMNAS_CSV.filter((c) => !["subtema", "referencia", "esInferencia", "etiquetas"].includes(c) && !cab?.map((x) => x.trim()).includes(c));
    if (faltan.length) return { validas: [], errores: [{ fila: 1, mensaje: `Faltan columnas: ${faltan.join(", ")}` }] };
    crudos = resto.map((f) => filaAObjeto(cab, f));
  }
  const validas: Pregunta[] = [];
  const errores: ResultadoImportacion["errores"] = [];
  crudos.forEach((c, i) => {
    const r = EsquemaPregunta.safeParse(c);
    if (!r.success) {
      errores.push({ fila: i + (formato === "csv" ? 2 : 1), mensaje: r.error.issues.map((x) => `${x.path.join(".") || "pregunta"}: ${x.message}`).join("; ") });
      return;
    }
    const p = r.data;
    const mod = temaPorId(p.temaId)!.modulo;
    validas.push({
      id: p.id,
      modulo: p.modulo as Pregunta["modulo"],
      temaId: p.temaId,
      subtema: p.subtema,
      nucleo: p.nucleo ?? mod.nucleo,
      dificultad: p.dificultad as Pregunta["dificultad"],
      tipo: p.tipo,
      enunciado: p.enunciado,
      opciones: p.opciones,
      correcta: p.correcta,
      explicacion: p.explicacion,
      fuenteId: p.fuenteId,
      referencia: p.referencia,
      esInferencia: p.esInferencia ?? false,
      etiquetas: Array.isArray(p.etiquetas) ? p.etiquetas : p.etiquetas ? p.etiquetas.split("|") : [],
      estado: "pendiente_revision",
      autor: "admin"
    });
  });
  return { validas, errores };
}

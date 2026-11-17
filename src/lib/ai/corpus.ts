// Recuperación sobre el corpus versionado (compartido por el servidor Next y el artifact).
import { TEMARIO, temaPorId } from "@/lib/content/temario";
import { FUENTES } from "@/lib/content/fuentes";
import { BANCO_SEMILLA } from "@/lib/content/preguntas";
import { MATERIAL } from "@/lib/content/material";
import { CONVOCATORIA, REGLAS_RES_076 } from "@/lib/config/convocatoria";

export interface Fragmento {
  fuenteId: string;
  titulo: string;
  nivel: number;
  texto: string;
}

export const normalizar = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
export const terminos = (s: string) => normalizar(s).split(/[^a-z0-9]+/).filter((t) => t.length > 3);

export function corpusBase(temaId?: string): Fragmento[] {
  return [
    { fuenteId: "conv-51-2026", titulo: "Formato de Convocatoria 51-2026 v3", nivel: 1, texto: `Propósito del empleo: ${CONVOCATORIA.proposito}` },
    ...REGLAS_RES_076.map((r) => ({ fuenteId: "res-076-2026", titulo: `Resolución 076 de 2026, ${r.articulo}`, nivel: 1, texto: r.texto })),
    ...TEMARIO.flatMap((m) =>
      m.temas.map((t) => ({
        fuenteId: "conv-51-2026",
        titulo: `Temario · ${m.nombre}`,
        nivel: 1,
        texto: `${t.nombre} (${t.fundamento}). Subtemas: ${t.subtemas.join("; ")}. Fundamento: ${m.fundamentoConvocatoria.join("; ")}`
      }))
    ),
    ...FUENTES.map((f) => ({ fuenteId: f.id, titulo: f.titulo, nivel: f.nivel, texto: `${f.titulo}. Emisor: ${f.emisor}. ${f.notas ?? ""}` })),
    ...MATERIAL.filter((m) => !temaId || m.temaId === temaId).flatMap((m) =>
      m.puntos.map((p) => ({ fuenteId: p.fuenteId, titulo: `Material de estudio · ${temaPorId(m.temaId)?.tema.nombre ?? m.temaId}`, nivel: 3, texto: p.texto }))
    ),
    ...BANCO_SEMILLA.filter((p) => !temaId || p.temaId === temaId).map((p) => ({
      fuenteId: p.fuenteId,
      titulo: `Nota académica (${p.referencia ?? "sin referencia"})`,
      nivel: 3,
      texto: p.explicacion
    }))
  ];
}

export function ordenarPorRelevancia(fragmentos: Fragmento[], consulta: string, temaId?: string, limite = 8): Fragmento[] {
  const q = new Set(terminos(consulta + " " + (temaId ? temaPorId(temaId)?.tema.nombre ?? "" : "")));
  const puntuar = (f: Fragmento) => {
    let s = 0;
    for (const t of terminos(f.texto + " " + f.titulo)) if (q.has(t)) s++;
    return s + (5 - f.nivel) * 0.5;
  };
  return fragmentos
    .map((f) => ({ f, s: puntuar(f) }))
    .filter((x) => x.s > 1)
    .sort((a, b) => b.s - a.s)
    .slice(0, limite)
    .map((x) => x.f);
}

export function formatearContexto(fs: Fragmento[]) {
  return fs.map((f, i) => `[${i + 1}] fuenteId=${f.fuenteId} · nivel ${f.nivel} · ${f.titulo}\n${f.texto}`).join("\n\n");
}

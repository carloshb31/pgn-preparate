import "server-only";
import { createClient } from "@supabase/supabase-js";
import { corpusBase, formatearContexto, normalizar, ordenarPorRelevancia, terminos, type Fragmento } from "./corpus";

export type { Fragmento };
export { formatearContexto };

/**
 * Recuperación (la "R" de RAG) en el servidor: documentos globales cargados en Supabase
 * (si hay credencial de servidor) más el corpus versionado.
 */
export async function recuperar(consulta: string, temaId?: string, limite = 8): Promise<Fragmento[]> {
  const docs = await recuperarDocumentos(consulta).catch(() => [] as Fragmento[]);
  return ordenarPorRelevancia([...docs, ...corpusBase(temaId)], consulta, temaId, limite);
}

async function recuperarDocumentos(consulta: string): Promise<Fragmento[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return [];
  const sb = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await sb
    .from("documentos")
    .select("nombre, fuente_id, texto_extraido, fuentes(nivel)")
    .is("user_id", null)
    .textSearch("texto_extraido", terminos(consulta).slice(0, 6).join(" | "), { config: "spanish" })
    .limit(4);
  if (error || !data) return [];
  return data.map((d) => {
    const texto = String(d.texto_extraido ?? "");
    const t0 = terminos(consulta)[0] ?? "";
    const i = Math.max(0, normalizar(texto).indexOf(t0) - 400);
    return {
      fuenteId: (d.fuente_id as string) ?? "academico",
      titulo: d.nombre as string,
      nivel: ((d.fuentes as { nivel?: number } | null)?.nivel ?? 3) as number,
      texto: texto.slice(i, i + 1600)
    };
  });
}

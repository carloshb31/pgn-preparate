"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { ExternalLink, FileText, Trash2, Upload } from "lucide-react";
import { useStore } from "@/components/store";
import { Aviso, Badge, Boton, Card, Campo, PageHeader, Vacio, cx, inputCls } from "@/components/ui";
import { FUENTES, ETIQUETA_NIVEL, FUENTE_POR_ID } from "@/lib/content/fuentes";
import { MATERIAL_POR_TEMA } from "@/lib/content/material";
import { TEMARIO, MODULO_POR_ID } from "@/lib/content/temario";
import { CONVOCATORIA } from "@/lib/config/convocatoria";
import type { CategoriaBiblioteca, ModuloId } from "@/lib/domain/types";
import { formatoFecha, uid } from "@/lib/domain/util";

const CATEGORIAS: Record<CategoriaBiblioteca, string> = {
  convocatoria: "Documentos oficiales de la convocatoria",
  resoluciones: "Resoluciones",
  legislacion: "Legislación colombiana",
  seguridad: "Seguridad informática",
  ciberseguridad: "Ciberseguridad",
  redes: "Redes",
  sistemas_operativos: "Sistemas operativos",
  cloud: "Cloud",
  continuidad: "Continuidad",
  arquitectura: "Arquitectura y proyectos",
  gestion_publica: "Gestión pública",
  comportamentales: "Competencias comportamentales"
};

type Pestana = "temario" | "fuentes" | "documentos" | "fichas";

function Biblioteca() {
  const { estado, repo, subirDocumento, borrarDocumento, guardarFicha, borrarFicha } = useStore();
  const params = useSearchParams();
  const [pestana, setPestana] = useState<Pestana>("temario");
  const [modulo, setModulo] = useState<string>(params.get("modulo") ?? TEMARIO[0].id);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<CategoriaBiblioteca>("convocatoria");
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ficha, setFicha] = useState({ titulo: "", contenido: "", modulo: "" });

  const fuentes = useMemo(() => {
    const t = q.trim().toLowerCase();
    return FUENTES.filter((f) => !t || `${f.titulo} ${f.emisor} ${f.notas ?? ""}`.toLowerCase().includes(t)).sort((a, b) => a.nivel - b.nivel);
  }, [q]);
  if (!estado) return null;
  const m = MODULO_POR_ID[modulo as ModuloId];

  async function subir(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (f.type !== "application/pdf") return setError("Solo se admiten archivos PDF.");
    setError(null);
    setSubiendo(true);
    try {
      await subirDocumento(f, cat);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No fue posible subir el archivo.");
    } finally {
      setSubiendo(false);
    }
  }

  async function abrir(id: string) {
    const doc = estado!.documentos.find((d) => d.id === id);
    if (!doc) return;
    try {
      window.open(await repo.urlDocumento(doc), "_blank", "noopener");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No fue posible abrir el documento.");
    }
  }

  const fichas = estado.fichas.filter((f) => !q || `${f.titulo} ${f.contenido}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHeader titulo="Biblioteca académica" descripcion="Temario oficial, repositorio de fuentes por nivel de autoridad, sus documentos PDF y fichas de estudio." />
      <div className="mb-4 flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1 text-sm" role="tablist">
        {([["temario", "Temario oficial"], ["fuentes", "Fuentes"], ["documentos", "Mis documentos"], ["fichas", "Fichas de estudio"]] as [Pestana, string][]).map(([k, t]) => (
          <button key={k} role="tab" aria-selected={pestana === k} onClick={() => setPestana(k)} className={cx("rounded-md px-3 py-1.5", pestana === k ? "bg-white font-medium text-navy-900 shadow-sm" : "text-slate-600")}>{t}</button>
        ))}
      </div>

      {pestana === "temario" && (
        <div className="grid gap-4 lg:grid-cols-[18rem_1fr]">
          <Card>
            <ul className="space-y-1">
              {TEMARIO.map((x) => (
                <li key={x.id}>
                  <button onClick={() => setModulo(x.id)} className={cx("w-full rounded-md px-2 py-1.5 text-left text-sm", modulo === x.id ? "bg-navy-800 text-white" : "hover:bg-slate-100")}>M{x.numero} · {x.nombre}</button>
                </li>
              ))}
            </ul>
          </Card>
          <Card titulo={`Módulo ${m.numero}. ${m.nombre}`} accion={<Badge tono={m.nucleo === "general" ? "neutro" : "azul"}>Núcleo {m.nucleo}</Badge>}>
            <p className="text-sm text-slate-700">{m.descripcion}</p>
            <div className="mt-3 rounded-lg bg-navy-50 p-3 text-xs text-navy-800">
              <p className="font-semibold">Fundamento en el Formato de Convocatoria {CONVOCATORIA.codigo}</p>
              <ul className="mt-1 list-disc pl-4">{m.fundamentoConvocatoria.map((f) => <li key={f}>{f}</li>)}</ul>
            </div>
            <ul className="mt-4 divide-y divide-slate-100">
              {m.temas.map((t) => (
                <li key={t.id} className="py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-navy-900">{t.nombre}</p>
                    <Badge tono={t.fundamento === "conocimiento_esencial" ? "ok" : t.fundamento === "funcion" ? "azul" : "neutro"}>
                      {t.fundamento === "conocimiento_esencial" ? "Exigido expresamente" : t.fundamento === "funcion" ? "Derivado de funciones" : "Complementario"}
                    </Badge>
                    <span className="text-xs text-slate-500">{estado.preguntas.filter((p) => p.temaId === t.id).length} preguntas</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{t.subtemas.join(" · ")}</p>
                  {MATERIAL_POR_TEMA[t.id] && (
                    <details className="group mt-2 rounded-lg border border-slate-200 bg-slate-50 open:bg-white">
                      <summary className="cursor-pointer select-none px-3 py-2 text-sm font-medium text-azul-600">Material de estudio</summary>
                      <div className="space-y-3 px-3 pb-3 text-sm">
                        <p className="text-slate-800">{MATERIAL_POR_TEMA[t.id].resumen}</p>
                        <ul className="space-y-2">
                          {MATERIAL_POR_TEMA[t.id].puntos.map((pt, i) => {
                            const f = FUENTE_POR_ID[pt.fuenteId];
                            return (
                              <li key={i} className="border-l-2 border-navy-100 pl-3">
                                <p className="text-slate-700">{pt.texto}</p>
                                <p className="mt-0.5 text-xs text-slate-500">
                                  {f?.url ? <a href={f.url} target="_blank" rel="noreferrer" className="text-azul-600 hover:underline">{f.titulo}</a> : f?.titulo}
                                  {pt.referencia ? ` · ${pt.referencia}` : ""}
                                </p>
                              </li>
                            );
                          })}
                        </ul>
                        {MATERIAL_POR_TEMA[t.id].trampas && (
                          <div className="rounded-md bg-warn-50 p-2 text-xs text-warn-700">
                            <p className="font-semibold">Confusiones frecuentes</p>
                            <ul className="mt-1 list-disc pl-4">{MATERIAL_POR_TEMA[t.id].trampas!.map((x) => <li key={x}>{x}</li>)}</ul>
                          </div>
                        )}
                      </div>
                    </details>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-500">El material de estudio es una síntesis de repaso pendiente de revisión: confirme siempre los datos normativos en la fuente oficial enlazada.</p>
          </Card>
        </div>
      )}

      {pestana === "fuentes" && (
        <>
          <input className={cx(inputCls, "mb-4 max-w-md")} placeholder="Buscar fuente" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar fuente" />
          <Aviso tono="azul">Los recursos comunitarios (nivel 4) nunca prevalecen sobre la normativa y los documentos oficiales. «Sin verificar» significa que nadie ha confirmado aún su vigencia desde la aplicación.</Aviso>
          {[1, 2, 3, 4].map((nivel) => {
            const lista = fuentes.filter((f) => f.nivel === nivel);
            if (!lista.length) return null;
            return (
              <Card key={nivel} className="mt-4" titulo={ETIQUETA_NIVEL[nivel]}>
                <ul className="divide-y divide-slate-100">
                  {lista.map((f) => (
                    <li key={f.id} className="flex flex-wrap items-start justify-between gap-2 py-2.5 text-sm">
                      <div>
                        <p className="text-navy-900">{f.titulo}</p>
                        <p className="text-xs text-slate-500">{f.emisor} · {CATEGORIAS[f.categoria]}{f.notas ? ` · ${f.notas}` : ""}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {f.fechaVerificacion ? <Badge tono="ok">Verificada {formatoFecha(f.fechaVerificacion)}</Badge> : <Badge tono="warn">Sin verificar</Badge>}
                        {f.url && <a href={f.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-azul-600 hover:underline">Abrir <ExternalLink className="h-3.5 w-3.5" /></a>}
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </>
      )}

      {pestana === "documentos" && (
        <Card titulo="Mis documentos PDF">
          <div className="flex flex-wrap items-end gap-3">
            <Campo etiqueta="Categoría">
              <select className={inputCls} value={cat} onChange={(e) => setCat(e.target.value as CategoriaBiblioteca)}>
                {Object.entries(CATEGORIAS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </Campo>
            <label className={cx("inline-flex cursor-pointer items-center gap-2 rounded-lg bg-navy-800 px-4 py-2 text-sm font-medium text-white hover:bg-navy-700", subiendo && "pointer-events-none opacity-50")}>
              <Upload className="h-4 w-4" /> {subiendo ? "Subiendo…" : "Subir PDF"}
              <input type="file" accept="application/pdf" className="sr-only" onChange={subir} />
            </label>
          </div>
          <p className="mt-2 text-xs text-slate-500">{repo.modo === "local" ? "Modo local: los archivos quedan en este navegador (IndexedDB). Máximo 25 MB." : repo.modo === "artifact" ? "Se guardan en el almacenamiento de esta aplicación en Claude. Máximo 20 MB." : "Se guardan en Supabase Storage, accesibles solo para usted. Máximo 25 MB."}</p>
          {error && <div className="mt-3"><Aviso tono="bad">{error}</Aviso></div>}
          {estado.documentos.length === 0 ? (
            <div className="mt-4"><Vacio titulo="No ha cargado documentos">Suba la Resolución 076 de 2026, el formato de la convocatoria o el Diccionario de Competencias para tenerlos a mano.</Vacio></div>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100">
              {estado.documentos.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  {doc.url ? (
                    <a href={doc.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-left text-navy-900 hover:underline"><FileText className="h-4 w-4 text-azul-600" />{doc.nombre}</a>
                  ) : (
                    <button onClick={() => abrir(doc.id)} className="flex items-center gap-2 text-left text-navy-900 hover:underline"><FileText className="h-4 w-4 text-azul-600" />{doc.nombre}</button>
                  )}
                  <span className="flex items-center gap-3 text-xs text-slate-500">
                    {CATEGORIAS[doc.categoria]} · {(doc.tamano / 1024 / 1024).toFixed(1)} MB
                    <button onClick={() => borrarDocumento(doc.id)} aria-label={`Eliminar ${doc.nombre}`} className="rounded p-1 text-slate-400 hover:bg-bad-50 hover:text-bad-700"><Trash2 className="h-4 w-4" /></button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {pestana === "fichas" && (
        <div className="grid gap-4 lg:grid-cols-[22rem_1fr]">
          <Card titulo="Nueva ficha">
            <div className="space-y-3">
              <Campo etiqueta="Título"><input className={inputCls} value={ficha.titulo} onChange={(e) => setFicha({ ...ficha, titulo: e.target.value })} /></Campo>
              <Campo etiqueta="Módulo">
                <select className={inputCls} value={ficha.modulo} onChange={(e) => setFicha({ ...ficha, modulo: e.target.value })}>
                  <option value="">Sin módulo</option>
                  {TEMARIO.map((x) => <option key={x.id} value={x.id}>M{x.numero} · {x.nombre}</option>)}
                </select>
              </Campo>
              <Campo etiqueta="Contenido" ayuda="Use **texto** para resaltar conceptos clave.">
                <textarea rows={8} className={inputCls} value={ficha.contenido} onChange={(e) => setFicha({ ...ficha, contenido: e.target.value })} />
              </Campo>
              <Boton
                disabled={!ficha.titulo.trim() || !ficha.contenido.trim()}
                onClick={async () => {
                  await guardarFicha({ id: uid("fic"), titulo: ficha.titulo.trim(), contenido: ficha.contenido.trim(), modulo: (ficha.modulo || null) as ModuloId | null, creada: new Date().toISOString() });
                  setFicha({ titulo: "", contenido: "", modulo: "" });
                }}
              >
                Guardar ficha
              </Boton>
            </div>
          </Card>
          <div>
            <input className={cx(inputCls, "mb-3")} placeholder="Buscar en fichas" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar en fichas" />
            {fichas.length === 0 ? (
              <Vacio titulo="Sin fichas" />
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {fichas.map((f) => (
                  <Card key={f.id} titulo={f.titulo} accion={<button onClick={() => borrarFicha(f.id)} aria-label="Eliminar ficha" className="rounded p-1 text-slate-400 hover:text-bad-700"><Trash2 className="h-4 w-4" /></button>}>
                    {f.modulo && <Badge tono="azul">M{MODULO_POR_ID[f.modulo].numero}</Badge>}
                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                      {f.contenido.split(/(\*\*[^*]+\*\*)/g).map((parte, i) => (parte.startsWith("**") ? <mark key={i} className="rounded bg-warn-50 px-0.5 font-medium text-navy-900">{parte.slice(2, -2)}</mark> : parte))}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default function Pagina() {
  return (
    <Suspense>
      <Biblioteca />
    </Suspense>
  );
}

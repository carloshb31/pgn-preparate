"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { useStore } from "@/components/store";
import { servicioIA } from "@/lib/ai/cliente";
import { ES_ARTIFACT } from "@/lib/plataforma";
import { Aviso, Badge, Boton, Card, Campo, ETIQUETA_DIFICULTAD, PageHeader, cx, inputCls } from "@/components/ui";
import { TEMARIO, MODULO_POR_ID } from "@/lib/content/temario";
import { FUENTE_POR_ID } from "@/lib/content/fuentes";
import type { ModuloId, Pregunta } from "@/lib/domain/types";

type Msg = { rol: "user" | "assistant"; contenido: string; fuentes?: { n: number; titulo: string; nivel: number }[] };

export default function Asistente() {
  const { guardarPreguntas } = useStore();
  const ia = servicioIA();
  const [estadoIA, setEstadoIA] = useState<{ configurado: boolean; detalle: string } | null>(null);
  const [parcial, setParcial] = useState<string>("");
  const [pestana, setPestana] = useState<"tutor" | "generador">("tutor");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fin = useRef<HTMLDivElement>(null);

  const [gen, setGen] = useState({ modulo: TEMARIO[0].id as string, temaId: TEMARIO[0].temas[0].id, subtema: "", dificultad: 4, tipo: "escenario", cantidad: 3, escenario: "" });
  const [borradores, setBorradores] = useState<Pregunta[]>([]);
  const [descartadas, setDescartadas] = useState<string[]>([]);

  useEffect(() => {
    ia.estado().then(setEstadoIA);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    fin.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, parcial]);

  async function preguntar(e: React.FormEvent) {
    e.preventDefault();
    if (!texto.trim()) return;
    const nuevos: Msg[] = [...msgs, { rol: "user", contenido: texto.trim() }];
    setMsgs(nuevos);
    setTexto("");
    setCargando(true);
    setError(null);
    try {
      setParcial("");
      const j = await ia.tutor(nuevos.map(({ rol, contenido }) => ({ rol, contenido })), setParcial);
      setMsgs([...nuevos, { rol: "assistant", contenido: j.texto, fuentes: j.fuentes }]);
      setParcial("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error del asistente.");
    } finally {
      setCargando(false);
    }
  }

  async function generar() {
    setCargando(true);
    setError(null);
    setDescartadas([]);
    try {
      const j = await ia.generar({ temaId: gen.temaId, subtema: gen.subtema || undefined, dificultad: gen.dificultad, tipo: gen.tipo as never, cantidad: gen.cantidad, escenario: gen.escenario || undefined });
      setBorradores(j.preguntas);
      setDescartadas(j.descartadas ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al generar.");
    } finally {
      setCargando(false);
    }
  }

  const sinIA = estadoIA && !estadoIA.configurado;
  const modulo = MODULO_POR_ID[gen.modulo as ModuloId];

  return (
    <>
      <PageHeader titulo="Asistente IA" descripcion="Tutor y generador de preguntas con recuperación previa de fuentes (RAG). Toda pregunta generada entra como borrador y requiere validación." />
      {ES_ARTIFACT && estadoIA?.configurado && <div className="mb-4"><Aviso tono="azul">{estadoIA.detalle}</Aviso></div>}
      {sinIA && (
        <div className="mb-4">
          <Aviso tono="warn">
            El asistente no está disponible: {estadoIA?.detalle} Las demás funciones de la plataforma operan sin IA.
          </Aviso>
        </div>
      )}
      <div className="mb-4 flex gap-1 rounded-lg bg-slate-100 p-1 text-sm" role="tablist">
        {([["tutor", "Tutor académico"], ["generador", "Generador de preguntas"]] as const).map(([k, t]) => (
          <button key={k} role="tab" aria-selected={pestana === k} onClick={() => setPestana(k)} className={cx("rounded-md px-3 py-1.5", pestana === k ? "bg-white font-medium text-navy-900 shadow-sm" : "text-slate-600")}>{t}</button>
        ))}
      </div>
      {error && <div className="mb-4"><Aviso tono="bad">{error}</Aviso></div>}

      {pestana === "tutor" ? (
        <Card>
          <div className="h-[55vh] space-y-4 overflow-y-auto pr-1">
            {msgs.length === 0 && (
              <div className="grid h-full place-items-center text-center text-sm text-slate-500">
                <div>
                  <Sparkles className="mx-auto mb-2 h-6 w-6 text-azul-500" />
                  Pregunte, por ejemplo: «Explíqueme la diferencia entre RTO y RPO con un caso de la Procuraduría».
                </div>
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={cx("max-w-[85%] rounded-xl px-4 py-3 text-sm", m.rol === "user" ? "ml-auto bg-navy-800 text-white" : "bg-slate-100 text-slate-800")}>
                <p className="whitespace-pre-wrap">{m.contenido}</p>
                {m.fuentes && m.fuentes.length > 0 && (
                  <div className="mt-2 border-t border-slate-200 pt-2 text-xs text-slate-500">
                    {m.fuentes.map((f) => <p key={f.n}>[{f.n}] {f.titulo} · nivel {f.nivel}</p>)}
                  </div>
                )}
              </div>
            ))}
            {cargando && (parcial ? <div className="max-w-[85%] rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-800"><p className="whitespace-pre-wrap">{parcial}</p></div> : <p className="text-sm text-slate-500">Consultando fuentes y pensando…</p>)}
            <div ref={fin} />
          </div>
          <form onSubmit={preguntar} className="mt-4 flex gap-2">
            <input className={inputCls} value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escriba su pregunta" disabled={!!sinIA || cargando} aria-label="Pregunta para el tutor" />
            <Boton type="submit" disabled={!!sinIA || cargando || !texto.trim()} aria-label="Enviar"><Send className="h-4 w-4" /></Boton>
          </form>
        </Card>
      ) : (
        <>
          <Card titulo="Parámetros de generación">
            <div className="grid gap-3 md:grid-cols-3">
              <Campo etiqueta="Módulo">
                <select className={inputCls} value={gen.modulo} onChange={(e) => setGen({ ...gen, modulo: e.target.value, temaId: MODULO_POR_ID[e.target.value as ModuloId].temas[0].id })}>
                  {TEMARIO.filter((m) => m.id !== "M9_COMPORTAMENTALES").map((m) => <option key={m.id} value={m.id}>M{m.numero} · {m.nombre}</option>)}
                </select>
              </Campo>
              <Campo etiqueta="Tema">
                <select className={inputCls} value={gen.temaId} onChange={(e) => setGen({ ...gen, temaId: e.target.value })}>
                  {modulo.temas.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                </select>
              </Campo>
              <Campo etiqueta="Subtema (opcional)"><input className={inputCls} value={gen.subtema} onChange={(e) => setGen({ ...gen, subtema: e.target.value })} /></Campo>
              <Campo etiqueta="Dificultad">
                <select className={inputCls} value={gen.dificultad} onChange={(e) => setGen({ ...gen, dificultad: Number(e.target.value) })}>
                  {[1, 2, 3, 4, 5].map((d) => <option key={d} value={d}>{ETIQUETA_DIFICULTAD[d]}</option>)}
                </select>
              </Campo>
              <Campo etiqueta="Tipo">
                <select className={inputCls} value={gen.tipo} onChange={(e) => setGen({ ...gen, tipo: e.target.value })}>
                  {["conceptual", "normativa", "interpretacion", "escenario", "resolucion_problemas", "decision_tecnica", "asesoria_institucional", "caso_ciberseguridad"].map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
                </select>
              </Campo>
              <Campo etiqueta="Cantidad (máx. 5)"><input type="number" min={1} max={5} className={inputCls} value={gen.cantidad} onChange={(e) => setGen({ ...gen, cantidad: Math.min(5, Math.max(1, Number(e.target.value))) })} /></Campo>
              <div className="md:col-span-3"><Campo etiqueta="Escenario (opcional)"><input className={inputCls} placeholder="Ej.: interrupción del sistema misional en una procuraduría regional" value={gen.escenario} onChange={(e) => setGen({ ...gen, escenario: e.target.value })} /></Campo></div>
            </div>
            <Boton className="mt-4" onClick={generar} disabled={!!sinIA || cargando}>{cargando ? "Recuperando fuentes y generando…" : "Generar borradores"}</Boton>
          </Card>
          {descartadas.length > 0 && <div className="mt-4"><Aviso tono="warn">Se descartaron {descartadas.length} preguntas por no cumplir las validaciones: {descartadas.join("; ")}.</Aviso></div>}
          {borradores.length > 0 && (
            <Card className="mt-4" titulo={`${borradores.length} borradores generados`} accion={<Boton onClick={async () => { await guardarPreguntas(borradores); setBorradores([]); }}>Enviar a revisión</Boton>}>
              <ul className="space-y-4">
                {borradores.map((p) => (
                  <li key={p.id} className="rounded-lg border border-slate-200 p-4 text-sm">
                    <Badge tono="warn">Borrador IA</Badge>
                    <p className="mt-2 text-navy-900">{p.enunciado}</p>
                    <ul className="mt-2 space-y-1">{p.opciones.map((o) => <li key={o.id} className={cx(o.id === p.correcta && "font-medium text-ok-700")}>{o.id}. {o.texto}</li>)}</ul>
                    <p className="mt-2 text-slate-600">{p.explicacion}</p>
                    <p className="mt-1 text-xs text-slate-500">Fuente: {FUENTE_POR_ID[p.fuenteId]?.titulo}{p.referencia ? ` · ${p.referencia}` : ""}{p.esInferencia ? " · Inferencia" : ""}</p>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </>
      )}
    </>
  );
}

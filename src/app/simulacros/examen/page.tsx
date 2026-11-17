"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bookmark, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useStore } from "@/components/store";
import { Badge, Boton, Vacio, cx } from "@/components/ui";
import { alternarMarca, responder, sumarTiempo } from "@/lib/domain/exam";
import { nombreModulo } from "@/lib/content/temario";

export default function Examen() {
  const { estado, enCurso, actualizarEnCurso, finalizarSimulacro } = useStore();
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const [confirmar, setConfirmar] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [ahora, setAhora] = useState(() => Date.now());
  const marcaTiempo = useRef(Date.now());
  const intentoRef = useRef(enCurso);
  intentoRef.current = enCurso;

  const porId = useMemo(() => new Map((estado?.preguntas ?? []).map((p) => [p.id, p])), [estado?.preguntas]);
  const fin = enCurso ? new Date(enCurso.inicio).getTime() + enCurso.config.duracionMin * 60_000 : 0;
  const restante = Math.max(0, Math.floor((fin - ahora) / 1000));

  // Acumula el tiempo en la pregunta visible antes de cambiar o finalizar.
  const registrarTiempo = useCallback(() => {
    const i = intentoRef.current;
    if (!i) return;
    const seg = Math.round((Date.now() - marcaTiempo.current) / 1000);
    marcaTiempo.current = Date.now();
    const id = i.orden[idx]?.preguntaId;
    if (id && seg > 0) actualizarEnCurso(sumarTiempo(i, id, seg));
  }, [idx, actualizarEnCurso]);

  const terminar = useCallback(async () => {
    if (enviando) return;
    setEnviando(true);
    registrarTiempo();
    const r = await finalizarSimulacro().catch(() => null);
    if (r) router.replace(`/simulacros/resultado/${r.id}`);
    else setEnviando(false);
  }, [enviando, registrarTiempo, finalizarSimulacro, router]);

  useEffect(() => {
    const t = setInterval(() => setAhora(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (enCurso && restante === 0 && !enviando) terminar();
  }, [restante, enCurso, enviando, terminar]);

  useEffect(() => {
    const avisar = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", avisar);
    return () => window.removeEventListener("beforeunload", avisar);
  }, []);

  if (!enCurso)
    return (
      <div className="mx-auto max-w-xl pt-16">
        <Vacio titulo="No hay un simulacro en curso" accion={<Boton onClick={() => router.push("/simulacros")}>Configurar simulacro</Boton>} />
      </div>
    );

  const item = enCurso.orden[idx];
  const p = porId.get(item.preguntaId);
  const resp = enCurso.respuestas.find((r) => r.preguntaId === item.preguntaId)!;
  const respondidas = enCurso.respuestas.filter((r) => r.seleccion !== null).length;
  const marcadas = enCurso.respuestas.filter((r) => r.marcada).length;
  const ir = (n: number) => {
    registrarTiempo();
    setIdx(Math.max(0, Math.min(enCurso.orden.length - 1, n)));
  };
  const mm = String(Math.floor(restante / 60)).padStart(2, "0");
  const ss = String(restante % 60).padStart(2, "0");

  return (
    <div className="mx-auto max-w-5xl">
      <div className="sticky top-0 z-20 -mx-4 mb-4 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Simulacro · modo examen</p>
          <p className="text-sm font-medium text-navy-900">Pregunta {idx + 1} de {enCurso.orden.length} · {respondidas} respondidas{marcadas ? ` · ${marcadas} marcadas` : ""}</p>
        </div>
        <div className={cx("flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-lg tabular-nums", restante < 300 ? "bg-bad-50 text-bad-700" : "bg-navy-50 text-navy-800")} aria-live="polite" aria-label="Tiempo restante">
          <Clock className="h-4 w-4" /> {mm}:{ss}
        </div>
        <Boton variante="secundario" onClick={() => setConfirmar(true)} disabled={enviando}>Finalizar</Boton>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_15rem]">
        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {p ? (
            <>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge tono="azul">{nombreModulo(p.modulo)}</Badge>
                {(p.estado === "pendiente_revision" || p.estado === "borrador_ia") && <Badge tono="warn">Experimental</Badge>}
              </div>
              <h2 className="text-base leading-relaxed text-navy-900">{p.enunciado}</h2>
              <fieldset className="mt-5 space-y-2">
                <legend className="sr-only">Opciones de respuesta</legend>
                {item.opciones.map((oid, k) => {
                  const o = p.opciones.find((x) => x.id === oid)!;
                  const sel = resp.seleccion === oid;
                  return (
                    <label key={oid} className={cx("flex cursor-pointer gap-3 rounded-lg border p-3 text-sm transition", sel ? "border-navy-800 bg-navy-50" : "border-slate-200 hover:bg-slate-50")}>
                      <input
                        type="radio"
                        name={`p-${p.id}`}
                        className="mt-0.5"
                        checked={sel}
                        onChange={() => actualizarEnCurso(responder(enCurso, p.id, oid))}
                      />
                      <span className="font-semibold text-navy-700">{String.fromCharCode(65 + k)}.</span>
                      <span>{o.texto}</span>
                    </label>
                  );
                })}
              </fieldset>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
                <div className="flex gap-2">
                  <Boton variante="secundario" onClick={() => ir(idx - 1)} disabled={idx === 0}><ChevronLeft className="h-4 w-4" />Anterior</Boton>
                  <Boton variante="secundario" onClick={() => ir(idx + 1)} disabled={idx === enCurso.orden.length - 1}>Siguiente<ChevronRight className="h-4 w-4" /></Boton>
                </div>
                <div className="flex gap-2">
                  {resp.seleccion && <Boton variante="fantasma" onClick={() => actualizarEnCurso(responder(enCurso, p.id, null))}>Borrar respuesta</Boton>}
                  <Boton variante={resp.marcada ? "primario" : "secundario"} onClick={() => actualizarEnCurso(alternarMarca(enCurso, p.id))}>
                    <Bookmark className="h-4 w-4" />{resp.marcada ? "Marcada" : "Marcar para revisar"}
                  </Boton>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-bad-700">La pregunta {item.preguntaId} ya no existe en el banco.</p>
          )}
        </article>

        <aside className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-3 text-xs font-medium uppercase text-slate-500">Navegación</p>
          <div className="grid grid-cols-6 gap-1.5 lg:grid-cols-5">
            {enCurso.orden.map((o, n) => {
              const r = enCurso.respuestas.find((x) => x.preguntaId === o.preguntaId)!;
              return (
                <button
                  key={o.preguntaId}
                  onClick={() => ir(n)}
                  aria-label={`Pregunta ${n + 1}${r.seleccion ? ", respondida" : ""}${r.marcada ? ", marcada" : ""}`}
                  className={cx(
                    "relative h-9 rounded-md border text-xs font-medium tabular-nums",
                    n === idx ? "border-navy-800 ring-1 ring-navy-800" : "border-slate-200",
                    r.seleccion ? "bg-navy-800 text-white" : "bg-white text-navy-800"
                  )}
                >
                  {n + 1}
                  {r.marcada && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-warn-500" />}
                </button>
              );
            })}
          </div>
          <div className="mt-4 space-y-1 text-xs text-slate-500">
            <p><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-navy-800 align-middle" />Respondida</p>
            <p><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-warn-500 align-middle" />Marcada para revisar</p>
          </div>
        </aside>
      </div>

      {confirmar && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="alertdialog" aria-modal="true" aria-labelledby="conf-t">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 id="conf-t" className="text-lg font-semibold text-navy-900">¿Finalizar el simulacro?</h3>
            <p className="mt-2 text-sm text-slate-600">
              Respondió {respondidas} de {enCurso.orden.length} preguntas{marcadas ? ` y tiene ${marcadas} marcadas para revisar` : ""}. Después de finalizar no podrá modificar las respuestas.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Boton variante="secundario" onClick={() => setConfirmar(false)}>Seguir respondiendo</Boton>
              <Boton onClick={terminar} disabled={enviando}>{enviando ? "Calificando…" : "Finalizar y calificar"}</Boton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

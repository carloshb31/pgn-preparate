"use client";

import { useMemo, useState } from "react";
import { useDerivados, useStore } from "@/components/store";
import { Aviso, Badge, Barra, Boton, Card, Campo, PageHeader, cx, inputCls } from "@/components/ui";
import { TarjetaPractica } from "@/components/tarjeta-practica";
import { calcularPonderado } from "@/lib/domain/scoring";
import { pendientesHoy } from "@/lib/domain/srs";
import { TEMARIO } from "@/lib/content/temario";
import { hoyISO } from "@/lib/domain/util";

function Deslizador({ etiqueta, valor, onChange, deshabilitado }: { etiqueta: string; valor: number; onChange: (n: number) => void; deshabilitado?: boolean }) {
  return (
    <label className={cx("block", deshabilitado && "opacity-50")}>
      <div className="flex justify-between text-sm"><span className="font-medium text-navy-800">{etiqueta}</span><span className="tabular-nums">{valor}</span></div>
      <input type="range" min={0} max={100} value={valor} disabled={deshabilitado} onChange={(e) => onChange(Number(e.target.value))} className="w-full" />
    </label>
  );
}

export default function Progreso() {
  const { estado, guardarAjustes } = useStore();
  const d = useDerivados();
  const [k, setK] = useState(80);
  const [c, setC] = useState(70);
  const [a, setA] = useState(50);
  const [antPendiente, setAntPendiente] = useState(true);
  const [antOficial, setAntOficial] = useState<string>(estado?.ajustes.antecedentesOficial?.toString() ?? "");

  const hoy = hoyISO();
  const pend = useMemo(() => (estado ? pendientesHoy(estado.repasos, hoy) : []), [estado, hoy]);
  if (!estado || !d) return null;
  const P = estado.ajustes.ponderaciones;
  const antecedentes = estado.ajustes.antecedentesOficial ?? (antPendiente ? null : a);
  const r = calcularPonderado({ conocimientos: k, comportamentales: c, antecedentes }, P);

  const sims = d.finalizados.filter((i) => !i.config.practica && i.puntaje !== null).sort((x, y) => (y.fin ?? "").localeCompare(x.fin ?? ""));
  const prom3 = sims.length ? Math.round(sims.slice(0, 3).reduce((s, i) => s + (i.puntaje ?? 0), 0) / Math.min(3, sims.length)) : null;
  const ultimaComp = estado.comportamentales.at(-1)?.total ?? null;
  const porId = new Map(estado.preguntas.map((p) => [p.id, p]));

  return (
    <>
      <PageHeader titulo="Mi progreso" descripcion="Calculadora de ponderación oficial, dominio del temario y repaso espaciado." />

      <Card titulo="Calculadora de escenarios · Puntaje final ponderado">
        <p className="mb-4 text-xs text-slate-500">
          Puntaje final = Conocimientos × {P.conocimientos} + Comportamentales × {P.comportamentales} + Antecedentes × {P.antecedentes}. Conocimientos es eliminatoria (mínimo {P.minimoConocimientos}); para integrar la lista de elegibles se requiere {P.minimoElegibles} o más.
        </p>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <Deslizador etiqueta="Conocimientos (70 %)" valor={k} onChange={setK} />
            <div className="flex flex-wrap gap-2 text-xs">
              {sims[0] && <button className="rounded bg-slate-100 px-2 py-1" onClick={() => setK(Math.round(sims[0].puntaje!))}>Último simulacro: {sims[0].puntaje}</button>}
              {prom3 !== null && <button className="rounded bg-slate-100 px-2 py-1" onClick={() => setK(prom3)}>Promedio últimos 3: {prom3}</button>}
            </div>
            <Deslizador etiqueta="Competencias comportamentales (20 %)" valor={c} onChange={setC} />
            {ultimaComp !== null && <button className="rounded bg-slate-100 px-2 py-1 text-xs" onClick={() => setC(Math.round(ultimaComp))}>Última práctica situacional: {ultimaComp}</button>}
            <div className="rounded-lg border border-slate-200 p-3">
              {estado.ajustes.antecedentesOficial !== null ? (
                <p className="text-sm">Antecedentes (10 %): <strong>{estado.ajustes.antecedentesOficial}</strong> <Badge tono="ok">registrado por usted como oficial</Badge></p>
              ) : (
                <>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={antPendiente} onChange={(e) => setAntPendiente(e.target.checked)} />
                    Antecedentes pendientes (no hay calificación oficial)
                  </label>
                  <div className="mt-3"><Deslizador etiqueta="Antecedentes (10 %) · escenario hipotético" valor={a} onChange={setA} deshabilitado={antPendiente} /></div>
                </>
              )}
              <div className="mt-3 flex items-end gap-2">
                <Campo etiqueta="Registrar puntaje oficial de antecedentes" ayuda="Solo cuando la entidad lo publique.">
                  <input className={inputCls} type="number" min={0} max={100} step={0.01} value={antOficial} onChange={(e) => setAntOficial(e.target.value)} />
                </Campo>
                <Boton variante="secundario" onClick={() => guardarAjustes({ ...estado.ajustes, antecedentesOficial: antOficial === "" ? null : Math.max(0, Math.min(100, Number(antOficial))) })}>Guardar</Boton>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3 text-center">
              {([["Conocimientos", r.aportes.conocimientos], ["Comportamentales", r.aportes.comportamentales], ["Antecedentes", r.aportes.antecedentes]] as const).map(([t, v]) => (
                <div key={t} className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">{t}</p><p className="text-lg font-semibold tabular-nums">{v ?? "pend."}</p></div>
              ))}
            </div>
            <div className="rounded-xl bg-navy-900 p-5 text-white">
              <p className="text-xs uppercase tracking-wide text-navy-100">{r.final !== null ? "Puntaje final estimado" : "Puntaje parcial (falta antecedentes)"}</p>
              <p className="mt-1 text-4xl font-semibold tabular-nums">{r.final ?? r.parcial}</p>
              {r.necesarioEnPendiente && (
                <p className="mt-2 text-sm text-navy-100">Para llegar a {P.minimoElegibles} necesitaría al menos <strong className="text-white">{r.necesarioEnPendiente.valor > 100 ? "más de 100 (no alcanzable)" : r.necesarioEnPendiente.valor}</strong> en antecedentes.</p>
              )}
            </div>
            <Aviso tono={r.superaMinimoConocimientos ? "ok" : "bad"}>{r.superaMinimoConocimientos ? `Supera el mínimo eliminatorio de conocimientos (${P.minimoConocimientos}).` : `No supera el mínimo eliminatorio de conocimientos (${P.minimoConocimientos}): no continuaría en el concurso.`}</Aviso>
            {r.integraListaElegibles !== null && (
              <Aviso tono={r.integraListaElegibles ? "ok" : "bad"}>{r.integraListaElegibles ? `Integraría la lista de elegibles (≥ ${P.minimoElegibles}).` : `No alcanzaría el mínimo de ${P.minimoElegibles} para la lista de elegibles.`}</Aviso>
            )}
            <p className="text-xs text-slate-500">Esta calculadora es una herramienta de escenarios. No predice resultados oficiales: las pruebas escritas se califican con puntaje estándar (Res. 076, art. 18) y antecedentes solo se aplica a quien supera conocimientos (art. 27), con factores de 40 educación formal, 20 ETDH y 40 experiencia para el nivel asesor (art. 28).</p>
          </div>
        </div>
      </Card>

      <Card className="mt-4" titulo="Dominio por módulo y cobertura del temario">
        <div className="grid gap-4 md:grid-cols-2">
          {TEMARIO.filter((m) => m.id !== "M9_COMPORTAMENTALES").map((m) => {
            const dom = d.dominio[m.id];
            const temasCubiertos = m.temas.filter((t) => d.regs.filter((x) => x.temaId === t.id).length >= 3).length;
            return (
              <div key={m.id} className="rounded-lg border border-slate-200 p-3">
                <div className="flex justify-between text-sm"><span className="font-medium text-navy-900">M{m.numero} · {m.nombre}</span>{dom.dominio === null ? <Badge>{dom.respuestas}/5 resp.</Badge> : <Badge tono={dom.dominio >= 80 ? "ok" : dom.dominio >= 65 ? "warn" : "bad"}>{dom.dominio}</Badge>}</div>
                <Barra valor={dom.dominio ?? 0} tono={(dom.dominio ?? 0) >= 80 ? "ok" : (dom.dominio ?? 0) >= 65 ? "warn" : "bad"} />
                <p className="mt-1 text-xs text-slate-500">Temas con práctica suficiente: {temasCubiertos} de {m.temas.length}</p>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="mt-4" titulo={`Repaso espaciado · ${pend.length} pendientes hoy`}>
        <div id="repaso" />
        {pend.length === 0 ? (
          <p className="text-sm text-slate-600">No tiene repasos pendientes. Las preguntas que responda entran a la cola según el algoritmo SM-2: un error vuelve al día siguiente; los aciertos amplían el intervalo.</p>
        ) : (
          <ul className="space-y-4">
            {pend.slice(0, 10).map((e) => {
              const p = porId.get(e.preguntaId);
              if (!p) return null;
              return (
                <li key={e.preguntaId} className="rounded-lg border border-slate-200 p-4">
                  <p className="text-xs text-slate-500">{p.id} · intervalo {e.intervaloDias} d · facilidad {e.facilidad}</p>
                  <p className="mt-1 text-sm text-navy-900">{p.enunciado}</p>
                  <TarjetaPractica p={p} />
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </>
  );
}

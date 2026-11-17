"use client";

import { useState } from "react";
import { useStore } from "@/components/store";
import { Aviso, Badge, Barra, Boton, Card, PageHeader, cx } from "@/components/ui";
import { COMPETENCIAS_OFICIALES } from "@/lib/config/convocatoria";
import { CASOS_SJT, calificarSJT } from "@/lib/content/competencias";
import { formatoFecha, uid } from "@/lib/domain/util";

const nombreComp = (id: string) => COMPETENCIAS_OFICIALES.find((c) => c.id === id)?.nombre ?? id;

export default function Competencias() {
  const { estado, guardarComportamental } = useStore();
  const [resp, setResp] = useState<Record<string, string>>({});
  const [enviado, setEnviado] = useState(false);
  if (!estado) return null;

  const completo = CASOS_SJT.every((c) => resp[c.id]);
  const resultado = enviado ? calificarSJT(resp) : null;

  async function calificar() {
    const r = calificarSJT(resp);
    await guardarComportamental({ id: uid("cmp"), fecha: new Date().toISOString(), porCompetencia: r.porCompetencia, total: r.total });
    setEnviado(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <PageHeader titulo="Competencias comportamentales" descripcion="Siete competencias oficiales de la convocatoria. Practique con casos situacionales: cada opción refleja comportamientos con distinto grado de ajuste a la competencia." />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card titulo="Competencias evaluadas (sección 6 del formato)">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-slate-500"><tr><th className="py-1">Competencia</th><th>Grupo</th><th className="text-right">Nivel</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {COMPETENCIAS_OFICIALES.map((c) => (
                <tr key={c.id}><td className="py-1.5">{c.nombre}</td><td className="text-slate-600">{c.grupo}</td><td className="text-right"><Badge tono="azul">{c.nivel}</Badge></td></tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-slate-500">El formato remite al Diccionario de Competencias Comportamentales publicado por la entidad. Cárguelo en la Biblioteca para estudiar las conductas asociadas a cada nivel.</p>
        </Card>
        <Card titulo="Historial de práctica">
          {estado.comportamentales.length ? (
            <ul className="space-y-2 text-sm">
              {[...estado.comportamentales].reverse().slice(0, 6).map((r) => (
                <li key={r.id} className="flex justify-between"><span>{formatoFecha(r.fecha)}</span><span className="font-medium tabular-nums">{r.total}</span></li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-600">Aún no ha completado la práctica situacional.</p>
          )}
        </Card>
      </div>

      <div className="mt-4">
        <Aviso tono="warn">
          Estos casos y su puntuación son material de práctica pendiente de revisión. La prueba oficial es clasificatoria (20 %) y su metodología la define la entidad; este puntaje no la predice.
        </Aviso>
      </div>

      {resultado && (
        <Card className="mt-4" titulo={`Resultado de práctica: ${resultado.total} / 100`}>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(resultado.porCompetencia).map(([c, v]) => {
              const p = Math.round((v.obtenido / v.maximo) * 100);
              return (
                <div key={c} className="text-sm">
                  <div className="flex justify-between"><span>{nombreComp(c)}</span><span className="tabular-nums">{p} %</span></div>
                  <Barra valor={p} tono={p >= 80 ? "ok" : p >= 60 ? "warn" : "bad"} />
                </div>
              );
            })}
          </div>
          <Boton variante="secundario" className="mt-4" onClick={() => { setResp({}); setEnviado(false); }}>Repetir práctica</Boton>
        </Card>
      )}

      <div className="mt-4 space-y-4">
        {CASOS_SJT.map((c, n) => (
          <Card key={c.id} titulo={`Caso ${n + 1}. ${c.titulo}`} accion={<div className="flex flex-wrap justify-end gap-1">{c.competencias.map((x) => <Badge key={x}>{nombreComp(x)}</Badge>)}</div>}>
            <p className="text-sm text-navy-900">{c.situacion}</p>
            <p className="mt-3 text-xs font-medium uppercase text-slate-500">¿Qué haría usted?</p>
            <div className="mt-2 space-y-2">
              {c.opciones.map((o) => {
                const elegido = resp[c.id] === o.id;
                const total = c.competencias.reduce((s, k) => s + (o.puntos[k] ?? 0), 0);
                const max = c.competencias.length * 3;
                return (
                  <label key={o.id} className={cx("block rounded-lg border p-3 text-sm", elegido ? "border-navy-800 bg-navy-50" : "border-slate-200", !enviado && "cursor-pointer hover:bg-slate-50")}>
                    <span className="flex gap-3">
                      <input type="radio" name={c.id} disabled={enviado} checked={elegido} onChange={() => setResp({ ...resp, [c.id]: o.id })} className="mt-0.5" />
                      <span className="flex-1">{o.texto}</span>
                      {enviado && <Badge tono={total / max >= 0.8 ? "ok" : total / max >= 0.5 ? "warn" : "bad"}>{total}/{max}</Badge>}
                    </span>
                    {enviado && <span className="mt-2 block pl-7 text-xs text-slate-600">{o.retro}</span>}
                  </label>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      {!enviado && (
        <div className="sticky bottom-20 mt-4 flex justify-end lg:bottom-4">
          <Boton onClick={calificar} disabled={!completo}>{completo ? "Calificar práctica" : `Responda los ${CASOS_SJT.length} casos`}</Boton>
        </div>
      )}
    </>
  );
}

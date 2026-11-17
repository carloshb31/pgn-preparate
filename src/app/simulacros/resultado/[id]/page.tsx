"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { CheckCircle2, Printer, XCircle, MinusCircle } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useStore } from "@/components/store";
import { Aviso, Badge, Boton, Card, ETIQUETA_DIFICULTAD, PageHeader, Stat, Vacio, cx, tonoPuntaje } from "@/components/ui";
import { informe, MODALIDADES } from "@/lib/domain/exam";
import { nombreCorto, nombreModulo, temaPorId } from "@/lib/content/temario";
import { FUENTE_POR_ID } from "@/lib/content/fuentes";
import { formatoDuracion, formatoFecha } from "@/lib/domain/util";
import { PUEDE_IMPRIMIR } from "@/lib/plataforma";

type Filtro = "todas" | "incorrectas" | "sin" | "marcadas";

export default function Resultado() {
  const { id } = useParams<{ id: string }>();
  const { estado } = useStore();
  const [filtro, setFiltro] = useState<Filtro>("incorrectas");
  const intento = estado?.intentos.find((i) => i.id === id);
  const inf = useMemo(() => (intento && estado ? informe(intento, estado.preguntas) : null), [intento, estado]);
  if (!estado) return null;
  if (!intento || !inf) return <Vacio titulo="No se encontró el intento" accion={<Link href="/simulacros"><Boton>Volver</Boton></Link>} />;

  const porId = new Map(estado.preguntas.map((p) => [p.id, p]));
  const minimo = estado.ajustes.ponderaciones.minimoConocimientos;
  const filas = intento.orden
    .map((o, n) => ({ n, o, r: intento.respuestas.find((x) => x.preguntaId === o.preguntaId)!, p: porId.get(o.preguntaId) }))
    .filter(({ r }) => (filtro === "todas" ? true : filtro === "incorrectas" ? r.seleccion !== null && !r.correcta : filtro === "sin" ? r.seleccion === null : r.marcada));
  const experimentales = intento.respuestas.filter((r) => ["pendiente_revision", "borrador_ia"].includes(porId.get(r.preguntaId)?.estado ?? "")).length;

  return (
    <>
      <PageHeader
        titulo={`Resultado: ${MODALIDADES[intento.config.modalidad].titulo}`}
        descripcion={`${formatoFecha(intento.fin ?? intento.inicio, { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })} · ${intento.respuestas.length} preguntas · ${intento.config.duracionMin} min`}
        acciones={
          <>
            {PUEDE_IMPRIMIR && <Boton variante="secundario" onClick={() => window.print()}><Printer className="h-4 w-4" />Descargar PDF</Boton>}
            <Link href="/simulacros"><Boton>Nuevo simulacro</Boton></Link>
          </>
        }
      />
      <div className="mb-4">
        <Aviso tono="azul">El puntaje del simulacro es su porcentaje de aciertos. En la prueba oficial, la Resolución 076 (art. 18) establece una calificación normal estándar de 0 a 100 obtenida estadísticamente, por lo que no son directamente equivalentes.</Aviso>
      </div>
      {experimentales > 0 && (
        <div className="mb-4">
          <Aviso tono="warn">{experimentales} de {intento.respuestas.length} preguntas son material experimental pendiente de validación. Tome el puntaje como referencia de práctica.</Aviso>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Stat etiqueta="Puntaje" valor={intento.puntaje} tono={tonoPuntaje(intento.puntaje, minimo)} detalle={(intento.puntaje ?? 0) >= minimo ? `Supera el mínimo de ${minimo}` : `Por debajo del mínimo de ${minimo}`} />
        <Stat etiqueta="Correctas" valor={inf.correctas} tono="ok" />
        <Stat etiqueta="Incorrectas" valor={inf.incorrectas} tono="bad" />
        <Stat etiqueta="Sin responder" valor={inf.sinResponder} tono={inf.sinResponder ? "warn" : "neutro"} />
        <Stat etiqueta="Tiempo usado" valor={formatoDuracion(inf.segundosTotales)} />
        <Stat etiqueta="Promedio por pregunta" valor={`${inf.segundosPromedio} s`} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card titulo="Rendimiento por módulo" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={inf.porModulo.map((m) => ({ modulo: nombreCorto(m.modulo), nombre: nombreModulo(m.modulo), pct: m.pct, detalle: `${m.correctas}/${m.total}` }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="modulo" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
                <Tooltip formatter={(v: number, _n, item) => [`${v} % (${item.payload.detalle})`, item.payload.nombre]} />
                <Bar dataKey="pct" fill="#2f6bc4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card titulo="Por dificultad">
          <ul className="space-y-2 text-sm">
            {inf.porDificultad.map((d) => (
              <li key={d.dificultad} className="flex justify-between"><span>{ETIQUETA_DIFICULTAD[d.dificultad]}</span><span className="tabular-nums">{d.correctas}/{d.total} · {d.pct} %</span></li>
            ))}
          </ul>
          <h3 className="mt-5 text-sm font-semibold text-navy-800">Conceptos para repasar</h3>
          {inf.temasARepasar.length ? (
            <ul className="mt-2 space-y-1 text-sm">
              {inf.temasARepasar.slice(0, 8).map((t) => (
                <li key={t.tema} className="flex justify-between gap-2"><span>{t.tema}</span><Badge tono="bad">{t.errores}</Badge></li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-600">Sin errores en este intento.</p>
          )}
        </Card>
      </div>

      <Card className="mt-4" titulo="Revisión de preguntas" accion={
        <div className="no-print flex flex-wrap gap-1">
          {([["incorrectas", "Incorrectas"], ["sin", "Sin responder"], ["marcadas", "Marcadas"], ["todas", "Todas"]] as [Filtro, string][]).map(([k, t]) => (
            <button key={k} onClick={() => setFiltro(k)} className={cx("rounded-md px-2.5 py-1 text-xs", filtro === k ? "bg-navy-800 text-white" : "bg-slate-100 text-slate-700")}>{t}</button>
          ))}
        </div>
      }>
        {filas.length === 0 && <p className="text-sm text-slate-600">No hay preguntas en este filtro.</p>}
        <ol className="space-y-6">
          {filas.map(({ n, o, r, p }) => {
            if (!p) return null;
            const fuente = FUENTE_POR_ID[p.fuenteId];
            const tema = temaPorId(p.temaId);
            return (
              <li key={p.id} className="border-b border-slate-100 pb-6 last:border-0">
                <div className="flex items-start gap-2">
                  {r.seleccion === null ? <MinusCircle className="mt-0.5 h-5 w-5 shrink-0 text-warn-500" /> : r.correcta ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-ok-500" /> : <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-bad-500" />}
                  <div className="flex-1">
                    <p className="text-xs text-slate-500">Pregunta {n + 1} · {nombreModulo(p.modulo)} · {tema?.tema.nombre} · {ETIQUETA_DIFICULTAD[p.dificultad]} · {p.id}</p>
                    <p className="mt-1 text-navy-900">{p.enunciado}</p>
                    <ul className="mt-3 space-y-2">
                      {o.opciones.map((oid, k) => {
                        const op = p.opciones.find((x) => x.id === oid)!;
                        const esCorrecta = oid === p.correcta;
                        const elegida = oid === r.seleccion;
                        return (
                          <li key={oid} className={cx("rounded-lg border p-3 text-sm", esCorrecta ? "border-ok-500/40 bg-ok-50" : elegida ? "border-bad-500/40 bg-bad-50" : "border-slate-200")}>
                            <p>
                              <span className="font-semibold">{String.fromCharCode(65 + k)}.</span> {op.texto}
                              {esCorrecta && <Badge tono="ok" className="ml-2">Correcta</Badge>}
                              {elegida && !esCorrecta && <Badge tono="bad" className="ml-2">Su respuesta</Badge>}
                            </p>
                            <p className="mt-1 text-xs text-slate-600">{op.justificacion}</p>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm">
                      <p className="font-medium text-navy-800">Explicación</p>
                      <p className="mt-1 text-slate-700">{p.explicacion}</p>
                      <p className="mt-2 text-xs text-slate-500">
                        Fuente: {fuente?.url ? <a href={fuente.url} target="_blank" rel="noreferrer" className="text-azul-600 hover:underline">{fuente.titulo}</a> : fuente?.titulo}
                        {p.referencia ? ` · ${p.referencia}` : ""}
                        {p.esInferencia ? " · Inferencia académica (no es disposición literal)" : ""}
                        {fuente && !fuente.fechaVerificacion ? " · Fuente pendiente de verificación" : ""}
                      </p>
                      {!r.correcta && <p className="mt-2 text-xs text-navy-700">Recomendación: repase «{tema?.tema.nombre}»{p.subtema ? ` (${p.subtema})` : ""}. La pregunta entró a su cola de repaso espaciado.</p>}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </Card>
    </>
  );
}

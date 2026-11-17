"use client";

import Link from "next/link";
import { useMemo } from "react";
import { CalendarClock, CheckCircle2, Circle } from "lucide-react";
import { useDerivados, useStore } from "@/components/store";
import { Aviso, Badge, Barra, Boton, Card, PageHeader, Stat, Vacio, cx, tonoPuntaje } from "@/components/ui";
import { CONVOCATORIA, CRONOGRAMA_OFICIAL, PARAMETROS_PRUEBA_OFICIAL } from "@/lib/config/convocatoria";
import { TEMARIO, nombreCorto } from "@/lib/content/temario";
import { avancePlan } from "@/lib/domain/planner";
import { pendientesHoy } from "@/lib/domain/srs";
import { diaSemana, formatoFecha, formatoPesos, hoyISO, pct, sumarDias } from "@/lib/domain/util";

export default function Inicio() {
  const { estado } = useStore();
  const d = useDerivados();
  const hoy = hoyISO();

  const semana = useMemo(() => {
    const lunes = sumarDias(hoy, 1 - diaSemana(hoy));
    return Array.from({ length: 7 }, (_, i) => {
      const fecha = sumarDias(lunes, i);
      const acts = estado?.actividades.filter((a) => a.fecha === fecha) ?? [];
      return { fecha, acts, minutos: acts.reduce((s, a) => s + a.minutos, 0), hechas: acts.filter((a) => a.completada).length };
    });
  }, [estado?.actividades, hoy]);

  if (!estado || !d) return null;
  const respondidas = d.regs.filter((r) => r.respondida).length;
  const aciertos = d.regs.filter((r) => r.correcta).length;
  const simulacros = d.finalizados.filter((i) => !i.config.practica);
  const mejor = simulacros.reduce<number | null>((m, i) => (i.puntaje !== null && (m === null || i.puntaje > m) ? i.puntaje : m), null);
  const ultimo = [...simulacros].sort((a, b) => (b.fin ?? "").localeCompare(a.fin ?? ""))[0];
  const avance = avancePlan(estado.actividades, hoy);
  const proximas = estado.actividades.filter((a) => !a.completada && a.fecha >= hoy).slice(0, 6);
  const repasos = pendientesHoy(estado.repasos, hoy).length;
  const proximoHito = CRONOGRAMA_OFICIAL.find((c) => (c.fin ?? c.inicio) >= hoy);
  const dominados = TEMARIO.filter((m) => (d.dominio[m.id]?.dominio ?? 0) >= 80);
  const pendientes = TEMARIO.filter((m) => (d.dominio[m.id]?.dominio ?? 0) < 80);

  return (
    <>
      <PageHeader
        titulo="Panel de preparación"
        descripcion={
          <>
            {CONVOCATORIA.denominacion} {CONVOCATORIA.codigoGrado} · {CONVOCATORIA.dependencia} · {CONVOCATORIA.vacantes} vacantes · Asignación básica{" "}
            {formatoPesos(CONVOCATORIA.asignacionBasica)} ({CONVOCATORIA.asignacionVigencia})
          </>
        }
        acciones={
          <>
            <Link href="/simulacros"><Boton>Iniciar simulacro</Boton></Link>
            <Link href="/plan"><Boton variante="secundario">Ver plan</Boton></Link>
          </>
        }
      />

      {!PARAMETROS_PRUEBA_OFICIAL.fechaPrueba && (
        <div className="mb-6">
          <Aviso tono="azul">
            La fecha, el número de preguntas y la duración de la prueba escrita <strong>aún no han sido publicados</strong>. Según la Resolución 076, la prueba de conocimientos tiene un núcleo general y uno específico, y se presenta el mismo día que la de competencias. Los simulacros usan parámetros de práctica configurables.
          </Aviso>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1" titulo="Estado de preparación">
          <div className="flex items-end gap-3">
            <p className={cx("text-5xl font-semibold tabular-nums", { "text-ok-700": d.indice.total >= 85, "text-warn-700": d.indice.total >= 40 && d.indice.total < 85, "text-navy-900": d.indice.total < 40 })}>{d.indice.total}</p>
            <div className="pb-2">
              <p className="text-sm font-medium text-navy-800">{d.indice.nivel}</p>
              <p className="text-xs text-slate-500">Índice 0-100</p>
            </div>
          </div>
          <ul className="mt-4 space-y-3">
            {d.indice.componentes.map((c) => (
              <li key={c.nombre}>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700">{c.nombre} <span className="text-slate-400">({Math.round(c.peso * 100)} %)</span></span>
                  <span className="font-medium tabular-nums">{c.valor}</span>
                </div>
                <Barra valor={c.valor} />
                <p className="mt-0.5 text-[11px] text-slate-500">{c.detalle}</p>
              </li>
            ))}
          </ul>
        </Card>

        <div className="grid grid-cols-2 gap-4 lg:col-span-2 lg:grid-cols-4">
          <Stat etiqueta="Avance del plan" valor={`${avance.pctTotal} %`} detalle={estado.planConfig ? `${avance.hechas} de ${avance.total} actividades` : "Sin plan configurado"} />
          <Stat etiqueta="Preguntas respondidas" valor={respondidas} detalle={`${d.regs.length} presentadas`} />
          <Stat etiqueta="Aciertos" valor={respondidas ? `${pct(aciertos, d.regs.length)} %` : "—"} tono={respondidas ? tonoPuntaje(pct(aciertos, d.regs.length)) : "neutro"} />
          <Stat etiqueta="Simulacros" valor={simulacros.length} />
          <Stat etiqueta="Mejor puntuación" valor={mejor ?? "—"} tono={tonoPuntaje(mejor)} />
          <Stat etiqueta="Último resultado" valor={ultimo?.puntaje ?? "—"} tono={tonoPuntaje(ultimo?.puntaje)} detalle={ultimo ? formatoFecha(ultimo.fin ?? ultimo.inicio) : undefined} />
          <Stat etiqueta="Tiempo de estudio" valor={`${Math.floor(d.minutosEstudio / 60)} h ${d.minutosEstudio % 60} min`} detalle="Simulacros + actividades completadas" />
          <Stat etiqueta="Repasos para hoy" valor={repasos} detalle="Repetición espaciada" tono={repasos ? "warn" : "neutro"} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card titulo="Calendario de esta semana" className="lg:col-span-2" accion={<Link href="/plan" className="text-xs text-azul-600 hover:underline">Plan completo</Link>}>
          {estado.planConfig ? (
            <div className="grid grid-cols-7 gap-2">
              {semana.map((dia) => (
                <div key={dia.fecha} className={cx("rounded-lg border p-2 text-center", dia.fecha === hoy ? "border-azul-500 bg-navy-50" : "border-slate-200")}>
                  <p className="text-[11px] uppercase text-slate-500">{formatoFecha(dia.fecha, { weekday: "short" })}</p>
                  <p className="text-sm font-semibold text-navy-900">{formatoFecha(dia.fecha, { day: "numeric" })}</p>
                  <p className="mt-1 text-[11px] text-slate-600">{dia.minutos ? `${dia.minutos} min` : "—"}</p>
                  {dia.acts.length > 0 && <p className="text-[11px] text-ok-700">{dia.hechas}/{dia.acts.length}</p>}
                </div>
              ))}
            </div>
          ) : (
            <Vacio titulo="Aún no tiene un plan de estudio" accion={<Link href="/plan"><Boton>Configurar plan</Boton></Link>}>
              Indique sus horas disponibles y la fecha del examen cuando se publique.
            </Vacio>
          )}
        </Card>

        <Card titulo="Próximo hito oficial">
          {proximoHito ? (
            <div className="flex gap-3">
              <CalendarClock className="mt-0.5 h-5 w-5 text-azul-600" />
              <div>
                <p className="font-medium text-navy-900">{proximoHito.actividad}</p>
                <p className="text-sm text-slate-600">
                  {formatoFecha(proximoHito.inicio)}
                  {proximoHito.fin ? ` al ${formatoFecha(proximoHito.fin)}` : ""}
                </p>
                <p className="mt-2 text-xs text-slate-500">Fuente: cronograma VRM publicado por la PGN y la Universidad de Antioquia.</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-600">No hay hitos pendientes en el cronograma cargado.</p>
          )}
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card titulo="Próximas actividades">
          {proximas.length ? (
            <ul className="space-y-2">
              {proximas.map((a) => (
                <li key={a.id} className="flex items-start gap-2 text-sm">
                  <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <div>
                    <p className="text-navy-900">{a.titulo}</p>
                    <p className="text-xs text-slate-500">{formatoFecha(a.fecha, { weekday: "long", day: "numeric", month: "short" })} · {a.minutos} min</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-600">Sin actividades pendientes.</p>
          )}
        </Card>
        <Card titulo={`Módulos dominados (${dominados.length})`}>
          {dominados.length ? (
            <ul className="space-y-2">
              {dominados.map((m) => (
                <li key={m.id} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-ok-500" /> {nombreCorto(m.id)} · {m.nombre}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-600">Un módulo se considera dominado con 80 o más de dominio y al menos 5 respuestas.</p>
          )}
        </Card>
        <Card titulo={`Módulos por reforzar (${pendientes.length})`}>
          <ul className="space-y-2">
            {pendientes.map((m) => {
              const v = d.dominio[m.id];
              return (
                <li key={m.id} className="text-sm">
                  <div className="flex justify-between">
                    <span className="truncate pr-2">{nombreCorto(m.id)} · {m.nombre}</span>
                    {v.dominio === null ? <Badge>sin datos</Badge> : <span className="tabular-nums">{v.dominio}</span>}
                  </div>
                  {v.dominio !== null && <Barra valor={v.dominio} tono={v.dominio >= 65 ? "warn" : "bad"} />}
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </>
  );
}

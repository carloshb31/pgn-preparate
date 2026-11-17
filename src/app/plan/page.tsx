"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { useDerivados, useStore } from "@/components/store";
import { Aviso, Badge, Barra, Boton, Card, Campo, PageHeader, Vacio, cx, inputCls } from "@/components/ui";
import { TEMARIO, nombreCorto } from "@/lib/content/temario";
import { HORIZONTE_SIN_FECHA_DIAS, avancePlan, prioridadesPorDefecto } from "@/lib/domain/planner";
import type { ActividadEstudio, ConfigPlan, ModuloId } from "@/lib/domain/types";
import { diaSemana, formatoFecha, hoyISO, sumarDias } from "@/lib/domain/util";

const ETIQUETA_TIPO: Record<ActividadEstudio["tipo"], string> = {
  lectura: "Lectura",
  practica: "Práctica",
  cuestionario: "Cuestionario",
  simulacro_parcial: "Simulacro parcial",
  simulacro_integral: "Simulacro integral",
  repaso: "Repaso"
};

function enlace(a: ActividadEstudio) {
  if (a.tipo === "lectura") return `/biblioteca${a.modulo ? `?modulo=${a.modulo}` : ""}`;
  if (a.tipo === "practica" || a.tipo === "cuestionario") return `/banco${a.modulo ? `?modulo=${a.modulo}` : ""}`;
  if (a.tipo === "repaso") return "/progreso#repaso";
  return "/simulacros";
}

export default function Plan() {
  const { estado, guardarPlan, replanificar, marcarActividad } = useStore();
  const d = useDerivados();
  const hoy = hoyISO();
  const [cfg, setCfg] = useState<ConfigPlan>(
    () =>
      estado?.planConfig ?? {
        fechaExamen: null,
        fechaInicio: hoy,
        horasPorDia: 2,
        diasPorSemana: 6,
        minutosPorSesion: 45,
        nivelInicial: "intermedio",
        prioridades: prioridadesPorDefecto()
      }
  );
  const [editando, setEditando] = useState(!estado?.planConfig);
  const [guardando, setGuardando] = useState(false);
  const [semana, setSemana] = useState(0);

  const lunes = sumarDias(sumarDias(hoy, 1 - diaSemana(hoy)), semana * 7);
  const dias = useMemo(() => Array.from({ length: 7 }, (_, i) => sumarDias(lunes, i)), [lunes]);
  if (!estado || !d) return null;
  const avance = avancePlan(estado.actividades, hoy);
  const set = (p: Partial<ConfigPlan>) => setCfg((c) => ({ ...c, ...p }));

  async function generar() {
    setGuardando(true);
    try {
      await guardarPlan(cfg);
      setEditando(false);
      setSemana(0);
    } finally {
      setGuardando(false);
    }
  }

  const minutosSemana = estado.actividades.filter((a) => dias.includes(a.fecha)).reduce((s, a) => s + a.minutos, 0);

  return (
    <>
      <PageHeader
        titulo="Mi plan de estudio"
        descripcion="Plan diario y semanal que prioriza los módulos de mayor relevancia para el cargo y los de menor dominio. Se reorganiza cuando hay actividades vencidas o resultados bajos."
        acciones={
          estado.planConfig && !editando ? (
            <>
              <Boton variante="secundario" onClick={() => replanificar()}><RefreshCw className="h-4 w-4" />Replanificar</Boton>
              <Boton variante="secundario" onClick={() => setEditando(true)}>Ajustar parámetros</Boton>
            </>
          ) : undefined
        }
      />

      {editando && (
        <Card titulo="Parámetros del plan" className="mb-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Campo etiqueta="Fecha del examen" ayuda="Déjela vacía hasta que la PGN la publique. Sin fecha, el plan cubre un ciclo de práctica de 8 semanas.">
              <input type="date" className={inputCls} value={cfg.fechaExamen ?? ""} min={hoy} onChange={(e) => set({ fechaExamen: e.target.value || null })} />
            </Campo>
            <Campo etiqueta="Inicio del plan">
              <input type="date" className={inputCls} value={cfg.fechaInicio} onChange={(e) => set({ fechaInicio: e.target.value })} />
            </Campo>
            <Campo etiqueta="Nivel inicial de conocimientos">
              <select className={inputCls} value={cfg.nivelInicial} onChange={(e) => set({ nivelInicial: e.target.value as ConfigPlan["nivelInicial"] })}>
                <option value="basico">Básico: empezar por lecturas</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado: más práctica y cuestionarios</option>
              </select>
            </Campo>
            <Campo etiqueta="Horas disponibles por día">
              <input type="number" min={0.5} max={12} step={0.5} className={inputCls} value={cfg.horasPorDia} onChange={(e) => set({ horasPorDia: Number(e.target.value) })} />
            </Campo>
            <Campo etiqueta="Días de estudio por semana">
              <input type="number" min={1} max={7} className={inputCls} value={cfg.diasPorSemana} onChange={(e) => set({ diasPorSemana: Number(e.target.value) })} />
            </Campo>
            <Campo etiqueta="Minutos por sesión">
              <input type="number" min={15} max={180} step={5} className={inputCls} value={cfg.minutosPorSesion} onChange={(e) => set({ minutosPorSesion: Number(e.target.value) })} />
            </Campo>
          </div>
          <h3 className="mt-6 text-sm font-semibold text-navy-800">Prioridad de cada módulo (1 baja · 5 máxima)</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {TEMARIO.map((m) => (
              <label key={m.id} className="flex items-center gap-3 text-sm">
                <span className="w-56 shrink-0 truncate">{nombreCorto(m.id)} · {m.nombre}</span>
                <input type="range" min={1} max={5} value={cfg.prioridades[m.id]} onChange={(e) => set({ prioridades: { ...cfg.prioridades, [m.id]: Number(e.target.value) } as Record<ModuloId, number> })} className="flex-1" />
                <span className="w-4 tabular-nums">{cfg.prioridades[m.id]}</span>
                <span className="w-16 text-right text-xs text-slate-500">{d.dominio[m.id].dominio === null ? "sin datos" : `dom. ${d.dominio[m.id].dominio}`}</span>
              </label>
            ))}
          </div>
          <div className="mt-6 flex justify-end gap-2">
            {estado.planConfig && <Boton variante="secundario" onClick={() => setEditando(false)}>Cancelar</Boton>}
            <Boton onClick={generar} disabled={guardando}>{guardando ? "Generando…" : estado.planConfig ? "Regenerar plan" : "Generar plan"}</Boton>
          </div>
          {estado.planConfig && <p className="mt-2 text-right text-xs text-slate-500">Las actividades completadas se conservan.</p>}
        </Card>
      )}

      {!estado.planConfig ? (
        !editando && <Vacio titulo="Sin plan de estudio" accion={<Boton onClick={() => setEditando(true)}>Configurar</Boton>} />
      ) : (
        <>
          {!estado.planConfig.fechaExamen && (
            <div className="mb-4">
              <Aviso tono="azul">Sin fecha de examen: el plan cubre {HORIZONTE_SIN_FECHA_DIAS / 7} semanas de práctica. Ingrese la fecha oficial cuando se publique y la última semana se dedicará a simulacros integrales.</Aviso>
            </div>
          )}
          {avance.pendientesVencidas > 0 && (
            <div className="mb-4">
              <Aviso tono="warn">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span>Tiene {avance.pendientesVencidas} actividades vencidas sin completar.</span>
                  <Boton variante="secundario" onClick={() => replanificar()}>Reorganizar plan</Boton>
                </div>
              </Aviso>
            </div>
          )}
          <div className="mb-4 grid gap-4 sm:grid-cols-3">
            <Card titulo="Avance general">
              <p className="text-3xl font-semibold tabular-nums text-navy-900">{avance.pctTotal} %</p>
              <Barra valor={avance.pctTotal} tono="ok" />
              <p className="mt-1 text-xs text-slate-500">{avance.hechas} de {avance.total} actividades</p>
            </Card>
            <Card titulo="Fecha del examen">
              <p className="text-lg font-semibold text-navy-900">{estado.planConfig.fechaExamen ? formatoFecha(estado.planConfig.fechaExamen, { day: "numeric", month: "long", year: "numeric" }) : "No publicada"}</p>
              <p className="text-xs text-slate-500">Ingresada por usted</p>
            </Card>
            <Card titulo="Carga de la semana">
              <p className="text-lg font-semibold text-navy-900">{Math.floor(minutosSemana / 60)} h {minutosSemana % 60} min</p>
              <p className="text-xs text-slate-500">{estado.planConfig.horasPorDia} h/día · {estado.planConfig.diasPorSemana} días/semana</p>
            </Card>
          </div>

          <Card
            titulo={`Semana del ${formatoFecha(dias[0], { day: "numeric", month: "short" })} al ${formatoFecha(dias[6], { day: "numeric", month: "short" })}`}
            accion={
              <div className="flex gap-1">
                <Boton variante="secundario" aria-label="Semana anterior" onClick={() => setSemana(semana - 1)}><ChevronLeft className="h-4 w-4" /></Boton>
                <Boton variante="secundario" onClick={() => setSemana(0)}>Hoy</Boton>
                <Boton variante="secundario" aria-label="Semana siguiente" onClick={() => setSemana(semana + 1)}><ChevronRight className="h-4 w-4" /></Boton>
              </div>
            }
          >
            <div className="grid gap-3 md:grid-cols-7">
              {dias.map((dia) => {
                const acts = estado.actividades.filter((a) => a.fecha === dia);
                return (
                  <div key={dia} className={cx("rounded-lg border p-2", dia === hoy ? "border-azul-500 bg-navy-50/50" : "border-slate-200")}>
                    <p className="text-xs font-semibold uppercase text-slate-500">{formatoFecha(dia, { weekday: "short", day: "numeric" })}</p>
                    <ul className="mt-2 space-y-2">
                      {acts.length === 0 && <li className="text-xs text-slate-400">Descanso</li>}
                      {acts.map((a) => (
                        <li key={a.id} className={cx("rounded-md border p-2 text-xs", a.completada ? "border-ok-500/30 bg-ok-50" : a.fecha < hoy ? "border-warn-500/40 bg-warn-50" : "border-slate-200 bg-white")}>
                          <label className="flex items-start gap-2">
                            <input type="checkbox" checked={a.completada} onChange={(e) => marcarActividad(a, e.target.checked)} className="mt-0.5" aria-label={`Marcar ${a.titulo} como completada`} />
                            <span className={cx(a.completada && "line-through opacity-70")}>{a.titulo}</span>
                          </label>
                          <div className="mt-1 flex items-center justify-between gap-1 pl-5">
                            <Badge>{ETIQUETA_TIPO[a.tipo]} · {a.minutos}′</Badge>
                            <Link href={enlace(a)} className="text-azul-600 hover:underline">Ir</Link>
                          </div>
                          {a.reprogramadaDesde && <p className="mt-1 pl-5 text-[10px] text-warn-700">Reprogramada desde {formatoFecha(a.reprogramadaDesde, { day: "numeric", month: "short" })}</p>}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      )}
    </>
  );
}

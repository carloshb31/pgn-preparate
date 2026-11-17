"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useStore } from "@/components/store";
import { Aviso, Badge, Boton, Card, Campo, ETIQUETA_DIFICULTAD, PageHeader, Vacio, cx, inputCls, tonoPuntaje } from "@/components/ui";
import { MODALIDADES, filtrarElegibles } from "@/lib/domain/exam";
import { TEMARIO, nombreModulo } from "@/lib/content/temario";
import type { ConfigSimulacro, Dificultad, ModalidadSimulacro, ModuloId } from "@/lib/domain/types";
import { formatoFecha } from "@/lib/domain/util";

const PRESETS: Record<ModalidadSimulacro, Partial<ConfigSimulacro>> = {
  general: { cantidad: 20, duracionMin: 30 },
  especifico: { cantidad: 40, duracionMin: 60 },
  modulo: { cantidad: 15, duracionMin: 20 },
  comportamental: {},
  integral: { cantidad: 50, duracionMin: 75 },
  personalizado: { cantidad: 25, duracionMin: 35 }
};

export default function Simulacros() {
  const { estado, enCurso, iniciarSimulacro, descartarEnCurso } = useStore();
  const router = useRouter();
  const [cfg, setCfg] = useState<ConfigSimulacro>({
    modalidad: "integral",
    cantidad: 50,
    duracionMin: 75,
    dificultades: [],
    modulos: [],
    aleatorizarPreguntas: true,
    aleatorizarOpciones: true,
    incluirNoValidadas: true
  });
  const [error, setError] = useState<string | null>(null);

  const elegibles = useMemo(() => (estado ? filtrarElegibles(estado.preguntas, cfg) : []), [estado, cfg]);
  const validadas = estado?.preguntas.filter((p) => p.estado === "validada" || p.estado === "publicada").length ?? 0;
  if (!estado) return null;

  const historial = [...estado.intentos].filter((i) => i.finalizado && !i.config.practica).sort((a, b) => (b.fin ?? "").localeCompare(a.fin ?? ""));
  const set = (p: Partial<ConfigSimulacro>) => setCfg((c) => ({ ...c, ...p }));

  function elegirModalidad(m: ModalidadSimulacro) {
    if (m === "comportamental") return router.push("/competencias");
    set({ modalidad: m, ...PRESETS[m], modulos: m === "modulo" ? [TEMARIO[0].id] : m === "personalizado" ? cfg.modulos : [] });
  }

  function iniciar() {
    setError(null);
    try {
      iniciarSimulacro(cfg);
      router.push("/simulacros/examen");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No fue posible crear el simulacro.");
    }
  }

  return (
    <>
      <PageHeader titulo="Simulacros" descripcion="Modo examen: sin respuestas ni explicaciones durante la prueba, cronómetro, navegación y revisión al finalizar." />

      {enCurso && (
        <div className="mb-6">
          <Aviso tono="azul">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span>Tiene un simulacro en curso ({enCurso.respuestas.filter((r) => r.seleccion).length} de {enCurso.respuestas.length} respondidas).</span>
              <span className="flex gap-2">
                <Link href="/simulacros/examen"><Boton>Continuar</Boton></Link>
                <Boton variante="secundario" onClick={descartarEnCurso}>Descartar</Boton>
              </span>
            </div>
          </Aviso>
        </div>
      )}

      <Aviso tono="warn">
        Estos simulacros usan parámetros de práctica. <strong>No reproducen la estructura oficial</strong>, que no ha sido publicada. El banco tiene {validadas} preguntas validadas; las
        demás se identifican como material experimental hasta su revisión.
      </Aviso>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {(Object.keys(MODALIDADES) as ModalidadSimulacro[]).map((m, i) => (
          <button
            key={m}
            onClick={() => elegirModalidad(m)}
            className={cx("rounded-xl border bg-white p-4 text-left shadow-sm transition hover:border-azul-500", cfg.modalidad === m ? "border-azul-500 ring-1 ring-azul-500" : "border-slate-200")}
          >
            <p className="text-xs font-semibold text-azul-600">{String.fromCharCode(65 + i)}</p>
            <p className="font-medium text-navy-900">{MODALIDADES[m].titulo}</p>
            <p className="mt-1 text-sm text-slate-600">{MODALIDADES[m].descripcion}</p>
          </button>
        ))}
      </div>

      <Card className="mt-6" titulo={`Configuración · ${MODALIDADES[cfg.modalidad].titulo}`}>
        <div className="grid gap-4 md:grid-cols-3">
          <Campo etiqueta="Cantidad de preguntas">
            <input type="number" min={1} max={200} className={inputCls} value={cfg.cantidad} onChange={(e) => set({ cantidad: Math.max(1, Number(e.target.value)) })} />
          </Campo>
          <Campo etiqueta="Duración (minutos)">
            <input type="number" min={1} max={300} className={inputCls} value={cfg.duracionMin} onChange={(e) => set({ duracionMin: Math.max(1, Number(e.target.value)) })} />
          </Campo>
          <Campo etiqueta="Dificultad" ayuda="Sin selección = todas">
            <div className="flex flex-wrap gap-1">
              {([1, 2, 3, 4, 5] as Dificultad[]).map((d) => {
                const on = cfg.dificultades.includes(d);
                return (
                  <button key={d} type="button" onClick={() => set({ dificultades: on ? cfg.dificultades.filter((x) => x !== d) : [...cfg.dificultades, d] })} className={cx("rounded-md border px-2 py-1 text-xs", on ? "border-navy-800 bg-navy-800 text-white" : "border-slate-300 bg-white")}>
                    {ETIQUETA_DIFICULTAD[d]}
                  </button>
                );
              })}
            </div>
          </Campo>
        </div>

        {(cfg.modalidad === "modulo" || cfg.modalidad === "personalizado") && (
          <div className="mt-4">
            <p className="text-sm font-medium text-navy-800">{cfg.modalidad === "modulo" ? "Módulo" : "Módulos"}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {TEMARIO.filter((m) => m.id !== "M9_COMPORTAMENTALES").map((m) => {
                const on = cfg.modulos.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => set({ modulos: cfg.modalidad === "modulo" ? [m.id] : on ? cfg.modulos.filter((x) => x !== m.id) : [...cfg.modulos, m.id as ModuloId] })}
                    className={cx("rounded-lg border px-3 py-1.5 text-sm", on ? "border-navy-800 bg-navy-800 text-white" : "border-slate-300 bg-white text-navy-800")}
                  >
                    M{m.numero} · {m.nombre}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {([
            ["aleatorizarPreguntas", "Orden aleatorio de preguntas"],
            ["aleatorizarOpciones", "Orden aleatorio de opciones"],
            ["incluirNoValidadas", "Incluir preguntas experimentales (no validadas)"]
          ] as const).map(([k, t]) => (
            <label key={k} className="flex items-center gap-2">
              <input type="checkbox" checked={cfg[k]} onChange={(e) => set({ [k]: e.target.checked })} className="h-4 w-4 rounded border-slate-300" />
              {t}
            </label>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-600">
            Preguntas disponibles con estos filtros: <strong className="text-navy-900">{elegibles.length}</strong>
            {elegibles.length < cfg.cantidad && elegibles.length > 0 && <span className="text-warn-700"> · el simulacro tendrá {elegibles.length}</span>}
          </p>
          <Boton onClick={iniciar} disabled={elegibles.length === 0 || !!enCurso}>Iniciar en modo examen</Boton>
        </div>
        {error && <div className="mt-3"><Aviso tono="bad">{error}</Aviso></div>}
      </Card>

      <Card className="mt-6" titulo="Historial de intentos">
        {historial.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-slate-500">
                <tr><th className="py-2">Fecha</th><th>Modalidad</th><th>Preguntas</th><th>Módulos</th><th className="text-right">Puntaje</th><th /></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {historial.map((i) => (
                  <tr key={i.id}>
                    <td className="py-2">{formatoFecha(i.fin ?? i.inicio)}</td>
                    <td>{MODALIDADES[i.config.modalidad].titulo}</td>
                    <td className="tabular-nums">{i.respuestas.length}</td>
                    <td className="max-w-[16rem] truncate text-slate-600">{i.config.modulos.length ? i.config.modulos.map((m) => nombreModulo(m)).join(", ") : "Todos"}</td>
                    <td className="text-right"><Badge tono={tonoPuntaje(i.puntaje)}>{i.puntaje}</Badge></td>
                    <td className="text-right"><Link className="text-azul-600 hover:underline" href={`/simulacros/resultado/${i.id}`}>Revisar</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Vacio titulo="Aún no ha realizado simulacros" />
        )}
      </Card>
    </>
  );
}

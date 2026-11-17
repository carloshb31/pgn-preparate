"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useStore } from "@/components/store";
import { Aviso, Badge, Barra, Boton, Card, ETIQUETA_DIFICULTAD, ETIQUETA_ESTADO, PageHeader, Vacio, cx, inputCls } from "@/components/ui";
import { TEMARIO, MODULO_POR_ID, nombreModulo, temaPorId } from "@/lib/content/temario";
import { TarjetaPractica } from "@/components/tarjeta-practica";
import { META_BANCO } from "@/lib/content/preguntas";
import type { ModuloId, Pregunta } from "@/lib/domain/types";

const TIPOS: Record<Pregunta["tipo"], string> = {
  conceptual: "Conocimiento conceptual",
  normativa: "Comprensión normativa",
  interpretacion: "Interpretación",
  escenario: "Análisis de escenarios",
  resolucion_problemas: "Resolución de problemas",
  decision_tecnica: "Decisión técnica",
  asesoria_institucional: "Asesoría institucional",
  caso_ciberseguridad: "Caso de ciberseguridad"
};

function Banco() {
  const { estado } = useStore();
  const params = useSearchParams();
  const [modulo, setModulo] = useState<string>(params.get("modulo") ?? "");
  const [tema, setTema] = useState("");
  const [dif, setDif] = useState("");
  const [tipo, setTipo] = useState("");
  const [est, setEst] = useState("");
  const [q, setQ] = useState("");
  const [abierta, setAbierta] = useState<string | null>(null);
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    setTema("");
  }, [modulo]);

  const lista = useMemo(() => {
    if (!estado) return [];
    const t = q.trim().toLowerCase();
    return estado.preguntas.filter(
      (p) =>
        p.estado !== "descartada" &&
        (!modulo || p.modulo === modulo) &&
        (!tema || p.temaId === tema) &&
        (!dif || p.dificultad === Number(dif)) &&
        (!tipo || p.tipo === tipo) &&
        (!est || p.estado === est) &&
        (!t || p.enunciado.toLowerCase().includes(t) || p.etiquetas.some((e) => e.toLowerCase().includes(t)) || p.id.toLowerCase().includes(t))
    );
  }, [estado, modulo, tema, dif, tipo, est, q]);

  if (!estado) return null;
  const temas = modulo ? MODULO_POR_ID[modulo as ModuloId].temas : [];
  const visibles = lista.slice(0, pagina * 20);
  const total = estado.preguntas.filter((p) => p.estado !== "descartada").length;

  return (
    <>
      <PageHeader titulo="Banco de preguntas" descripcion="Practique pregunta por pregunta con retroalimentación inmediata. Cada respuesta alimenta sus estadísticas y su cola de repaso." />

      <Card titulo={`Construcción del banco: ${total} de ${Object.values(META_BANCO).reduce((a, b) => a + b, 0)} preguntas meta`} className="mb-4">
        <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
          {TEMARIO.map((m) => {
            const n = estado.preguntas.filter((p) => p.modulo === m.id && p.estado !== "descartada").length;
            const meta = META_BANCO[m.id];
            return (
              <div key={m.id} className="text-xs">
                <div className="flex justify-between"><span className="truncate pr-2">M{m.numero} · {m.nombre}</span><span className="tabular-nums">{n}/{meta}</span></div>
                <Barra valor={n} max={meta} />
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-slate-500">Las metas orientan la construcción del banco; no representan la distribución oficial del examen. Las competencias comportamentales se practican en su propio módulo.</p>
      </Card>

      <Card className="mb-4">
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
          <input className={cx(inputCls, "lg:col-span-2")} placeholder="Buscar en enunciado, etiqueta o código" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar" />
          <select className={inputCls} value={modulo} onChange={(e) => setModulo(e.target.value)} aria-label="Módulo">
            <option value="">Todos los módulos</option>
            {TEMARIO.filter((m) => m.id !== "M9_COMPORTAMENTALES").map((m) => <option key={m.id} value={m.id}>M{m.numero} · {m.nombre}</option>)}
          </select>
          <select className={inputCls} value={tema} onChange={(e) => setTema(e.target.value)} disabled={!modulo} aria-label="Tema">
            <option value="">Todos los temas</option>
            {temas.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
          </select>
          <select className={inputCls} value={dif} onChange={(e) => setDif(e.target.value)} aria-label="Dificultad">
            <option value="">Toda dificultad</option>
            {[1, 2, 3, 4, 5].map((d) => <option key={d} value={d}>{ETIQUETA_DIFICULTAD[d]}</option>)}
          </select>
          <select className={inputCls} value={tipo} onChange={(e) => setTipo(e.target.value)} aria-label="Tipo">
            <option value="">Todo tipo</option>
            {Object.entries(TIPOS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select className={inputCls} value={est} onChange={(e) => setEst(e.target.value)} aria-label="Estado de validación">
            <option value="">Todo estado</option>
            {Object.entries(ETIQUETA_ESTADO).filter(([k]) => k !== "descartada").map(([k, v]) => <option key={k} value={k}>{v.texto}</option>)}
          </select>
        </div>
      </Card>

      {lista.some((p) => p.estado !== "validada" && p.estado !== "publicada") && (
        <div className="mb-4"><Aviso tono="warn">Las preguntas marcadas como «Pendiente de revisión» o «Borrador IA» son material experimental: aún no han sido validadas por una persona.</Aviso></div>
      )}

      <p className="mb-2 text-sm text-slate-600">{lista.length} preguntas</p>
      {lista.length === 0 ? (
        <Vacio titulo="No hay preguntas con estos filtros" />
      ) : (
        <ul className="space-y-3">
          {visibles.map((p) => (
            <li key={p.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-mono text-slate-500">{p.id}</span>
                <Badge tono="azul">{nombreModulo(p.modulo)}</Badge>
                <Badge>{temaPorId(p.temaId)?.tema.nombre}</Badge>
                <Badge>{ETIQUETA_DIFICULTAD[p.dificultad]}</Badge>
                <Badge>{TIPOS[p.tipo]}</Badge>
                <Badge tono={ETIQUETA_ESTADO[p.estado].tono}>{ETIQUETA_ESTADO[p.estado].texto}</Badge>
              </div>
              <p className="mt-2 text-sm text-navy-900">{p.enunciado}</p>
              {abierta === p.id ? (
                <TarjetaPractica key={p.id} p={p} />
              ) : (
                <Boton variante="secundario" className="mt-3" onClick={() => setAbierta(p.id)}>Responder</Boton>
              )}
            </li>
          ))}
        </ul>
      )}
      {visibles.length < lista.length && (
        <div className="mt-4 text-center"><Boton variante="secundario" onClick={() => setPagina(pagina + 1)}>Ver más</Boton></div>
      )}
    </>
  );
}

export default function Pagina() {
  return (
    <Suspense>
      <Banco />
    </Suspense>
  );
}

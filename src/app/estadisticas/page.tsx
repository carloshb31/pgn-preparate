"use client";

import { useMemo, useState } from "react";
import { Download, Printer } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useDerivados, useStore } from "@/components/store";
import { Badge, Boton, Card, ETIQUETA_DIFICULTAD, PageHeader, Stat, Vacio } from "@/components/ui";
import { TEMARIO, nombreCorto, nombreModulo, temaPorId } from "@/lib/content/temario";
import { preguntasMasFalladas } from "@/lib/domain/analytics";
import { MODALIDADES } from "@/lib/domain/exam";
import { PUEDE_IMPRIMIR, guardarArchivo } from "@/lib/plataforma";
import { diaSemana, formatoFecha, pct, sumarDias } from "@/lib/domain/util";

const AZUL = "#2f6bc4";

export default function Estadisticas() {
  const { estado } = useStore();
  const d = useDerivados();
  const [exportando, setExportando] = useState(false);

  const datos = useMemo(() => {
    if (!estado || !d) return null;
    const sims = d.finalizados.filter((i) => !i.config.practica).sort((a, b) => (a.fin ?? "").localeCompare(b.fin ?? ""));
    const evolucion = sims.map((i, n) => ({ n: n + 1, fecha: formatoFecha(i.fin ?? i.inicio, { day: "numeric", month: "short" }), puntaje: i.puntaje, modalidad: MODALIDADES[i.config.modalidad].titulo }));
    const porModulo = TEMARIO.filter((m) => m.id !== "M9_COMPORTAMENTALES").map((m) => {
      const rs = d.regs.filter((r) => r.modulo === m.id);
      return { modulo: nombreCorto(m.id), nombre: m.nombre, aciertos: pct(rs.filter((r) => r.correcta).length, rs.length), n: rs.length, dominio: d.dominio[m.id].dominio };
    });
    const porDif = [1, 2, 3, 4, 5].map((k) => {
      const rs = d.regs.filter((r) => r.dificultad === k);
      return { dificultad: ETIQUETA_DIFICULTAD[k], aciertos: pct(rs.filter((r) => r.correcta).length, rs.length), n: rs.length };
    });
    const semanas = new Map<string, { total: number; ok: number; seg: number }>();
    for (const r of d.regs) {
      const f = r.fecha.slice(0, 10);
      const lunes = sumarDias(f, 1 - diaSemana(f));
      const s = semanas.get(lunes) ?? { total: 0, ok: 0, seg: 0 };
      s.total++;
      if (r.correcta) s.ok++;
      s.seg += r.segundos;
      semanas.set(lunes, s);
    }
    const semanal = [...semanas.entries()].sort().map(([l, s]) => ({ semana: formatoFecha(l, { day: "numeric", month: "short" }), aciertos: pct(s.ok, s.total), preguntas: s.total, tiempo: Math.round(s.seg / s.total) }));
    const temas = new Map<string, { ok: number; t: number }>();
    d.regs.forEach((r) => {
      const x = temas.get(r.temaId) ?? { ok: 0, t: 0 };
      x.t++;
      if (r.correcta) x.ok++;
      temas.set(r.temaId, x);
    });
    const temasEval = [...temas.entries()].filter(([, v]) => v.t >= 3).map(([id, v]) => ({ id, nombre: temaPorId(id)?.tema.nombre ?? id, pct: pct(v.ok, v.t), n: v.t }));
    return {
      sims,
      evolucion,
      porModulo,
      porDif,
      semanal,
      dominados: temasEval.filter((t) => t.pct >= 80).sort((a, b) => b.pct - a.pct),
      debiles: temasEval.filter((t) => t.pct < 65).sort((a, b) => a.pct - b.pct),
      falladas: preguntasMasFalladas(d.regs, estado.preguntas, 10),
      tiempoProm: d.regs.length ? Math.round(d.regs.reduce((s, r) => s + r.segundos, 0) / d.regs.length) : 0
    };
  }, [estado, d]);

  if (!estado || !d || !datos) return null;
  const minimo = estado.ajustes.ponderaciones.minimoConocimientos;

  async function exportarExcel() {
    setExportando(true);
    try {
      const ExcelJS = (await import("exceljs")).default;
      const wb = new ExcelJS.Workbook();
      wb.creator = "PGN PREPÁRATE";
      const h1 = wb.addWorksheet("Simulacros");
      h1.columns = [{ header: "Fecha", key: "fecha", width: 22 }, { header: "Modalidad", key: "modalidad", width: 28 }, { header: "Preguntas", key: "n", width: 10 }, { header: "Puntaje", key: "puntaje", width: 10 }];
      datos!.sims.forEach((i) => h1.addRow({ fecha: i.fin, modalidad: MODALIDADES[i.config.modalidad].titulo, n: i.respuestas.length, puntaje: i.puntaje }));
      const h2 = wb.addWorksheet("Por módulo");
      h2.columns = [{ header: "Módulo", key: "nombre", width: 45 }, { header: "Respuestas", key: "n", width: 12 }, { header: "% aciertos", key: "aciertos", width: 12 }, { header: "Dominio", key: "dominio", width: 10 }];
      datos!.porModulo.forEach((m) => h2.addRow(m));
      const h3 = wb.addWorksheet("Respuestas");
      h3.columns = [{ header: "Fecha", key: "fecha", width: 22 }, { header: "Pregunta", key: "preguntaId", width: 12 }, { header: "Módulo", key: "modulo", width: 20 }, { header: "Tema", key: "temaId", width: 14 }, { header: "Dificultad", key: "dificultad", width: 10 }, { header: "Correcta", key: "correcta", width: 10 }, { header: "Segundos", key: "segundos", width: 10 }];
      d!.regs.forEach((r) => h3.addRow(r));
      [h1, h2, h3].forEach((h) => (h.getRow(1).font = { bold: true }));
      const buf = await wb.xlsx.writeBuffer();
      await guardarArchivo(`pgn-preparate-resultados-${new Date().toISOString().slice(0, 10)}.xlsx`, new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    } finally {
      setExportando(false);
    }
  }

  if (d.regs.length === 0) return (<><PageHeader titulo="Estadísticas" /><Vacio titulo="Aún no hay datos">Responda preguntas en el banco o realice un simulacro para ver su analítica.</Vacio></>);

  return (
    <>
      <PageHeader
        titulo="Estadísticas"
        descripcion="Analítica académica construida solo con sus respuestas registradas."
        acciones={
          <>
            {PUEDE_IMPRIMIR && <Boton variante="secundario" onClick={() => window.print()}><Printer className="h-4 w-4" />Reporte PDF</Boton>}
            <Boton variante="secundario" onClick={exportarExcel} disabled={exportando}><Download className="h-4 w-4" />{exportando ? "Generando…" : "Exportar Excel"}</Boton>
          </>
        }
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat etiqueta="Respuestas registradas" valor={d.regs.length} />
        <Stat etiqueta="Aciertos" valor={`${pct(d.regs.filter((r) => r.correcta).length, d.regs.length)} %`} />
        <Stat etiqueta="Tiempo promedio" valor={`${datos.tiempoProm} s`} detalle="por pregunta" />
        <Stat etiqueta="Simulacros" valor={datos.sims.length} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card titulo="Evolución de resultados en simulacros">
          {datos.evolucion.length ? (
            <div className="h-64">
              <ResponsiveContainer>
                <LineChart data={datos.evolucion}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="fecha" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: number, _n, i) => [v, i.payload.modalidad]} />
                  <ReferenceLine y={minimo} stroke="#d97706" strokeDasharray="4 4" label={{ value: `Mínimo ${minimo}`, fontSize: 11, fill: "#b45309", position: "insideBottomRight" }} />
                  <ReferenceLine y={85} stroke="#16a34a" strokeDasharray="4 4" label={{ value: "Meta 85", fontSize: 11, fill: "#15803d", position: "insideTopRight" }} />
                  <Line type="monotone" dataKey="puntaje" stroke={AZUL} strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : <p className="text-sm text-slate-600">Sin simulacros finalizados.</p>}
        </Card>
        <Card titulo="Rendimiento por módulo (% de aciertos)">
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={datos.porModulo}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="modulo" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number, _n, i) => [`${v} % (${i.payload.n} respuestas)`, i.payload.nombre]} />
                <Bar dataKey="aciertos" fill={AZUL} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card titulo="Rendimiento por dificultad">
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={datos.porDif}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="dificultad" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number, _n, i) => [`${v} % (${i.payload.n})`, "Aciertos"]} />
                <Bar dataKey="aciertos" fill="#4f86d6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card titulo="Evolución semanal">
          <div className="h-56">
            <ResponsiveContainer>
              <LineChart data={datos.semanal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="semana" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="a" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <YAxis yAxisId="t" orientation="right" tick={{ fontSize: 12 }} unit=" s" />
                <Tooltip />
                <Line yAxisId="a" dataKey="aciertos" name="% aciertos" stroke={AZUL} strokeWidth={2} />
                <Line yAxisId="t" dataKey="tiempo" name="Seg. por pregunta" stroke="#94a3b8" strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card titulo="Temas dominados (≥ 80 %, 3+ respuestas)">
          {datos.dominados.length ? <ul className="space-y-1 text-sm">{datos.dominados.map((t) => <li key={t.id} className="flex justify-between"><span>{t.nombre}</span><Badge tono="ok">{t.pct} %</Badge></li>)}</ul> : <p className="text-sm text-slate-600">Ninguno todavía.</p>}
        </Card>
        <Card titulo="Temas débiles (< 65 %)">
          {datos.debiles.length ? <ul className="space-y-1 text-sm">{datos.debiles.map((t) => <li key={t.id} className="flex justify-between"><span>{t.nombre}</span><Badge tono="bad">{t.pct} %</Badge></li>)}</ul> : <p className="text-sm text-slate-600">Ninguno con datos suficientes.</p>}
        </Card>
        <Card titulo="Preguntas más falladas">
          {datos.falladas.length ? (
            <ul className="space-y-2 text-sm">
              {datos.falladas.map((f) => (
                <li key={f.pregunta.id}>
                  <p className="line-clamp-2 text-navy-900">{f.pregunta.enunciado}</p>
                  <p className="text-xs text-slate-500">{f.pregunta.id} · {nombreModulo(f.pregunta.modulo)} · {f.fallos} fallos en {f.intentos} intentos</p>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-slate-600">Sin errores registrados.</p>}
        </Card>
      </div>

      <Card className="mt-4" titulo="Comparación entre simulacros">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-slate-500"><tr><th className="py-2">#</th><th>Fecha</th><th>Modalidad</th>{TEMARIO.filter((m) => m.id !== "M9_COMPORTAMENTALES").map((m) => <th key={m.id} className="text-right">M{m.numero}</th>)}<th className="text-right">Total</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {datos.sims.slice(-10).map((i, n) => {
                const porId = new Map(estado.preguntas.map((p) => [p.id, p]));
                return (
                  <tr key={i.id}>
                    <td className="py-1.5">{n + 1}</td>
                    <td>{formatoFecha(i.fin ?? i.inicio, { day: "numeric", month: "short" })}</td>
                    <td>{MODALIDADES[i.config.modalidad].titulo}</td>
                    {TEMARIO.filter((m) => m.id !== "M9_COMPORTAMENTALES").map((m) => {
                      const rs = i.respuestas.filter((r) => porId.get(r.preguntaId)?.modulo === m.id);
                      return <td key={m.id} className="text-right tabular-nums text-slate-600">{rs.length ? pct(rs.filter((r) => r.correcta).length, rs.length) : "—"}</td>;
                    })}
                    <td className="text-right font-medium tabular-nums">{i.puntaje}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

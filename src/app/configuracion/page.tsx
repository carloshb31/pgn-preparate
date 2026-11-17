"use client";

import { useState } from "react";
import { useStore } from "@/components/store";
import { Aviso, Boton, Card, Campo, PageHeader, inputCls } from "@/components/ui";
import { PONDERACIONES_OFICIALES, CONVOCATORIA, PARAMETROS_PRUEBA_OFICIAL, REGLAS_RES_076 } from "@/lib/config/convocatoria";
import { validarPonderaciones } from "@/lib/domain/scoring";
import { guardarArchivo } from "@/lib/plataforma";
import type { Ponderaciones } from "@/lib/domain/types";

export default function Configuracion() {
  const { estado, repo, guardarAjustes } = useStore();
  const [p, setP] = useState<Ponderaciones>(estado?.ajustes.ponderaciones ?? PONDERACIONES_OFICIALES);
  const [minutos, setMinutos] = useState(estado?.ajustes.minutosEstudioManual ?? 0);
  const [msg, setMsg] = useState<string | null>(null);
  const [confirmarReset, setConfirmarReset] = useState(false);
  if (!estado) return null;

  const errores = validarPonderaciones(p);
  const difiere = JSON.stringify(p) !== JSON.stringify(PONDERACIONES_OFICIALES);

  async function exportar() {
    try {
      await guardarArchivo(`pgn-preparate-respaldo-${new Date().toISOString().slice(0, 10)}.json`, await repo.exportar(), "application/json");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "No fue posible exportar.");
    }
  }

  return (
    <>
      <PageHeader titulo="Configuración" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card titulo="Ponderaciones del concurso">
          <p className="mb-3 text-xs text-slate-500">Valores oficiales: sección 8 del Formato de Convocatoria {CONVOCATORIA.codigo}. Modifíquelos solo si un acto administrativo los cambia.</p>
          <div className="grid grid-cols-3 gap-3">
            {(["conocimientos", "comportamentales", "antecedentes"] as const).map((k) => (
              <Campo key={k} etiqueta={`${k[0].toUpperCase()}${k.slice(1)} (%)`}>
                <input type="number" min={0} max={100} className={inputCls} value={Math.round(p[k] * 100)} onChange={(e) => setP({ ...p, [k]: Number(e.target.value) / 100 })} />
              </Campo>
            ))}
            <Campo etiqueta="Mínimo conocimientos"><input type="number" min={0} max={100} className={inputCls} value={p.minimoConocimientos} onChange={(e) => setP({ ...p, minimoConocimientos: Number(e.target.value) })} /></Campo>
            <Campo etiqueta="Mínimo elegibles"><input type="number" min={0} max={100} className={inputCls} value={p.minimoElegibles} onChange={(e) => setP({ ...p, minimoElegibles: Number(e.target.value) })} /></Campo>
          </div>
          {errores.length > 0 && <div className="mt-3"><Aviso tono="bad">{errores.join(" ")}</Aviso></div>}
          {difiere && errores.length === 0 && <div className="mt-3"><Aviso tono="warn">Estas ponderaciones difieren de las oficiales cargadas.</Aviso></div>}
          <div className="mt-4 flex gap-2">
            <Boton disabled={errores.length > 0} onClick={async () => { await guardarAjustes({ ...estado.ajustes, ponderaciones: p }); setMsg("Ponderaciones guardadas."); }}>Guardar</Boton>
            <Boton variante="secundario" onClick={() => setP(PONDERACIONES_OFICIALES)}>Restaurar oficiales</Boton>
          </div>
        </Card>

        <Card titulo="Parámetros oficiales de la prueba">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt>Número de preguntas</dt><dd>{PARAMETROS_PRUEBA_OFICIAL.numeroPreguntas ?? "No publicado"}</dd></div>
            <div className="flex justify-between"><dt>Duración</dt><dd>{PARAMETROS_PRUEBA_OFICIAL.duracionMinutos ?? "No publicado"}</dd></div>
            <div className="flex justify-between"><dt>Distribución entre núcleos</dt><dd>{PARAMETROS_PRUEBA_OFICIAL.distribucionNucleos ? "Publicada" : "No publicada"}</dd></div>
            <div className="flex justify-between"><dt>Fecha de la prueba</dt><dd>{PARAMETROS_PRUEBA_OFICIAL.fechaPrueba ?? "No publicada"}</dd></div>
          </dl>
          <p className="mt-3 text-xs text-slate-500">Se actualizan en <code>src/lib/config/convocatoria.ts</code> (o en la tabla <code>convocatorias</code>) cuando se publique la guía de orientación al aspirante.</p>
          <h3 className="mt-5 text-sm font-semibold text-navy-800">Reglas de la Resolución 076 de 2026</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {REGLAS_RES_076.map((r, i) => (
              <li key={i} className="flex gap-2"><span className="w-28 shrink-0 text-xs font-medium text-azul-600">{r.articulo}</span><span className="text-slate-700">{r.texto}</span></li>
            ))}
          </ul>
        </Card>

        <Card titulo="Tiempo de estudio adicional">
          <p className="mb-3 text-xs text-slate-500">El tiempo de simulacros y actividades completadas se cuenta solo. Registre aquí el estudio hecho fuera de la plataforma.</p>
          <div className="flex items-end gap-2">
            <Campo etiqueta="Minutos acumulados fuera de la plataforma"><input type="number" min={0} className={inputCls} value={minutos} onChange={(e) => setMinutos(Math.max(0, Number(e.target.value)))} /></Campo>
            <Boton variante="secundario" onClick={async () => { await guardarAjustes({ ...estado.ajustes, minutosEstudioManual: minutos }); setMsg("Tiempo actualizado."); }}>Guardar</Boton>
          </div>
        </Card>

        <Card titulo="Datos y respaldo">
          <p className="text-sm text-slate-700">Modo de datos: <strong>{repo.modo === "local" ? "Local de demostración (solo este navegador)" : repo.modo === "artifact" ? "Cuenta de Claude (privado, en la nube)" : "Supabase (cuenta en la nube)"}</strong></p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Boton variante="secundario" onClick={exportar}>Descargar respaldo JSON</Boton>
            {repo.restablecer && !confirmarReset && <Boton variante="peligro" onClick={() => setConfirmarReset(true)}>Borrar datos locales</Boton>}
          </div>
          {confirmarReset && (
            <div className="mt-3 space-y-2">
              <Aviso tono="bad">Se eliminarán de este navegador todos sus intentos, plan, fichas y documentos. No se puede deshacer.</Aviso>
              <div className="flex gap-2">
                <Boton variante="peligro" onClick={async () => { await repo.restablecer!(); location.href = "/"; }}>Sí, borrar todo</Boton>
                <Boton variante="secundario" onClick={() => setConfirmarReset(false)}>Cancelar</Boton>
              </div>
            </div>
          )}
        </Card>
      </div>
      {msg && <div className="mt-4"><Aviso tono="ok">{msg}</Aviso></div>}
    </>
  );
}

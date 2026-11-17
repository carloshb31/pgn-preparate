"use client";

import { useMemo, useState } from "react";
import { Download, Upload } from "lucide-react";
import { useStore } from "@/components/store";
import { Aviso, Badge, Boton, Card, ETIQUETA_DIFICULTAD, ETIQUETA_ESTADO, PageHeader, Stat, Vacio, cx } from "@/components/ui";
import { COLUMNAS_CSV, importarPreguntas, type ResultadoImportacion } from "@/lib/domain/importacion";
import { nombreModulo, temaPorId } from "@/lib/content/temario";
import { FUENTE_POR_ID } from "@/lib/content/fuentes";
import type { EstadoPregunta, Pregunta } from "@/lib/domain/types";
import { guardarArchivo } from "@/lib/plataforma";

const TRANSICIONES: Record<EstadoPregunta, EstadoPregunta[]> = {
  borrador_ia: ["pendiente_revision", "descartada"],
  pendiente_revision: ["validada", "descartada"],
  validada: ["publicada", "pendiente_revision", "descartada"],
  publicada: ["validada", "descartada"],
  descartada: ["pendiente_revision"]
};

function descargar(nombre: string, contenido: string, tipo: string) {
  guardarArchivo(nombre, contenido, tipo).catch(() => undefined);
}

export default function Admin() {
  const { estado, guardarPreguntas, repo } = useStore();
  const [filtro, setFiltro] = useState<EstadoPregunta>("borrador_ia");
  const [imp, setImp] = useState<ResultadoImportacion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [abierta, setAbierta] = useState<string | null>(null);

  const conteo = useMemo(() => {
    const c: Record<string, number> = {};
    estado?.preguntas.forEach((p) => (c[p.estado] = (c[p.estado] ?? 0) + 1));
    return c;
  }, [estado]);

  if (!estado) return null;
  if (!estado.esAdmin) return <Vacio titulo="Acceso restringido">Esta sección es solo para administradores.</Vacio>;

  const cola = estado.preguntas.filter((p) => p.estado === filtro);

  async function cambiarEstado(p: Pregunta, nuevo: EstadoPregunta) {
    await guardarPreguntas([{ ...p, estado: nuevo }]);
    repo.registrar("pregunta_estado", { id: p.id, de: p.estado, a: nuevo }).catch(() => {});
  }

  async function leerArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setError(null);
    try {
      const texto = await f.text();
      setImp(importarPreguntas(texto, f.name.toLowerCase().endsWith(".json") ? "json" : "csv"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Archivo inválido.");
    }
  }

  return (
    <>
      <PageHeader
        titulo="Administración"
        descripcion="Validación de preguntas, importación y exportación del banco."
        acciones={
          <>
            <Boton variante="secundario" onClick={() => descargar(`banco-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify({ preguntas: estado.preguntas }, null, 2), "application/json")}>
              <Download className="h-4 w-4" />Exportar JSON
            </Boton>
            <Boton variante="secundario" onClick={() => descargar("plantilla-preguntas.csv", COLUMNAS_CSV.join(",") + "\n", "text/csv")}>Plantilla CSV</Boton>
          </>
        }
      />
      {repo.modo === "local" && <div className="mb-4"><Aviso tono="warn">Modo local: los cambios de validación se guardan solo en este navegador.</Aviso></div>}
      {repo.modo === "artifact" && <div className="mb-4"><Aviso tono="azul">Las validaciones se guardan en su cuenta. Usted es el revisor del banco: confirme cada respuesta contra su fuente antes de validarla.</Aviso></div>}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {(Object.keys(ETIQUETA_ESTADO) as EstadoPregunta[]).map((k) => (
          <button key={k} onClick={() => setFiltro(k)} className="text-left">
            <Stat etiqueta={ETIQUETA_ESTADO[k].texto} valor={conteo[k] ?? 0} tono={filtro === k ? "ok" : "neutro"} />
          </button>
        ))}
      </div>

      <Card className="mt-4" titulo="Importar preguntas (CSV o JSON)">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-navy-800 px-4 py-2 text-sm font-medium text-white hover:bg-navy-700">
          <Upload className="h-4 w-4" /> Seleccionar archivo
          <input type="file" accept=".csv,.json,text/csv,application/json" className="sr-only" onChange={leerArchivo} />
        </label>
        <p className="mt-2 text-xs text-slate-500">CSV con columnas: {COLUMNAS_CSV.join(", ")}. Etiquetas separadas por «|». Todo lo importado entra como «Pendiente de revisión».</p>
        {error && <div className="mt-3"><Aviso tono="bad">{error}</Aviso></div>}
        {imp && (
          <div className="mt-4 space-y-3">
            <Aviso tono={imp.errores.length ? "warn" : "ok"}>{imp.validas.length} preguntas válidas · {imp.errores.length} con errores.</Aviso>
            {imp.errores.length > 0 && (
              <ul className="max-h-40 overflow-y-auto text-xs text-bad-700">{imp.errores.map((e) => <li key={e.fila}>Fila {e.fila}: {e.mensaje}</li>)}</ul>
            )}
            {imp.validas.length > 0 && (
              <Boton onClick={async () => { await guardarPreguntas(imp.validas); setImp(null); setFiltro("pendiente_revision"); }}>Incorporar {imp.validas.length} preguntas</Boton>
            )}
          </div>
        )}
      </Card>

      <Card className="mt-4" titulo={`Cola: ${ETIQUETA_ESTADO[filtro].texto} (${cola.length})`}>
        {cola.length === 0 ? (
          <p className="text-sm text-slate-600">No hay preguntas en este estado.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {cola.map((p) => {
              const fuente = FUENTE_POR_ID[p.fuenteId];
              return (
                <li key={p.id} className="py-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono text-slate-500">{p.id}</span>
                    <Badge tono="azul">{nombreModulo(p.modulo)}</Badge>
                    <Badge>{temaPorId(p.temaId)?.tema.nombre}</Badge>
                    <Badge>{ETIQUETA_DIFICULTAD[p.dificultad]}</Badge>
                    <Badge>autor: {p.autor}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-navy-900">{p.enunciado}</p>
                  {abierta === p.id && (
                    <div className="mt-3 space-y-2 rounded-lg bg-slate-50 p-3 text-sm">
                      {p.opciones.map((o) => (
                        <p key={o.id} className={cx(o.id === p.correcta && "font-medium text-ok-700")}>{o.id}. {o.texto} <span className="block text-xs font-normal text-slate-500">{o.justificacion}</span></p>
                      ))}
                      <p className="pt-2 text-slate-700">{p.explicacion}</p>
                      <p className="text-xs text-slate-500">Fuente: {fuente?.titulo ?? p.fuenteId}{p.referencia ? ` · ${p.referencia}` : ""} · {fuente?.fechaVerificacion ? `verificada ${fuente.fechaVerificacion}` : "fuente sin verificar"}{p.esInferencia ? " · inferencia académica" : ""}</p>
                      <p className="text-xs text-warn-700">Antes de validar: confirme la respuesta en la fuente, que haya una sola opción correcta y que los distractores sean plausibles.</p>
                    </div>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Boton variante="fantasma" onClick={() => setAbierta(abierta === p.id ? null : p.id)}>{abierta === p.id ? "Ocultar" : "Revisar"}</Boton>
                    {TRANSICIONES[p.estado].map((n) => (
                      <Boton key={n} variante={n === "descartada" ? "peligro" : n === "validada" || n === "publicada" ? "primario" : "secundario"} onClick={() => cambiarEstado(p, n)}>
                        {n === "descartada" ? "Descartar" : `Pasar a «${ETIQUETA_ESTADO[n].texto}»`}
                      </Boton>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
      <p className="mt-4 text-xs text-slate-500">Fuentes y fechas de verificación: en modo Supabase se administran en la tabla <code>fuentes</code>; en el código, en <code>src/lib/content/fuentes.ts</code>.</p>
    </>
  );
}

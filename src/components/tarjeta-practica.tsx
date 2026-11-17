"use client";

import { useRef, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { useStore } from "./store";
import { Boton, cx } from "./ui";
import { FUENTE_POR_ID } from "@/lib/content/fuentes";
import type { Pregunta } from "@/lib/domain/types";

export function TarjetaPractica({ p }: { p: Pregunta }) {
  const { registrarPractica } = useStore();
  const [sel, setSel] = useState<string | null>(null);
  const [res, setRes] = useState<boolean | null>(null);
  const inicio = useRef(Date.now());
  const fuente = FUENTE_POR_ID[p.fuenteId];

  async function verificar() {
    if (!sel) return;
    const fin = await registrarPractica(p.id, sel, Math.round((Date.now() - inicio.current) / 1000));
    setRes(fin.respuestas[0].correcta);
  }

  return (
    <div className="mt-4 border-t border-slate-100 pt-4">
      <div className="space-y-2">
        {p.opciones.map((o) => {
          const revel = res !== null;
          return (
            <label key={o.id} className={cx("flex gap-3 rounded-lg border p-3 text-sm", revel && o.id === p.correcta ? "border-ok-500/40 bg-ok-50" : revel && o.id === sel ? "border-bad-500/40 bg-bad-50" : sel === o.id ? "border-navy-800 bg-navy-50" : "border-slate-200")}>
              <input type="radio" name={`b-${p.id}`} disabled={revel} checked={sel === o.id} onChange={() => setSel(o.id)} className="mt-0.5" />
              <span className="flex-1">
                <span className="font-semibold">{o.id}.</span> {o.texto}
                {revel && <span className="mt-1 block text-xs text-slate-600">{o.justificacion}</span>}
              </span>
            </label>
          );
        })}
      </div>
      {res === null ? (
        <Boton className="mt-3" onClick={verificar} disabled={!sel}>Verificar respuesta</Boton>
      ) : (
        <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm">
          <p className={cx("flex items-center gap-2 font-medium", res ? "text-ok-700" : "text-bad-700")}>
            {res ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />} {res ? "Correcta" : `Incorrecta. La respuesta es ${p.correcta}.`}
          </p>
          <p className="mt-2 text-slate-700">{p.explicacion}</p>
          <p className="mt-2 text-xs text-slate-500">
            Fuente: {fuente?.url ? <a className="text-azul-600 hover:underline" href={fuente.url} target="_blank" rel="noreferrer">{fuente.titulo}</a> : fuente?.titulo}
            {p.referencia ? ` · ${p.referencia}` : ""}{p.esInferencia ? " · Inferencia académica" : ""}
          </p>
        </div>
      )}
    </div>
  );
}

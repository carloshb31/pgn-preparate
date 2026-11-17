"use client";

import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export function cx(...a: Parameters<typeof clsx>) {
  return clsx(...a);
}

export function Card({ children, className, titulo, accion }: { children: ReactNode; className?: string; titulo?: ReactNode; accion?: ReactNode }) {
  return (
    <section className={cx("rounded-xl border border-slate-200 bg-white p-5 shadow-sm", className)}>
      {(titulo || accion) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          {titulo && <h2 className="text-sm font-semibold text-navy-800">{titulo}</h2>}
          {accion}
        </header>
      )}
      {children}
    </section>
  );
}

export function PageHeader({ titulo, descripcion, acciones }: { titulo: string; descripcion?: ReactNode; acciones?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-navy-900">{titulo}</h1>
        {descripcion && <p className="mt-1 max-w-3xl text-sm text-slate-600">{descripcion}</p>}
      </div>
      {acciones && <div className="flex flex-wrap gap-2">{acciones}</div>}
    </div>
  );
}

export function Stat({ etiqueta, valor, detalle, tono = "neutro" }: { etiqueta: string; valor: ReactNode; detalle?: ReactNode; tono?: "neutro" | "ok" | "bad" | "warn" }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{etiqueta}</p>
      <p className={cx("mt-1 text-2xl font-semibold tabular-nums", { "text-navy-900": tono === "neutro", "text-ok-700": tono === "ok", "text-bad-700": tono === "bad", "text-warn-700": tono === "warn" })}>{valor}</p>
      {detalle && <p className="mt-1 text-xs text-slate-500">{detalle}</p>}
    </div>
  );
}

type Variante = "primario" | "secundario" | "fantasma" | "peligro";
export function Boton({ variante = "primario", className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante }) {
  return (
    <button
      {...p}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-azul-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        {
          "bg-navy-800 text-white hover:bg-navy-700": variante === "primario",
          "border border-slate-300 bg-white text-navy-800 hover:bg-slate-50": variante === "secundario",
          "text-navy-700 hover:bg-navy-50": variante === "fantasma",
          "bg-bad-500 text-white hover:bg-bad-700": variante === "peligro"
        },
        className
      )}
    />
  );
}

export function Badge({ children, tono = "neutro", className }: { children: ReactNode; tono?: "neutro" | "ok" | "bad" | "warn" | "azul"; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium",
        {
          "bg-slate-100 text-slate-700": tono === "neutro",
          "bg-ok-50 text-ok-700": tono === "ok",
          "bg-bad-50 text-bad-700": tono === "bad",
          "bg-warn-50 text-warn-700": tono === "warn",
          "bg-navy-50 text-navy-700": tono === "azul"
        },
        className
      )}
    >
      {children}
    </span>
  );
}

export function Barra({ valor, max = 100, tono = "azul" }: { valor: number; max?: number; tono?: "azul" | "ok" | "warn" | "bad" }) {
  const p = Math.max(0, Math.min(100, (valor / max) * 100));
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={Math.round(p)} aria-valuemin={0} aria-valuemax={100}>
      <div className={cx("h-full rounded-full transition-all", { "bg-azul-500": tono === "azul", "bg-ok-500": tono === "ok", "bg-warn-500": tono === "warn", "bg-bad-500": tono === "bad" })} style={{ width: `${p}%` }} />
    </div>
  );
}

export function Vacio({ titulo, children, accion }: { titulo: string; children?: ReactNode; accion?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <p className="font-medium text-navy-800">{titulo}</p>
      {children && <div className="mx-auto mt-1 max-w-md text-sm text-slate-600">{children}</div>}
      {accion && <div className="mt-4">{accion}</div>}
    </div>
  );
}

export function Aviso({ tono = "warn", children }: { tono?: "warn" | "azul" | "bad" | "ok"; children: ReactNode }) {
  return (
    <div
      role="note"
      className={cx("rounded-lg border px-4 py-3 text-sm", {
        "border-warn-500/30 bg-warn-50 text-warn-700": tono === "warn",
        "border-navy-100 bg-navy-50 text-navy-800": tono === "azul",
        "border-bad-500/30 bg-bad-50 text-bad-700": tono === "bad",
        "border-ok-500/30 bg-ok-50 text-ok-700": tono === "ok"
      })}
    >
      {children}
    </div>
  );
}

export function Campo({ etiqueta, children, ayuda }: { etiqueta: string; children: ReactNode; ayuda?: ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-navy-800">{etiqueta}</span>
      <div className="mt-1">{children}</div>
      {ayuda && <span className="mt-1 block text-xs text-slate-500">{ayuda}</span>}
    </label>
  );
}

export const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-azul-500 focus:outline-none focus:ring-1 focus:ring-azul-500";

export function tonoPuntaje(p: number | null | undefined, minimo = 65): "ok" | "warn" | "bad" | "neutro" {
  if (p === null || p === undefined) return "neutro";
  if (p >= 85) return "ok";
  if (p >= minimo) return "warn";
  return "bad";
}

export const ETIQUETA_ESTADO: Record<string, { texto: string; tono: "neutro" | "ok" | "bad" | "warn" | "azul" }> = {
  borrador_ia: { texto: "Borrador IA", tono: "warn" },
  pendiente_revision: { texto: "Pendiente de revisión", tono: "warn" },
  validada: { texto: "Validada", tono: "ok" },
  publicada: { texto: "Publicada", tono: "azul" },
  descartada: { texto: "Descartada", tono: "bad" }
};

export const ETIQUETA_DIFICULTAD = ["", "Básica", "Media", "Intermedia", "Alta", "Experta"];

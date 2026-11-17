import type { Ponderaciones } from "./types";

export interface ComponentesPuntaje {
  conocimientos: number | null;
  comportamentales: number | null;
  /** null = pendiente: no hay calificación oficial y no se asume ninguna. */
  antecedentes: number | null;
}

export interface ResultadoPonderado {
  aportes: { conocimientos: number | null; comportamentales: number | null; antecedentes: number | null };
  /** Suma de los aportes conocidos. */
  parcial: number;
  /** Puntaje final solo si los tres componentes están disponibles. */
  final: number | null;
  superaMinimoConocimientos: boolean | null;
  /** null cuando falta algún componente o no se superó el eliminatorio. */
  integraListaElegibles: boolean | null;
  /** Puntaje mínimo que necesitaría el componente pendiente para alcanzar el mínimo de elegibles. */
  necesarioEnPendiente: { componente: keyof ComponentesPuntaje; valor: number } | null;
  pendientes: (keyof ComponentesPuntaje)[];
}

const r2 = (n: number) => Math.round(n * 100) / 100;

export function validarPonderaciones(p: Ponderaciones): string[] {
  const errores: string[] = [];
  const suma = p.conocimientos + p.comportamentales + p.antecedentes;
  if (Math.abs(suma - 1) > 1e-9) errores.push(`Las ponderaciones deben sumar 100 % (suman ${r2(suma * 100)} %).`);
  for (const [k, v] of Object.entries(p)) {
    if (typeof v !== "number" || Number.isNaN(v) || v < 0) errores.push(`Valor inválido en ${k}.`);
  }
  if (p.minimoConocimientos > 100 || p.minimoElegibles > 100) errores.push("Los mínimos no pueden superar 100.");
  return errores;
}

function validarPuntaje(nombre: string, v: number | null) {
  if (v === null) return;
  if (Number.isNaN(v) || v < 0 || v > 100) throw new RangeError(`${nombre} debe estar entre 0 y 100.`);
}

/**
 * Puntaje final = Conocimientos × w1 + Comportamentales × w2 + Antecedentes × w3.
 * Conocimientos es eliminatoria: por debajo del mínimo el aspirante no continúa.
 */
export function calcularPonderado(c: ComponentesPuntaje, p: Ponderaciones): ResultadoPonderado {
  validarPuntaje("Conocimientos", c.conocimientos);
  validarPuntaje("Comportamentales", c.comportamentales);
  validarPuntaje("Antecedentes", c.antecedentes);

  const aportes = {
    conocimientos: c.conocimientos === null ? null : r2(c.conocimientos * p.conocimientos),
    comportamentales: c.comportamentales === null ? null : r2(c.comportamentales * p.comportamentales),
    antecedentes: c.antecedentes === null ? null : r2(c.antecedentes * p.antecedentes)
  };
  const pendientes = (Object.keys(c) as (keyof ComponentesPuntaje)[]).filter((k) => c[k] === null);
  const parcial = r2((aportes.conocimientos ?? 0) + (aportes.comportamentales ?? 0) + (aportes.antecedentes ?? 0));
  const final = pendientes.length === 0 ? parcial : null;

  const superaMinimoConocimientos = c.conocimientos === null ? null : c.conocimientos >= p.minimoConocimientos;

  let integraListaElegibles: boolean | null = null;
  if (superaMinimoConocimientos === false) integraListaElegibles = false;
  else if (final !== null) integraListaElegibles = final >= p.minimoElegibles;

  let necesarioEnPendiente: ResultadoPonderado["necesarioEnPendiente"] = null;
  if (pendientes.length === 1 && superaMinimoConocimientos !== false) {
    const comp = pendientes[0];
    const peso = p[comp];
    if (peso > 0) {
      const valor = r2((p.minimoElegibles - parcial) / peso);
      necesarioEnPendiente = { componente: comp, valor: Math.max(0, valor) };
    }
  }

  return { aportes, parcial, final, superaMinimoConocimientos, integraListaElegibles, necesarioEnPendiente, pendientes };
}

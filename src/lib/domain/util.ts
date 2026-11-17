export const uid = (prefijo = "id") =>
  `${prefijo}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

/** Fecha local en formato YYYY-MM-DD (America/Bogota en el navegador del usuario). */
export function hoyISO(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function sumarDias(iso: string, dias: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const f = new Date(y, m - 1, d + dias);
  return hoyISO(f);
}

export function diasEntre(a: string, b: string): number {
  const [y1, m1, d1] = a.split("-").map(Number);
  const [y2, m2, d2] = b.split("-").map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 864e5);
}

/** Día de la semana ISO: 1 = lunes … 7 = domingo. */
export function diaSemana(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  const w = new Date(y, m - 1, d).getDay();
  return w === 0 ? 7 : w;
}

/** PRNG determinista (mulberry32) para que una semilla reproduzca el mismo simulacro. */
export function rng(semilla: number) {
  let a = semilla >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function barajar<T>(arr: T[], aleatorio: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const pct = (n: number, d: number) => (d === 0 ? 0 : Math.round((n / d) * 1000) / 10);

export const formatoPesos = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export function formatoFecha(iso: string, opciones: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) {
  // Fecha sola (YYYY-MM-DD) = fecha local; con hora = instante ISO.
  if (iso.length > 10) return new Intl.DateTimeFormat("es-CO", opciones).format(new Date(iso));
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("es-CO", opciones).format(new Date(y, m - 1, d));
}

export function formatoDuracion(seg: number) {
  const h = Math.floor(seg / 3600);
  const m = Math.floor((seg % 3600) / 60);
  const s = Math.floor(seg % 60);
  return h > 0 ? `${h} h ${m} min` : m > 0 ? `${m} min ${s} s` : `${s} s`;
}

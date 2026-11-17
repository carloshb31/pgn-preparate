// Enrutador en memoria para la versión artifact. Sincroniza solo un nombre plano en el hash
// (#plan, #simulacros…), que es lo único que el visor de artifacts conserva en el enlace.
import { useSyncExternalStore } from "react";

type Oyente = () => void;
const oyentes = new Set<Oyente>();
let ruta = "/";

const HASH_A_RUTA: Record<string, string> = {
  "": "/",
  inicio: "/",
  plan: "/plan",
  biblioteca: "/biblioteca",
  banco: "/banco",
  simulacros: "/simulacros",
  examen: "/simulacros/examen",
  competencias: "/competencias",
  estadisticas: "/estadisticas",
  asistente: "/asistente",
  progreso: "/progreso",
  configuracion: "/configuracion",
  admin: "/admin",
  resultado: "/simulacros"
};

export function nombreDeRuta(path: string): string {
  const limpio = path.split("?")[0];
  if (limpio === "/") return "inicio";
  if (limpio.startsWith("/simulacros/examen")) return "examen";
  if (limpio.startsWith("/simulacros/resultado")) return "resultado";
  return limpio.split("/")[1] || "inicio";
}

function emitir() {
  oyentes.forEach((o) => o());
}

export function navegar(href: string, { reemplazar = false } = {}) {
  if (href === ruta) return;
  ruta = href.startsWith("/") ? href : `/${href}`;
  const nombre = nombreDeRuta(ruta);
  try {
    const nuevo = nombre === "inicio" ? "" : `#${nombre}`;
    if (location.hash !== nuevo) {
      if (reemplazar) history.replaceState(null, "", nuevo || location.pathname);
      else history.pushState(null, "", nuevo || location.pathname);
    }
  } catch {
    /* el visor puede impedir tocar el historial: la navegación sigue en memoria */
  }
  try {
    window.scrollTo({ top: 0 });
  } catch {
    /* noop */
  }
  emitir();
}

function desdeHash() {
  let h = "";
  try {
    h = location.hash.replace(/^#/, "");
  } catch {
    /* noop */
  }
  const destino = HASH_A_RUTA[h] ?? "/";
  // Si el hash apunta a la misma sección, conserva la ruta completa (p. ej. un resultado abierto).
  if (nombreDeRuta(ruta) !== (h || "inicio") || HASH_A_RUTA[h] === undefined) {
    ruta = destino;
    emitir();
  }
}

if (typeof window !== "undefined") {
  ruta = HASH_A_RUTA[location.hash.replace(/^#/, "")] ?? "/";
  window.addEventListener("hashchange", desdeHash);
  window.addEventListener("popstate", desdeHash);
}

function suscribir(o: Oyente) {
  oyentes.add(o);
  return () => oyentes.delete(o);
}

export function useRuta() {
  return useSyncExternalStore(suscribir, () => ruta, () => ruta);
}

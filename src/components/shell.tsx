"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  BarChart3,
  BookOpenText,
  CalendarDays,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Sparkles,
  Timer,
  TrendingUp,
  Users,
  X
} from "lucide-react";
import { StoreProvider, useStore } from "./store";
import { cx, Aviso, Boton } from "./ui";
import { CONVOCATORIA } from "@/lib/config/convocatoria";
import { supabaseConfigurado } from "@/lib/data";
import { getSupabase } from "@/lib/data/supabase";
import { Login } from "./login";

export const NAV = [
  { href: "/", texto: "Inicio", icono: LayoutDashboard },
  { href: "/plan", texto: "Mi plan de estudio", icono: CalendarDays },
  { href: "/biblioteca", texto: "Biblioteca académica", icono: BookOpenText },
  { href: "/banco", texto: "Banco de preguntas", icono: ListChecks },
  { href: "/simulacros", texto: "Simulacros", icono: Timer },
  { href: "/competencias", texto: "Competencias comportamentales", icono: Users },
  { href: "/estadisticas", texto: "Estadísticas", icono: BarChart3 },
  { href: "/asistente", texto: "Asistente IA", icono: Sparkles },
  { href: "/progreso", texto: "Mi progreso", icono: TrendingUp },
  { href: "/configuracion", texto: "Configuración", icono: Settings }
];

function Marca() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-sm font-bold text-white ring-1 ring-white/20">PG</div>
      <div className="leading-tight">
        <p className="text-sm font-semibold text-white">PGN PREPÁRATE</p>
        <p className="text-[11px] text-navy-100">Convocatoria {CONVOCATORIA.codigo} · {CONVOCATORIA.codigoGrado}</p>
      </div>
    </div>
  );
}

function Navegacion({ alNavegar }: { alNavegar?: () => void }) {
  const ruta = usePathname();
  const { estado } = useStore();
  const items = estado?.esAdmin ? [...NAV, { href: "/admin", texto: "Administración", icono: ShieldCheck }] : NAV;
  return (
    <nav aria-label="Navegación principal" className="flex flex-col gap-0.5">
      {items.map(({ href, texto, icono: I }) => {
        const activo = href === "/" ? ruta === "/" : ruta.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={alNavegar}
            aria-current={activo ? "page" : undefined}
            className={cx(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
              activo ? "bg-white/15 font-medium text-white" : "text-navy-100 hover:bg-white/10 hover:text-white"
            )}
          >
            <I className="h-4 w-4 shrink-0" aria-hidden />
            {texto}
          </Link>
        );
      })}
    </nav>
  );
}

function IndicadorModo() {
  const { repo, estado } = useStore();
  if (repo.modo === "artifact")
    return (
      <div className="rounded-lg bg-white/10 px-3 py-2 text-[11px] leading-snug text-navy-100 ring-1 ring-white/15">
        <p className="font-semibold text-white">Guardado en su cuenta de Claude</p>
        Su avance es privado y lo verá desde cualquier dispositivo.
      </div>
    );
  if (repo.modo === "local")
    return (
      <div className="rounded-lg bg-warn-500/15 px-3 py-2 text-[11px] leading-snug text-amber-100 ring-1 ring-warn-500/40">
        <p className="font-semibold text-amber-200">Modo local de demostración</p>
        Los datos se guardan solo en este navegador. Configure Supabase para persistencia y cuentas.
      </div>
    );
  return (
    <div className="flex items-center justify-between gap-2 text-[11px] text-navy-100">
      <span className="truncate">{estado?.usuario?.email}</span>
      <button className="rounded p-1 hover:bg-white/10" aria-label="Cerrar sesión" onClick={() => getSupabase().auth.signOut().then(() => location.reload())}>
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}

const ACCESO_MOVIL = [NAV[0], NAV[4], NAV[3], NAV[1]];

export function Shell({ children }: { children: ReactNode }) {
  const [abierto, setAbierto] = useState(false);
  const [sesion, setSesion] = useState<"cargando" | "si" | "no">(supabaseConfigurado() ? "cargando" : "si");
  const ruta = usePathname();
  const enExamen = ruta.startsWith("/simulacros/examen");

  useEffect(() => {
    if (!supabaseConfigurado()) return;
    const sb = getSupabase();
    sb.auth.getSession().then(({ data }) => setSesion(data.session ? "si" : "no"));
    const { data } = sb.auth.onAuthStateChange((_e, s) => setSesion(s ? "si" : "no"));
    return () => data.subscription.unsubscribe();
  }, []);

  if (sesion === "cargando") return <div className="grid min-h-screen place-items-center text-sm text-slate-500">Verificando sesión…</div>;
  if (sesion === "no") return <Login />;

  return (
    <StoreProvider>
    <StoreGate>
      <div className="min-h-screen bg-slate-50">
        {/* Barra lateral escritorio */}
        <aside className={cx("fixed inset-y-0 left-0 z-30 hidden w-64 flex-col gap-6 bg-navy-900 p-4 lg:flex", enExamen && "lg:hidden")}>
          <Marca />
          <div className="flex-1 overflow-y-auto">
            <Navegacion />
          </div>
          <IndicadorModo />
        </aside>

        {/* Barra superior móvil */}
        <header className={cx("sticky top-0 z-30 flex items-center justify-between bg-navy-900 px-4 py-3 lg:hidden", enExamen && "hidden")}>
          <Marca />
          <button aria-label="Abrir menú" onClick={() => setAbierto(true)} className="rounded-lg p-2 text-white hover:bg-white/10">
            <Menu className="h-5 w-5" />
          </button>
        </header>
        {abierto && (
          <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/40" onClick={() => setAbierto(false)} />
            <div className="absolute inset-y-0 left-0 flex w-72 flex-col gap-6 bg-navy-900 p-4">
              <div className="flex items-center justify-between">
                <Marca />
                <button aria-label="Cerrar menú" onClick={() => setAbierto(false)} className="rounded-lg p-2 text-white hover:bg-white/10">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Navegacion alNavegar={() => setAbierto(false)} />
              </div>
              <IndicadorModo />
            </div>
          </div>
        )}

        <main className={cx("px-4 pb-24 pt-6 sm:px-6 lg:pb-10", !enExamen && "lg:ml-64 lg:px-10")}>
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>

        {/* Acceso rápido móvil */}
        {!enExamen && (
          <nav aria-label="Acceso rápido" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-slate-200 bg-white lg:hidden">
            {ACCESO_MOVIL.map(({ href, texto, icono: I }) => {
              const activo = href === "/" ? ruta === "/" : ruta.startsWith(href);
              return (
                <Link key={href} href={href} className={cx("flex flex-col items-center gap-0.5 py-2 text-[11px]", activo ? "text-navy-800" : "text-slate-500")}>
                  <I className="h-5 w-5" aria-hidden />
                  {texto.split(" ")[0]}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </StoreGate>
    </StoreProvider>
  );
}

function StoreGate({ children }: { children: ReactNode }) {
  const { cargando, estado, error, recargar } = useStore();
  if (cargando && !estado) return <div className="grid min-h-screen place-items-center text-sm text-slate-500">Cargando su información…</div>;
  if (!estado)
    return (
      <div className="mx-auto mt-24 max-w-md space-y-4 p-4">
        <Aviso tono="bad">{error ?? "No fue posible cargar la información."}</Aviso>
        <Boton onClick={recargar}>Reintentar</Boton>
      </div>
    );
  return (
    <>
      {error && (
        <div className="fixed right-4 top-4 z-50 max-w-sm">
          <Aviso tono="bad">{error}</Aviso>
        </div>
      )}
      {children}
    </>
  );
}

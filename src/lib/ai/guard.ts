import "server-only";
import { createClient } from "@supabase/supabase-js";
import { ErrorIA } from "./provider";

const ventanas = new Map<string, { inicio: number; n: number }>();

/** Límite simple por cliente: 20 solicitudes por 10 minutos (por instancia del servidor). */
export function limitar(clave: string, max = 20, ventanaMs = 10 * 60_000) {
  const ahora = Date.now();
  const v = ventanas.get(clave);
  if (!v || ahora - v.inicio > ventanaMs) {
    ventanas.set(clave, { inicio: ahora, n: 1 });
    return;
  }
  if (++v.n > max) throw new ErrorIA("Demasiadas solicitudes. Intente de nuevo en unos minutos.", 429);
}

/**
 * Con Supabase configurado, exige un token de sesión válido.
 * Sin Supabase (modo local), permite el uso solo si el servidor tiene la clave de IA (instalación propia).
 */
export async function autorizar(req: Request): Promise<string> {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    limitar(ip);
    return ip;
  }
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) throw new ErrorIA("Inicie sesión para usar el asistente.", 401);
  const sb = createClient(url, anon, { auth: { persistSession: false } });
  const { data, error } = await sb.auth.getUser(token);
  if (error || !data.user) throw new ErrorIA("Sesión inválida.", 401);
  limitar(data.user.id);
  return data.user.id;
}

export function respuestaError(e: unknown) {
  const status = e instanceof ErrorIA ? e.status : 500;
  const mensaje = e instanceof Error ? e.message : "Error inesperado.";
  return Response.json({ error: mensaje }, { status });
}

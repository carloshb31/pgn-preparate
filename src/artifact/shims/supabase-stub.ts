// En el artifact no se usa Supabase: la persistencia es la capacidad `db` de Claude.
import type { Repositorio } from "@/lib/data/repository";

export const supabaseConfigurado = () => false;
export function getSupabase(): never {
  throw new Error("Supabase no está disponible en la versión artifact.");
}
export const repositorioSupabase = null as unknown as Repositorio;

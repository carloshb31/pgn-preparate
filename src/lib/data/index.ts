"use client";

import { repositorioLocal } from "./local";
import { repositorioSupabase, supabaseConfigurado } from "./supabase";
import { repositorioArtifact } from "./artifact";
import { ES_ARTIFACT } from "@/lib/plataforma";
import type { Repositorio } from "./repository";

/**
 * Artifact de Claude: almacenamiento de la cuenta (db). Next.js: Supabase si hay variables
 * de entorno; si no, modo local de demostración claramente identificado.
 */
export function obtenerRepositorio(): Repositorio {
  if (ES_ARTIFACT) return repositorioArtifact;
  return supabaseConfigurado() ? repositorioSupabase : repositorioLocal;
}

export { supabaseConfigurado };

"use client";

/**
 * Servicio de IA del lado del navegador.
 * - Next.js: llama las rutas /api/ai/* (la clave vive en el servidor).
 * - Artifact: usa la capacidad `sample` de Claude, con el uso de la cuenta del propio usuario.
 * En ambos casos se recupera primero contexto (RAG) y se validan las preguntas generadas.
 */
import type { Pregunta } from "@/lib/domain/types";
import { ES_ARTIFACT, capacidad } from "@/lib/plataforma";
import { cabecerasAuth } from "@/components/store";
import { formatearContexto } from "./corpus";
import { SISTEMA_GENERADOR, SISTEMA_TUTOR, consultaDeSolicitud, promptSolicitud, recuperarLocal, validarGeneradas, type Solicitud } from "./nucleo";

export interface FuenteCitada {
  n: number;
  fuenteId: string;
  titulo: string;
  nivel: number;
}
export interface MensajeChat {
  rol: "user" | "assistant";
  contenido: string;
}

export interface ServicioIA {
  estado(): Promise<{ configurado: boolean; detalle: string }>;
  tutor(mensajes: MensajeChat[], alEscribir?: (texto: string) => void, signal?: AbortSignal): Promise<{ texto: string; fuentes: FuenteCitada[] }>;
  generar(sol: Solicitud, signal?: AbortSignal): Promise<{ preguntas: Pregunta[]; descartadas: string[] }>;
}

const iaApi: ServicioIA = {
  async estado() {
    try {
      const j = await (await fetch("/api/ai/estado")).json();
      return { configurado: !!j.configurado, detalle: j.configurado ? `Proveedor: ${j.proveedor}` : "Defina ANTHROPIC_API_KEY y ANTHROPIC_MODEL en .env.local (ver README)." };
    } catch {
      return { configurado: false, detalle: "No fue posible consultar el servidor de IA." };
    }
  },
  async tutor(mensajes) {
    const r = await fetch("/api/ai/tutor", { method: "POST", headers: await cabecerasAuth(), body: JSON.stringify({ mensajes }) });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error);
    return j;
  },
  async generar(sol) {
    const r = await fetch("/api/ai/generar", { method: "POST", headers: await cabecerasAuth(), body: JSON.stringify(sol) });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error);
    return j;
  }
};

type Sample = ((input: string | { role: "user" | "assistant"; content: string }[], opts?: Record<string, unknown>) => Promise<{ text: string; truncated: boolean }>) & {
  json<T>(input: string, opts?: Record<string, unknown>): Promise<T>;
};

const MENSAJE_ERROR: Record<string, string> = {
  not_granted: "No se autorizó el uso de Claude en esta página. Puede habilitarlo en los permisos del artifact.",
  sampling_disabled: "Claude no está disponible para esta cuenta.",
  rate_limited: "Se alcanzó el límite de uso por ahora. Intente de nuevo en unos minutos.",
  session_expired: "Su sesión expiró. Vuelva a iniciar sesión en Claude.",
  refused: "Claude no respondió a esta solicitud. Reformúlela.",
  invalid_json: "La respuesta no llegó en el formato esperado. Intente de nuevo con menos preguntas.",
  prompt_too_large: "La conversación es demasiado larga. Inicie una nueva.",
  cancelled: "Solicitud cancelada."
};
const errorSample = (e: unknown) => new Error(MENSAJE_ERROR[(e as { code?: string })?.code ?? ""] ?? "No fue posible obtener respuesta de Claude. Intente de nuevo.");

const iaArtifact: ServicioIA = {
  async estado() {
    const s = await capacidad<Sample>("sample");
    return s
      ? { configurado: true, detalle: "Usa Claude con su propia cuenta. La primera consulta le pedirá autorización." }
      : { configurado: false, detalle: "Claude no está disponible en esta vista del artifact." };
  },
  async tutor(mensajes, alEscribir, signal) {
    const sample = await capacidad<Sample>("sample");
    if (!sample) throw new Error("Claude no está disponible en esta vista.");
    const ultima = [...mensajes].reverse().find((m) => m.rol === "user")?.contenido ?? "";
    const contexto = recuperarLocal(ultima, undefined, 8);
    const reglas = `${SISTEMA_TUTOR}\n\nCONTEXTO RECUPERADO:\n${formatearContexto(contexto)}`;
    const turnos = [{ role: "user" as const, content: reglas }, ...mensajes.slice(-10).map((m) => ({ role: m.rol, content: m.contenido }))];
    try {
      const r = await sample(turnos, { cache: false, signal, onText: alEscribir ? ({ text }: { text: string }) => alEscribir(text) : undefined });
      return { texto: r.text, fuentes: contexto.map((c, i) => ({ n: i + 1, fuenteId: c.fuenteId, titulo: c.titulo, nivel: c.nivel })) };
    } catch (e) {
      throw errorSample(e);
    }
  },
  async generar(sol, signal) {
    const sample = await capacidad<Sample>("sample");
    if (!sample) throw new Error("Claude no está disponible en esta vista.");
    const { consulta } = consultaDeSolicitud(sol);
    const contexto = recuperarLocal(consulta, sol.temaId, 10);
    if (contexto.length === 0) throw new Error("No se recuperó contexto suficiente para generar con respaldo documental.");
    let bruto: unknown;
    try {
      bruto = await sample.json(`${SISTEMA_GENERADOR}\n\n${promptSolicitud(sol, contexto)}`, { cache: false, signal });
    } catch (e) {
      throw errorSample(e);
    }
    return validarGeneradas(bruto, sol, contexto);
  }
};

export function servicioIA(): ServicioIA {
  return ES_ARTIFACT ? iaArtifact : iaApi;
}

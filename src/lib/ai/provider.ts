import "server-only";

export interface MensajeIA {
  rol: "user" | "assistant";
  contenido: string;
}

export interface ProveedorIA {
  nombre: string;
  configurado(): boolean;
  completar(opts: { sistema: string; mensajes: MensajeIA[]; maxTokens?: number; temperatura?: number }): Promise<string>;
}

export class ErrorIA extends Error {
  constructor(message: string, public status = 500) {
    super(message);
  }
}

/** Implementación para la API de Anthropic (Messages API). La clave nunca sale del servidor. */
export const anthropic: ProveedorIA = {
  nombre: "anthropic",
  configurado: () => Boolean(process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_MODEL),
  async completar({ sistema, mensajes, maxTokens = 2000, temperatura = 0.4 }) {
    if (!this.configurado()) throw new ErrorIA("Defina ANTHROPIC_API_KEY y ANTHROPIC_MODEL en el servidor.", 503);
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL,
        max_tokens: maxTokens,
        temperature: temperatura,
        system: sistema,
        messages: mensajes.map((m) => ({ role: m.rol, content: m.contenido }))
      }),
      signal: AbortSignal.timeout(90_000)
    });
    if (!r.ok) {
      const detalle = await r.text().catch(() => "");
      throw new ErrorIA(`El proveedor de IA respondió ${r.status}. ${detalle.slice(0, 300)}`, 502);
    }
    const data = (await r.json()) as { content?: { type: string; text?: string }[] };
    return (data.content ?? []).filter((c) => c.type === "text").map((c) => c.text).join("\n");
  }
};

const PROVEEDORES: Record<string, ProveedorIA> = { anthropic };

/** Capa de servicio: cambiar de proveedor = registrar otra implementación y cambiar AI_PROVIDER. */
export function proveedorIA(): ProveedorIA {
  const nombre = process.env.AI_PROVIDER || "anthropic";
  const p = PROVEEDORES[nombre];
  if (!p) throw new ErrorIA(`Proveedor de IA desconocido: ${nombre}`, 500);
  return p;
}

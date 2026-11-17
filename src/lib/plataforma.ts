// Diferencias entre el despliegue Next.js y la versión publicada como artifact de Claude.

/** true en el build de un solo archivo publicado como artifact (vite.artifact.config.ts). */
export const ES_ARTIFACT = process.env.NEXT_PUBLIC_DESTINO === "artifact";

/** El visor de artifacts no abre el diálogo de impresión. */
export const PUEDE_IMPRIMIR = !ES_ARTIFACT;

type RuntimeClaude = { use(nombre: string): Promise<unknown> };

/** Capacidad del runtime de artifacts, o null si no está disponible en esta vista. */
export async function capacidad<T>(nombre: string): Promise<T | null> {
  const c = (globalThis as unknown as { claude?: RuntimeClaude }).claude;
  if (!c?.use) return null;
  try {
    return ((await c.use(nombre)) as T) ?? null;
  } catch {
    return null;
  }
}

type Downloads = { save(req: { filename: string; data: string | Blob | ArrayBuffer }): Promise<unknown> };

/** Entrega un archivo al usuario: en el artifact con la capacidad `downloads`, en Next con un enlace. */
export async function guardarArchivo(nombre: string, data: string | Blob, tipo: string): Promise<void> {
  if (ES_ARTIFACT) {
    const d = await capacidad<Downloads>("downloads");
    if (!d) throw new Error("La descarga de archivos no está disponible en esta vista.");
    try {
      await d.save({ filename: nombre, data: typeof data === "string" ? new Blob([data], { type: tipo }) : data });
    } catch (e) {
      const code = (e as { code?: string }).code;
      if (code === "declined" || code === "cancelled") return;
      throw new Error("No fue posible descargar el archivo.");
    }
    return;
  }
  const blob = typeof data === "string" ? new Blob([data], { type: tipo }) : data;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  a.click();
  URL.revokeObjectURL(url);
}

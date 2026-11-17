import "server-only";
import { proveedorIA, ErrorIA } from "./provider";
import { recuperar } from "./rag";
import { formatearContexto } from "./corpus";
import { SISTEMA_GENERADOR, SISTEMA_TUTOR, SolicitudGeneracion, consultaDeSolicitud, extraerJSON, promptSolicitud, validarGeneradas, type Solicitud } from "./nucleo";

export { SolicitudGeneracion };

export async function generarPreguntas(sol: Solicitud) {
  let consulta: string;
  try {
    consulta = consultaDeSolicitud(sol).consulta;
  } catch (e) {
    throw new ErrorIA((e as Error).message, 400);
  }
  const contexto = await recuperar(consulta, sol.temaId, 10);
  if (contexto.length === 0) throw new ErrorIA("No se recuperó contexto suficiente para generar con respaldo documental.", 422);
  const texto = await proveedorIA().completar({
    sistema: SISTEMA_GENERADOR,
    mensajes: [{ rol: "user", contenido: promptSolicitud(sol, contexto) }],
    maxTokens: 1200 * sol.cantidad
  });
  try {
    const r = validarGeneradas(extraerJSON(texto), sol, contexto);
    return { ...r, contexto };
  } catch (e) {
    throw new ErrorIA((e as Error).message, 502);
  }
}

export async function responderTutor(mensajes: { rol: "user" | "assistant"; contenido: string }[]) {
  const ultima = [...mensajes].reverse().find((m) => m.rol === "user")?.contenido ?? "";
  const contexto = await recuperar(ultima, undefined, 8);
  const texto = await proveedorIA().completar({
    sistema: `${SISTEMA_TUTOR}\n\nCONTEXTO:\n${formatearContexto(contexto)}`,
    mensajes: mensajes.slice(-10),
    maxTokens: 900,
    temperatura: 0.3
  });
  return { texto, fuentes: contexto.map((c, i) => ({ n: i + 1, fuenteId: c.fuenteId, titulo: c.titulo, nivel: c.nivel })) };
}

import { SolicitudGeneracion, generarPreguntas } from "@/lib/ai/generacion";
import { autorizar, respuestaError } from "@/lib/ai/guard";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await autorizar(req);
    const sol = SolicitudGeneracion.safeParse(await req.json());
    if (!sol.success) return Response.json({ error: "Solicitud inválida.", detalle: sol.error.flatten() }, { status: 400 });
    return Response.json(await generarPreguntas(sol.data));
  } catch (e) {
    return respuestaError(e);
  }
}

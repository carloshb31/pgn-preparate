import { z } from "zod";
import { responderTutor } from "@/lib/ai/generacion";
import { autorizar, respuestaError } from "@/lib/ai/guard";

export const dynamic = "force-dynamic";

const Cuerpo = z.object({
  mensajes: z.array(z.object({ rol: z.enum(["user", "assistant"]), contenido: z.string().min(1).max(4000) })).min(1).max(20)
});

export async function POST(req: Request) {
  try {
    await autorizar(req);
    const c = Cuerpo.safeParse(await req.json());
    if (!c.success) return Response.json({ error: "Solicitud inválida." }, { status: 400 });
    return Response.json(await responderTutor(c.data.mensajes));
  } catch (e) {
    return respuestaError(e);
  }
}

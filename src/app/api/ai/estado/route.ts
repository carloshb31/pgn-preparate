import { proveedorIA } from "@/lib/ai/provider";

export const dynamic = "force-dynamic";

export function GET() {
  const p = proveedorIA();
  return Response.json({ proveedor: p.nombre, configurado: p.configurado() });
}

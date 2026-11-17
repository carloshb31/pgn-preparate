import { MATERIAL_M1 } from "./material/m1";
import { MATERIAL_M2_M5 } from "./material/m2-m5";
import { MATERIAL_M6_M9 } from "./material/m6-m9";
import type { MaterialTema } from "./material/tipos";

export type { MaterialTema, PuntoMaterial } from "./material/tipos";

export const MATERIAL: MaterialTema[] = [...MATERIAL_M1, ...MATERIAL_M2_M5, ...MATERIAL_M6_M9];
export const MATERIAL_POR_TEMA: Record<string, MaterialTema> = Object.fromEntries(MATERIAL.map((m) => [m.temaId, m]));

import type {
  ActividadEstudio,
  Ajustes,
  CategoriaBiblioteca,
  ConfigPlan,
  DocumentoUsuario,
  EstadoRepaso,
  Ficha,
  Intento,
  Pregunta,
  ResultadoComportamental
} from "@/lib/domain/types";
import { PONDERACIONES_OFICIALES } from "@/lib/config/convocatoria";

export interface EstadoApp {
  preguntas: Pregunta[];
  intentos: Intento[];
  planConfig: ConfigPlan | null;
  actividades: ActividadEstudio[];
  repasos: EstadoRepaso[];
  fichas: Ficha[];
  documentos: DocumentoUsuario[];
  ajustes: Ajustes;
  comportamentales: ResultadoComportamental[];
  esAdmin: boolean;
  usuario: { id: string; email: string | null } | null;
}

export const AJUSTES_INICIALES: Ajustes = {
  ponderaciones: PONDERACIONES_OFICIALES,
  antecedentesOficial: null,
  minutosEstudioManual: 0
};

export type ModoDatos = "local" | "supabase" | "artifact";

/** Contrato de persistencia. La UI nunca habla directamente con localStorage ni con Supabase. */
export interface Repositorio {
  modo: ModoDatos;
  cargar(): Promise<EstadoApp>;
  guardarIntento(i: Intento): Promise<void>;
  guardarPlan(cfg: ConfigPlan, actividades: ActividadEstudio[]): Promise<void>;
  actualizarActividad(a: ActividadEstudio): Promise<void>;
  guardarRepasos(estados: EstadoRepaso[]): Promise<void>;
  guardarFicha(f: Ficha): Promise<void>;
  borrarFicha(id: string): Promise<void>;
  guardarAjustes(a: Ajustes): Promise<void>;
  guardarComportamental(r: ResultadoComportamental): Promise<void>;
  /** Alta o actualización de preguntas (importación, IA, cambios de estado). */
  guardarPreguntas(ps: Pregunta[]): Promise<void>;
  subirDocumento(archivo: File, categoria: CategoriaBiblioteca): Promise<DocumentoUsuario>;
  urlDocumento(doc: DocumentoUsuario): Promise<string>;
  borrarDocumento(doc: DocumentoUsuario): Promise<void>;
  registrar(accion: string, detalle?: Record<string, unknown>): Promise<void>;
  /** Exporta todo lo del usuario como respaldo JSON. */
  exportar(): Promise<string>;
  restablecer?(): Promise<void>;
}

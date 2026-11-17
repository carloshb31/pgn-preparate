// Tipos de dominio de PGN PREPÁRATE.
// Regla: todo lo que proviene de documentos oficiales se marca con `origen: "oficial"`;
// lo que es solo para práctica se marca `origen: "simulacro"`.

export type ModuloId =
  | "M1_SEGURIDAD"
  | "M2_REDES"
  | "M3_SO"
  | "M4_CLOUD_ARQ"
  | "M5_CONTINUIDAD"
  | "M6_PROYECTOS"
  | "M7_INSTITUCIONAL"
  | "M8_NORMATIVA_TIC"
  | "M9_COMPORTAMENTALES";

export type Nucleo = "general" | "especifico";
export type Dificultad = 1 | 2 | 3 | 4 | 5; // 1 básica … 5 experta

export type TipoPregunta =
  | "conceptual"
  | "normativa"
  | "interpretacion"
  | "escenario"
  | "resolucion_problemas"
  | "decision_tecnica"
  | "asesoria_institucional"
  | "caso_ciberseguridad";

export type EstadoPregunta =
  | "borrador_ia"
  | "pendiente_revision"
  | "validada"
  | "publicada"
  | "descartada";

export type NivelAutoridad = 1 | 2 | 3 | 4;

export interface Fuente {
  id: string;
  titulo: string;
  emisor: string;
  nivel: NivelAutoridad; // 1 oficial · 2 estándar · 3 técnica · 4 comunitaria
  categoria: CategoriaBiblioteca;
  url?: string;
  /** null = no verificada todavía por una persona. Nunca se autocompleta. */
  fechaVerificacion: string | null;
  notas?: string;
}

export type CategoriaBiblioteca =
  | "convocatoria"
  | "resoluciones"
  | "legislacion"
  | "seguridad"
  | "ciberseguridad"
  | "redes"
  | "sistemas_operativos"
  | "cloud"
  | "continuidad"
  | "arquitectura"
  | "gestion_publica"
  | "comportamentales";

export interface Opcion {
  id: string; // "A" | "B" | "C" | "D"
  texto: string;
  /** Por qué es correcta o incorrecta. */
  justificacion: string;
}

export interface Pregunta {
  id: string;
  modulo: ModuloId;
  /** id del tema en el temario (src/lib/content/temario.ts). */
  temaId: string;
  subtema?: string;
  nucleo: Nucleo;
  dificultad: Dificultad;
  tipo: TipoPregunta;
  enunciado: string;
  opciones: Opcion[];
  correcta: string;
  explicacion: string;
  fuenteId: string;
  /** Artículo, control o apartado. Vacío si la pregunta es inferencia académica. */
  referencia?: string;
  /** true = la respuesta es una inferencia técnica/académica y no una disposición literal. */
  esInferencia: boolean;
  competencia?: string;
  etiquetas: string[];
  estado: EstadoPregunta;
  autor: "semilla" | "ia" | "usuario" | "admin";
}

export interface Tema {
  id: string;
  nombre: string;
  /**
   * conocimiento_esencial = listado literal en secciones 4 o 5 del formato.
   * funcion = se deriva de una función del empleo (sección 3).
   * complementario = contenido de apoyo no exigido expresamente.
   */
  fundamento: "conocimiento_esencial" | "funcion" | "complementario";
  subtemas: string[];
}

export interface Modulo {
  id: ModuloId;
  numero: number;
  nombre: string;
  nucleo: Nucleo;
  prioridadBase: 1 | 2 | 3 | 4 | 5;
  /** Ítem(s) literales del formato de convocatoria a los que responde. */
  fundamentoConvocatoria: string[];
  descripcion: string;
  temas: Tema[];
}

// ---------- Intentos y simulacros ----------

export type ModalidadSimulacro =
  | "general"
  | "especifico"
  | "modulo"
  | "comportamental"
  | "integral"
  | "personalizado";

export interface ConfigSimulacro {
  modalidad: ModalidadSimulacro;
  cantidad: number;
  duracionMin: number;
  dificultades: Dificultad[];
  modulos: ModuloId[];
  aleatorizarPreguntas: boolean;
  aleatorizarOpciones: boolean;
  incluirNoValidadas: boolean;
  /** true = respuesta suelta desde el banco (retroalimentación inmediata); no cuenta como simulacro. */
  practica?: boolean;
}

export interface RespuestaIntento {
  preguntaId: string;
  seleccion: string | null;
  correcta: boolean;
  marcada: boolean;
  segundos: number;
}

export interface Intento {
  id: string;
  inicio: string;
  fin: string | null;
  config: ConfigSimulacro;
  /** Orden de preguntas y de opciones congelado al iniciar. */
  orden: { preguntaId: string; opciones: string[] }[];
  respuestas: RespuestaIntento[];
  puntaje: number | null; // 0-100
  finalizado: boolean;
}

// ---------- Estudio ----------

export type TipoActividad = "lectura" | "practica" | "cuestionario" | "simulacro_parcial" | "simulacro_integral" | "repaso";

export interface ActividadEstudio {
  id: string;
  fecha: string; // YYYY-MM-DD
  modulo: ModuloId | null;
  tipo: TipoActividad;
  titulo: string;
  minutos: number;
  completada: boolean;
  reprogramadaDesde?: string;
}

export interface ConfigPlan {
  fechaExamen: string | null; // la ingresa el usuario; nunca se inventa
  fechaInicio: string;
  horasPorDia: number;
  diasPorSemana: number;
  minutosPorSesion: number;
  nivelInicial: "basico" | "intermedio" | "avanzado";
  prioridades: Record<ModuloId, number>;
}

export interface EstadoRepaso {
  preguntaId: string;
  facilidad: number; // SM-2 ease factor
  intervaloDias: number;
  repeticiones: number;
  proxima: string; // YYYY-MM-DD
}

export interface Ficha {
  id: string;
  titulo: string;
  modulo: ModuloId | null;
  contenido: string;
  fuenteId?: string;
  creada: string;
}

export interface DocumentoUsuario {
  id: string;
  nombre: string;
  categoria: CategoriaBiblioteca;
  tamano: number;
  subido: string;
  /** Ruta en Supabase Storage, id del asset en el artifact o clave IndexedDB en modo local. */
  ruta: string;
  /** URL directa cuando el almacenamiento la entrega (assets del artifact). */
  url?: string;
}

export interface Ponderaciones {
  conocimientos: number;
  comportamentales: number;
  antecedentes: number;
  minimoConocimientos: number;
  minimoElegibles: number;
}

export interface Ajustes {
  ponderaciones: Ponderaciones;
  /** Puntaje oficial de antecedentes si existe; null = pendiente. */
  antecedentesOficial: number | null;
  minutosEstudioManual: number;
}

export interface ResultadoComportamental {
  id: string;
  fecha: string;
  porCompetencia: Record<string, { obtenido: number; maximo: number }>;
  total: number; // 0-100
}

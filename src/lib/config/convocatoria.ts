import type { Ponderaciones } from "@/lib/domain/types";

/**
 * Datos OFICIALES tomados del Formato de Convocatoria 51-2026, versión 3
 * (Resolución 212 de 2026, fecha de fijación 24 de marzo de 2026).
 * Cualquier cambio aquí debe tener respaldo en un acto administrativo publicado.
 */
export const CONVOCATORIA = {
  entidad: "Procuraduría General de la Nación",
  codigo: "51-2026",
  version: 3,
  resolucionVersion: "Resolución 212 de 2026",
  denominacion: "Asesor",
  codigoGrado: "1AS-19",
  nivel: "Asesor",
  dependencia: "Oficina de Tecnología, Innovación y Transformación Digital",
  proceso: "Tecnología de la Información",
  vacantes: 3,
  ubicacion: "Bogotá (planta global)",
  asignacionBasica: 10403514,
  asignacionVigencia: "Vigencia 2025",
  portal: "https://meritoconstruyendoexcelencia.com.co",
  documentosRectores: [
    "Formato de Convocatoria 51-2026, versión 3",
    "Resolución 076 de 2026 (reglas del proceso de selección)",
    "Resolución 108 de 2026",
    "Resolución 133 de 2026",
    "Resolución 212 de 2026",
    "Resolución 243 de 2026"
  ],
  proposito:
    "Asesorar en el análisis, definición e implementación del modelo, políticas y servicios tecnológicos de administración y gestión de seguridad informática y de ciberseguridad; así como, en el uso de los activos de información que la conforman, de acuerdo con las directrices definidas por la entidad, las mejores prácticas y las normas vigentes."
} as const;

/** Ponderaciones oficiales (sección 8 del formato). Editables en Configuración/Admin. */
export const PONDERACIONES_OFICIALES: Ponderaciones = {
  conocimientos: 0.7,
  comportamentales: 0.2,
  antecedentes: 0.1,
  minimoConocimientos: 65,
  minimoElegibles: 70
};

/**
 * Parámetros de la prueba escrita que AÚN NO son oficiales.
 * null = no publicado. Se actualizan cuando salga la guía de orientación al aspirante.
 */
export const PARAMETROS_PRUEBA_OFICIAL = {
  numeroPreguntas: null as number | null,
  duracionMinutos: null as number | null,
  distribucionNucleos: null as { general: number; especifico: number } | null,
  fechaPrueba: null as string | null
};

/**
 * Reglas de la Resolución 076 de 2026 leídas en el portal oficial el 10/11/2026
 * (artículos 18 a 21, 27 y 28). La Resolución 243 de 2026 modifica el artículo 2 (empleos), no estas reglas.
 */
export const REGLAS_RES_076 = [
  { articulo: "Art. 18", texto: "Conocimientos y competencias comportamentales son pruebas escritas, aplicadas el mismo día a todos los aspirantes y evaluadas en una escala estándar de 0 a 100." },
  { articulo: "Art. 18", texto: "Los resultados se obtienen por lectura óptica y se valoran estadísticamente para obtener una calificación normal estándar. El método se detallará en la Guía de Orientación al aspirante." },
  { articulo: "Art. 19", texto: "La prueba de conocimientos es eliminatoria, tiene un núcleo general y uno específico, y se aprueba con 65 puntos o más. Pesa 70 % para el nivel asesor." },
  { articulo: "Art. 20", texto: "La prueba de competencias comportamentales es escrita y clasificatoria (20 %). Sus resultados solo se publican a quienes superen la prueba de conocimientos." },
  { articulo: "Art. 21", texto: "La citación con día, hora y lugar se publica en meritoconstruyendoexcelencia.com.co. Las dos pruebas escritas se aplican simultáneamente en la capital de departamento elegida en la inscripción." },
  { articulo: "Art. 21, parágrafo", texto: "Las fechas y horas de las pruebas no se reprograman por situaciones particulares, caso fortuito ni fuerza mayor." },
  { articulo: "Art. 27", texto: "El análisis de antecedentes solo se aplica a quienes superen la prueba de conocimientos. Se califica de 0 a 100 con dos decimales truncados." },
  { articulo: "Art. 28", texto: "Factores de antecedentes para el nivel asesor: educación formal 40 puntos, educación para el trabajo y el desarrollo humano 20 puntos, experiencia profesional o docente 40 puntos." }
] as const;

/** Cronograma VRM publicado por la PGN y la Universidad de Antioquia (aviso del 09/10/2026). */
export const CRONOGRAMA_OFICIAL = [
  { id: 1, actividad: "Lista de admitidos y no admitidos", inicio: "2026-10-30", fin: null },
  { id: 2, actividad: "Reclamaciones sobre la lista de admitidos y no admitidos", inicio: "2026-11-03", fin: "2026-11-04" },
  { id: 3, actividad: "Decisión de reclamaciones", inicio: "2026-11-11", fin: null },
  { id: 4, actividad: "Publicación decisión de reclamaciones", inicio: "2026-11-12", fin: "2026-11-13" },
  { id: 5, actividad: "Término para interponer apelación", inicio: "2026-11-17", fin: null },
  { id: 6, actividad: "Decisión de recursos de apelación", inicio: "2026-11-27", fin: null },
  { id: 7, actividad: "Publicación decisión de recursos de apelación", inicio: "2026-11-30", fin: null },
  { id: 8, actividad: "Publicación lista DEFINITIVA de admitidos", inicio: "2026-11-30", fin: null }
] as const;

export const COMPETENCIAS_OFICIALES = [
  { id: "responsabilidad_organizacion", nombre: "Responsabilidad con la organización", nivel: "B", grupo: "Transversal" },
  { id: "organizacion_trabajo", nombre: "Organización del trabajo", nivel: "B", grupo: "Transversal" },
  { id: "investigacion", nombre: "Investigación", nivel: "B", grupo: "Por perfil del cargo" },
  { id: "pensamiento_conceptual", nombre: "Pensamiento conceptual", nivel: "A", grupo: "Por perfil del cargo" },
  { id: "orientacion_resultados", nombre: "Orientación a resultados", nivel: "A", grupo: "Por perfil del cargo" },
  { id: "cumplimiento_parametros", nombre: "Cumplimiento de parámetros de trabajo", nivel: "B", grupo: "Por perfil del cargo" },
  { id: "creatividad_innovacion", nombre: "Creatividad e innovación", nivel: "C", grupo: "Por perfil del cargo" }
] as const;

export type CompetenciaId = (typeof COMPETENCIAS_OFICIALES)[number]["id"];

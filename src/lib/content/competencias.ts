import type { CompetenciaId } from "@/lib/config/convocatoria";

/**
 * Casos situacionales de práctica. No hay una única respuesta "correcta":
 * cada opción tiene una puntuación de 0 a 3 por competencia y una retroalimentación.
 * Las puntuaciones son criterio académico de práctica y deben contrastarse con el
 * Diccionario de Competencias Comportamentales de la PGN cuando esté disponible en la biblioteca.
 */
export interface OpcionSJT {
  id: string;
  texto: string;
  puntos: Partial<Record<CompetenciaId, 0 | 1 | 2 | 3>>;
  retro: string;
}

export interface CasoSJT {
  id: string;
  titulo: string;
  situacion: string;
  competencias: CompetenciaId[];
  opciones: OpcionSJT[];
  estado: "pendiente_revision" | "validada";
}

export const CASOS_SJT: CasoSJT[] = [
  {
    id: "SJT-01",
    titulo: "Incidente que afecta servicios institucionales",
    situacion:
      "Un viernes a las 6:00 p. m. el SIEM alerta cifrado masivo de archivos en un servidor de la sede de una regional. Su jefe está de vacaciones y el protocolo de incidentes exige notificar al responsable designado. El equipo técnico propone apagar todos los servidores de la regional.",
    competencias: ["responsabilidad_organizacion", "cumplimiento_parametros", "orientacion_resultados"],
    opciones: [
      { id: "a", texto: "Activo el procedimiento de gestión de incidentes, notifico al responsable designado y coordino el aislamiento de red del servidor afectado mientras se preserva evidencia.", puntos: { responsabilidad_organizacion: 3, cumplimiento_parametros: 3, orientacion_resultados: 3 }, retro: "Equilibra contención rápida, cumplimiento del protocolo y preservación de evidencia." },
      { id: "b", texto: "Autorizo apagar todos los servidores de la regional para detener el ataque y el lunes informo lo sucedido.", puntos: { responsabilidad_organizacion: 1, cumplimiento_parametros: 0, orientacion_resultados: 1 }, retro: "Actúa rápido, pero omite el protocolo, amplía la afectación del servicio y destruye evidencia volátil." },
      { id: "c", texto: "Espero a que mi jefe regrese para no tomar decisiones fuera de mi competencia.", puntos: { responsabilidad_organizacion: 0, cumplimiento_parametros: 1, orientacion_resultados: 0 }, retro: "El protocolo prevé responsables alternos; esperar permite que el incidente se extienda." },
      { id: "d", texto: "Pido al equipo que restaure inmediatamente desde el último respaldo para recuperar el servicio esta misma noche.", puntos: { responsabilidad_organizacion: 1, cumplimiento_parametros: 1, orientacion_resultados: 2 }, retro: "Busca el resultado, pero restaurar sin contener ni erradicar puede reinfectar el entorno." }
    ],
    estado: "pendiente_revision"
  },
  {
    id: "SJT-02",
    titulo: "Proveedor incumple un SLA crítico",
    situacion:
      "Por tercer mes consecutivo, el proveedor de monitoreo de seguridad incumple el tiempo de atención de incidentes de prioridad 1 pactado en el contrato. El supervisor del contrato le pide un concepto.",
    competencias: ["investigacion", "cumplimiento_parametros", "orientacion_resultados"],
    opciones: [
      { id: "a", texto: "Reviso la evidencia de los tres meses frente a la cláusula del SLA, identifico causas con el proveedor y recomiendo al supervisor las acciones contractuales previstas y un plan de mejora con fechas.", puntos: { investigacion: 3, cumplimiento_parametros: 3, orientacion_resultados: 3 }, retro: "Basa el concepto en evidencia y en el contrato, y orienta a corregir el servicio." },
      { id: "b", texto: "Recomiendo terminar el contrato de inmediato.", puntos: { investigacion: 0, cumplimiento_parametros: 1, orientacion_resultados: 1 }, retro: "Puede ser desproporcionado sin análisis ni procedimiento contractual, y deja a la entidad sin servicio." },
      { id: "c", texto: "Llamo al gerente del proveedor para que mejore, sin dejar registro formal.", puntos: { investigacion: 1, cumplimiento_parametros: 0, orientacion_resultados: 1 }, retro: "Sin registro formal se pierde trazabilidad para la supervisión del contrato." },
      { id: "d", texto: "Propongo ajustar el SLA para que el proveedor pueda cumplirlo.", puntos: { investigacion: 0, cumplimiento_parametros: 0, orientacion_resultados: 0 }, retro: "Bajar el nivel exigido sin justificación técnica sacrifica la protección de la entidad." }
    ],
    estado: "pendiente_revision"
  },
  {
    id: "SJT-03",
    titulo: "Vulnerabilidad que exige intervención urgente",
    situacion:
      "Se publica una vulnerabilidad crítica con explotación activa en el sistema de acceso remoto que usan todas las sedes. El parche requiere reiniciar el servicio en horario laboral, y una dependencia misional se opone porque tiene audiencias virtuales programadas.",
    competencias: ["orientacion_resultados", "pensamiento_conceptual", "organizacion_trabajo"],
    opciones: [
      { id: "a", texto: "Analizo el riesgo, aplico una mitigación temporal recomendada por el fabricante y acuerdo con la dependencia una ventana corta y comunicada para el parche dentro de las próximas horas.", puntos: { orientacion_resultados: 3, pensamiento_conceptual: 3, organizacion_trabajo: 3 }, retro: "Reduce la exposición de inmediato y concilia la continuidad del servicio." },
      { id: "b", texto: "Aplico el parche de inmediato sin avisar, porque la seguridad prima.", puntos: { orientacion_resultados: 2, pensamiento_conceptual: 1, organizacion_trabajo: 0 }, retro: "Corrige el riesgo, pero afecta audiencias sin coordinación." },
      { id: "c", texto: "Pospongo el parche hasta el fin de semana para no afectar a nadie.", puntos: { orientacion_resultados: 1, pensamiento_conceptual: 1, organizacion_trabajo: 1 }, retro: "Deja días de exposición a un ataque activo sin mitigación." },
      { id: "d", texto: "Escalo el tema al comité y espero su decisión en la próxima sesión ordinaria.", puntos: { orientacion_resultados: 0, pensamiento_conceptual: 1, organizacion_trabajo: 1 }, retro: "La urgencia no permite esperar una sesión ordinaria." }
    ],
    estado: "pendiente_revision"
  },
  {
    id: "SJT-04",
    titulo: "Dos dependencias con prioridades contrapuestas",
    situacion:
      "La dependencia de investigaciones pide habilitar el uso de memorias USB para recibir pruebas, y la política vigente las bloquea. La oficina jurídica insiste en mantener el bloqueo total.",
    competencias: ["creatividad_innovacion", "pensamiento_conceptual", "responsabilidad_organizacion"],
    opciones: [
      { id: "a", texto: "Propongo una estación de recepción aislada con análisis antimalware y registro de cadena de custodia, que habilite la necesidad sin abrir el uso general de USB.", puntos: { creatividad_innovacion: 3, pensamiento_conceptual: 3, responsabilidad_organizacion: 3 }, retro: "Diseña una alternativa que atiende ambos intereses y mantiene el control." },
      { id: "b", texto: "Mantengo el bloqueo porque la política lo dice.", puntos: { creatividad_innovacion: 0, pensamiento_conceptual: 1, responsabilidad_organizacion: 2 }, retro: "Cumple la norma interna, pero deja sin resolver una necesidad misional legítima." },
      { id: "c", texto: "Habilito USB solo para esa dependencia.", puntos: { creatividad_innovacion: 1, pensamiento_conceptual: 0, responsabilidad_organizacion: 0 }, retro: "Crea una excepción sin controles compensatorios ni aprobación." },
      { id: "d", texto: "Pido a cada dependencia que presente su posición por escrito al jefe.", puntos: { creatividad_innovacion: 0, pensamiento_conceptual: 1, responsabilidad_organizacion: 1 }, retro: "Traslada el problema sin aportar una alternativa técnica." }
    ],
    estado: "pendiente_revision"
  },
  {
    id: "SJT-05",
    titulo: "Proyecto con desviación presupuestal",
    situacion:
      "A mitad de la ejecución, el proyecto de renovación de firewalls muestra un sobrecosto proyectado del 18 % por la tasa de cambio. Usted lidera el seguimiento.",
    competencias: ["orientacion_resultados", "organizacion_trabajo", "investigacion"],
    opciones: [
      { id: "a", texto: "Cuantifico el impacto, analizo alternativas (alcance por fases, cambio de licenciamiento, recursos adicionales) y presento al jefe un informe con recomendación y riesgos.", puntos: { orientacion_resultados: 3, organizacion_trabajo: 3, investigacion: 3 }, retro: "Aporta datos y opciones para decidir a tiempo." },
      { id: "b", texto: "Reduzco el alcance por mi cuenta para mantener el presupuesto.", puntos: { orientacion_resultados: 1, organizacion_trabajo: 1, investigacion: 0 }, retro: "Toma una decisión que corresponde a otras instancias, sin análisis." },
      { id: "c", texto: "Informo el sobrecosto cuando termine la ejecución.", puntos: { orientacion_resultados: 0, organizacion_trabajo: 0, investigacion: 0 }, retro: "Informar tarde elimina las opciones de corrección." },
      { id: "d", texto: "Informo el sobrecosto de inmediato, sin propuestas, para que el jefe decida.", puntos: { orientacion_resultados: 1, organizacion_trabajo: 2, investigacion: 1 }, retro: "Es oportuno, pero un asesor debe aportar análisis y alternativas." }
    ],
    estado: "pendiente_revision"
  },
  {
    id: "SJT-06",
    titulo: "Concepto técnico a un superior",
    situacion:
      "El jefe de la oficina le pide en dos días un concepto sobre si migrar el correo institucional a un servicio en la nube. Hay opiniones encontradas en el equipo.",
    competencias: ["pensamiento_conceptual", "investigacion", "organizacion_trabajo"],
    opciones: [
      { id: "a", texto: "Defino criterios (seguridad, cumplimiento normativo, costo total, continuidad, residencia de datos), recopilo evidencia y entrego un concepto breve con recomendación, supuestos y riesgos.", puntos: { pensamiento_conceptual: 3, investigacion: 3, organizacion_trabajo: 3 }, retro: "Estructura el problema y fundamenta la recomendación." },
      { id: "b", texto: "Recomiendo la opción que prefiere la mayoría del equipo.", puntos: { pensamiento_conceptual: 0, investigacion: 0, organizacion_trabajo: 1 }, retro: "La mayoría no reemplaza el análisis técnico." },
      { id: "c", texto: "Pido un mes adicional para hacer un estudio exhaustivo.", puntos: { pensamiento_conceptual: 1, investigacion: 2, organizacion_trabajo: 0 }, retro: "Desconoce el plazo; se puede entregar un concepto con alcance definido y supuestos explícitos." },
      { id: "d", texto: "Copio un concepto de otra entidad pública.", puntos: { pensamiento_conceptual: 0, investigacion: 1, organizacion_trabajo: 1 }, retro: "Sirve como referencia, pero cada entidad tiene su propio contexto y requisitos." }
    ],
    estado: "pendiente_revision"
  },
  {
    id: "SJT-07",
    titulo: "Política de seguridad que no se aplica",
    situacion:
      "Una auditoría encuentra que el 40 % de los equipos no tiene el bloqueo de pantalla que exige la política de seguridad. Las dependencias dicen que les estorba en audiencias.",
    competencias: ["cumplimiento_parametros", "creatividad_innovacion", "responsabilidad_organizacion"],
    opciones: [
      { id: "a", texto: "Analizo las causas, aplico el control por directiva de grupo con un tiempo ajustado para salas de audiencia aprobado como excepción documentada, y acompaño con sensibilización.", puntos: { cumplimiento_parametros: 3, creatividad_innovacion: 2, responsabilidad_organizacion: 3 }, retro: "Hace cumplir la política con un control técnico y gestiona la excepción formalmente." },
      { id: "b", texto: "Envío un correo masivo recordando la política.", puntos: { cumplimiento_parametros: 1, creatividad_innovacion: 0, responsabilidad_organizacion: 1 }, retro: "Un recordatorio sin control técnico rara vez cambia el comportamiento." },
      { id: "c", texto: "Elimino el requisito de la política porque no se cumple.", puntos: { cumplimiento_parametros: 0, creatividad_innovacion: 0, responsabilidad_organizacion: 0 }, retro: "Debilita la seguridad sin análisis de riesgo." },
      { id: "d", texto: "Reporto a las dependencias a control disciplinario.", puntos: { cumplimiento_parametros: 2, creatividad_innovacion: 0, responsabilidad_organizacion: 1 }, retro: "Puede ser procedente en otros casos, pero no resuelve la causa." }
    ],
    estado: "pendiente_revision"
  },
  {
    id: "SJT-08",
    titulo: "Priorizar recursos limitados",
    situacion:
      "El presupuesto alcanza solo para una de tres iniciativas: renovar el EDR, implementar MFA para todos los usuarios o contratar pruebas de penetración anuales.",
    competencias: ["pensamiento_conceptual", "orientacion_resultados", "investigacion"],
    opciones: [
      { id: "a", texto: "Comparo las iniciativas por reducción de riesgo frente a las amenazas más probables, costo y dependencias, y presento una priorización con criterios explícitos.", puntos: { pensamiento_conceptual: 3, orientacion_resultados: 3, investigacion: 3 }, retro: "La priorización basada en riesgo es defendible y trazable." },
      { id: "b", texto: "Elijo la más barata para que sobre presupuesto.", puntos: { pensamiento_conceptual: 0, orientacion_resultados: 1, investigacion: 0 }, retro: "El costo solo no indica valor." },
      { id: "c", texto: "Divido el presupuesto en tres partes iguales.", puntos: { pensamiento_conceptual: 0, orientacion_resultados: 0, investigacion: 0 }, retro: "Ninguna iniciativa quedaría completa." },
      { id: "d", texto: "Elijo la que recomienda el proveedor actual.", puntos: { pensamiento_conceptual: 0, orientacion_resultados: 1, investigacion: 1 }, retro: "Puede haber conflicto de interés; la decisión debe basarse en el análisis de la entidad." }
    ],
    estado: "pendiente_revision"
  }
];

export function calificarSJT(respuestas: Record<string, string>) {
  const acumulado: Record<string, { obtenido: number; maximo: number }> = {};
  for (const caso of CASOS_SJT) {
    const sel = caso.opciones.find((o) => o.id === respuestas[caso.id]);
    for (const c of caso.competencias) {
      const a = (acumulado[c] ??= { obtenido: 0, maximo: 0 });
      a.maximo += 3;
      a.obtenido += sel?.puntos[c] ?? 0;
    }
  }
  const obt = Object.values(acumulado).reduce((s, x) => s + x.obtenido, 0);
  const max = Object.values(acumulado).reduce((s, x) => s + x.maximo, 0);
  return { porCompetencia: acumulado, total: max ? Math.round((obt / max) * 1000) / 10 : 0 };
}

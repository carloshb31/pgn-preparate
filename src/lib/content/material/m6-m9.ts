import type { MaterialTema } from "./tipos";

export const MATERIAL_M6_M9: MaterialTema[] = [
  // ---------- M6 Proyectos ----------
  {
    temaId: "m6-form",
    resumen: "Formular un proyecto tecnológico público es justificar el problema, las alternativas, la mejor solución y su financiación.",
    puntos: [
      { texto: "En Colombia, los proyectos de inversión pública se formulan con la Metodología General Ajustada (MGA) del DNP.", fuenteId: "academico" },
      { texto: "La matriz de marco lógico ordena fin, propósito, componentes y actividades con indicadores y supuestos.", fuenteId: "academico" },
      { texto: "Evaluación financiera: VPN (positivo crea valor a la tasa exigida), TIR (tasa que hace el VPN igual a cero), relación beneficio/costo y periodo de recuperación.", fuenteId: "academico" }
    ]
  },
  {
    temaId: "m6-pm",
    resumen: "La gestión de proyectos combina enfoques predictivos y ágiles según la incertidumbre del alcance.",
    puntos: [
      { texto: "PMBOK 7.ª edición: 12 principios y 8 dominios de desempeño. Verifique la edición vigente.", fuenteId: "pmbok" },
      { texto: "Valor ganado: CPI = EV / AC (eficiencia de costo), SPI = EV / PV (eficiencia de cronograma). Menor que 1 indica sobrecosto o atraso.", fuenteId: "academico" },
      { texto: "Scrum: tres responsabilidades (Product Owner, Scrum Master y Developers), cinco eventos (Sprint, Sprint Planning, Daily Scrum, Sprint Review y Sprint Retrospective) y tres artefactos con sus compromisos (Product Backlog y Product Goal, Sprint Backlog y Sprint Goal, Increment y Definition of Done).", fuenteId: "scrum-guide" }
    ]
  },
  {
    temaId: "m6-ind",
    resumen: "Los indicadores permiten demostrar resultados y tomar decisiones; deben medir efectos, no solo actividad.",
    puntos: [
      { texto: "Ficha del indicador: nombre, fórmula, unidad, meta, frecuencia, fuente de datos y responsable.", fuenteId: "academico" },
      { texto: "Eficacia mide el logro de metas; eficiencia, el uso de recursos; efectividad, el impacto.", fuenteId: "academico" },
      { texto: "SLA: acuerdo con el cliente o con un proveedor externo. OLA: acuerdo entre áreas internas. Contrato de soporte: el que respalda el SLA con un tercero.", fuenteId: "academico" }
    ]
  },
  {
    temaId: "m6-contr",
    resumen: "La adquisición de tecnología en el Estado sigue el régimen de contratación pública y debe partir de un análisis de necesidad.",
    puntos: [
      { texto: "Estatuto General de Contratación: Ley 80 de 1993, complementado por la Ley 1150 de 2007.", fuenteId: "ley-80-1993" },
      { texto: "Modalidades: licitación pública, selección abreviada, concurso de méritos, contratación directa y mínima cuantía.", fuenteId: "ley-1150-2007" },
      { texto: "Colombia Compra Eficiente administra los Acuerdos Marco de Precios (Tienda Virtual del Estado) y el SECOP II.", fuenteId: "academico" },
      { texto: "La función 9 del empleo pide identificar necesidades y apoyar procesos de contratación de la plataforma de seguridad.", fuenteId: "conv-51-2026", referencia: "Función 9" }
    ]
  },
  // ---------- M7 Institucional ----------
  {
    temaId: "m7-const",
    resumen: "La Constitución define la Procuraduría como cabeza del Ministerio Público, órgano de control independiente de las ramas del poder.",
    puntos: [
      { texto: "Art. 113: además de las tres ramas, existen órganos autónomos e independientes. Art. 117: el Ministerio Público y la Contraloría son órganos de control.", fuenteId: "cp-1991", referencia: "Arts. 113 y 117" },
      { texto: "Art. 118: el Ministerio Público lo ejercen el Procurador General, el Defensor del Pueblo, los procuradores delegados, los agentes ante autoridades jurisdiccionales, los personeros municipales y los demás que determine la ley.", fuenteId: "cp-1991", referencia: "Art. 118" },
      { texto: "Art. 275: el Procurador es el supremo director del Ministerio Público. Art. 276: lo elige el Senado para cuatro años, de terna del Presidente, la Corte Suprema y el Consejo de Estado. Art. 277: sus funciones, entre ellas la vigilancia superior de la conducta oficial y el poder disciplinario preferente.", fuenteId: "cp-1991", referencia: "Arts. 275-277" },
      { texto: "Art. 125: los empleos son de carrera por regla general y el ingreso se hace por mérito. Art. 209: principios de igualdad, moralidad, eficacia, economía, celeridad, imparcialidad y publicidad.", fuenteId: "cp-1991", referencia: "Arts. 125 y 209" }
    ]
  },
  {
    temaId: "m7-pgn",
    resumen: "La estructura, las funciones y la carrera especial de la Procuraduría están en el Decreto Ley 262 de 2000 y sus modificaciones.",
    puntos: [
      { texto: "Funciones misionales: preventiva, de intervención y disciplinaria.", fuenteId: "dl-262-2000" },
      { texto: "La carrera de la PGN es un régimen especial. En este concurso, las reclamaciones contra la lista de admitidos se presentan ante el jefe de la Oficina de Selección y Carrera y la apelación la resuelve la Comisión de Carrera.", fuenteId: "conv-51-2026", referencia: "Sección 7" },
      { texto: "La planta es global: el cargo puede reubicarse según las necesidades del servicio.", fuenteId: "conv-51-2026", referencia: "Sección 9" },
      { texto: "El Decreto Ley 1851 de 2021 modificó la planta y las competencias internas.", fuenteId: "dl-262-2000" }
    ]
  },
  {
    temaId: "m7-mipg",
    resumen: "El MIPG integra el sistema de gestión y el de control interno de las entidades públicas.",
    puntos: [
      { texto: "Siete dimensiones: talento humano; direccionamiento estratégico y planeación; gestión con valores para resultados; evaluación de resultados; información y comunicación; gestión del conocimiento y la innovación; y control interno.", fuenteId: "dec-1499-2017" },
      { texto: "El FURAG mide el avance; el Comité Institucional de Gestión y Desempeño orienta la implementación.", fuenteId: "dec-1499-2017" },
      { texto: "Esquema de líneas de defensa: estratégica (alta dirección), primera (gerentes de proceso), segunda (áreas de monitoreo) y tercera (oficina de control interno).", fuenteId: "dec-1499-2017" },
      { texto: "Ley 87 de 1993: el establecimiento del sistema de control interno es responsabilidad del representante legal o máximo directivo.", fuenteId: "ley-87-1993", referencia: "Art. 6" }
    ]
  },
  {
    temaId: "m7-doc",
    resumen: "La gestión documental asegura que la información de la entidad se produzca, conserve y disponga según la ley.",
    puntos: [
      { texto: "Ciclo vital: archivo de gestión, archivo central y archivo histórico.", fuenteId: "ley-594-2000", referencia: "Art. 23" },
      { texto: "Instrumentos: tablas de retención documental (TRD), tablas de valoración (TVD) y programa de gestión documental (PGD). El Archivo General de la Nación es el ente rector.", fuenteId: "ley-594-2000" },
      { texto: "Disposición final: conservación total, selección, eliminación, o medios técnicos como la digitalización.", fuenteId: "academico" }
    ]
  },
  {
    temaId: "m7-ciud",
    resumen: "La transparencia y la atención al ciudadano se apoyan en el acceso a la información pública y el derecho de petición.",
    puntos: [
      { texto: "Máxima publicidad: toda información de un sujeto obligado es pública, salvo excepciones legales (Ley 1712, art. 2).", fuenteId: "ley-1712-2014", referencia: "Art. 2" },
      { texto: "Información clasificada (art. 18, derechos de personas) y reservada (art. 19, intereses públicos como defensa y seguridad nacional).", fuenteId: "ley-1712-2014", referencia: "Arts. 18 y 19" },
      { texto: "Derecho de petición (Ley 1755 de 2015): término general de 15 días hábiles; 10 días para documentos e información; 30 días para consultas.", fuenteId: "ley-1755-2015", referencia: "Art. 14" }
    ]
  },
  {
    temaId: "m7-ofi",
    resumen: "Las herramientas ofimáticas y la redacción de documentos oficiales forman parte de los conocimientos comunes.",
    puntos: [
      { texto: "Hoja de cálculo: funciones de búsqueda (BUSCARV o BUSCARX), tablas dinámicas, validación de datos y formato condicional.", fuenteId: "academico" },
      { texto: "Procesador de texto: estilos, tabla de contenido automática, control de cambios y combinación de correspondencia.", fuenteId: "academico" },
      { texto: "Las comunicaciones oficiales siguen la guía técnica colombiana GTC 185 y el manual de imagen de la entidad.", fuenteId: "academico" }
    ]
  },
  // ---------- M8 Normatividad TIC ----------
  {
    temaId: "m8-delitos",
    resumen: "La Ley 1273 de 2009 creó el bien jurídico de la protección de la información y de los datos y tipificó los delitos informáticos.",
    puntos: [
      { texto: "269A acceso abusivo a sistema informático; 269B obstaculización ilegítima; 269C interceptación de datos; 269D daño informático; 269E uso de software malicioso; 269F violación de datos personales; 269G suplantación de sitios web para capturar datos personales.", fuenteId: "ley-1273-2009" },
      { texto: "269H circunstancias de agravación; 269I hurto por medios informáticos; 269J transferencia no consentida de activos.", fuenteId: "ley-1273-2009" }
    ]
  },
  {
    temaId: "m8-datos",
    resumen: "El régimen de habeas data combina la Ley 1581 de 2012 con su reglamentación compilada en el Decreto 1074 de 2015.",
    puntos: [
      { texto: "La autorización del titular debe ser previa, expresa e informada.", fuenteId: "ley-1581-2012" },
      { texto: "Derechos del titular: conocer, actualizar y rectificar sus datos, solicitar prueba de la autorización, revocarla y presentar quejas ante la SIC.", fuenteId: "ley-1581-2012", referencia: "Art. 8" }
    ]
  },
  {
    temaId: "m8-transp",
    resumen: "La Ley 1712 de 2014 obliga a publicar información (transparencia activa) y a responder solicitudes (transparencia pasiva).",
    puntos: [
      { texto: "Instrumentos de gestión de información: registro de activos de información, índice de información clasificada y reservada, y esquema de publicación.", fuenteId: "ley-1712-2014" },
      { texto: "La ley asigna al Ministerio Público funciones de promoción y vigilancia de su cumplimiento.", fuenteId: "ley-1712-2014" }
    ]
  },
  {
    temaId: "m8-gd",
    resumen: "La política de Gobierno Digital orienta el uso de tecnología en el Estado; la seguridad y privacidad de la información es uno de sus habilitadores.",
    puntos: [
      { texto: "El Decreto 1078 de 2015 es el Decreto Único Reglamentario del sector TIC; el Decreto 767 de 2022 actualizó la Política de Gobierno Digital.", fuenteId: "dec-1078-2015" },
      { texto: "Habilitadores de la política: arquitectura, seguridad y privacidad de la información, cultura y apropiación, y servicios ciudadanos digitales.", fuenteId: "dec-767-2022" },
      { texto: "Resolución 500 de 2021: lineamientos de seguridad digital y adopción del MSPI. La Resolución 02277 de 2025 está pendiente de verificación en la fuente oficial.", fuenteId: "res-500-2021" }
    ]
  },
  {
    temaId: "m8-cpaca",
    resumen: "El CPACA (Ley 1437 de 2011) regula el procedimiento administrativo, incluido el uso de medios electrónicos.",
    puntos: [
      { texto: "Admite actuaciones por medios electrónicos, notificación electrónica y expediente electrónico.", fuenteId: "ley-1437-2011" },
      { texto: "Recursos contra actos administrativos: reposición, apelación y queja.", fuenteId: "ley-1437-2011", referencia: "Art. 74" },
      { texto: "El derecho de petición dentro del CPACA fue sustituido por la Ley 1755 de 2015; la Ley 2080 de 2021 reformó el código.", fuenteId: "ley-1755-2015" }
    ]
  },
  // ---------- M9 Comportamentales ----------
  {
    temaId: "m9-trans",
    resumen: "Las competencias transversales aplican a todos los empleos: responsabilidad con la organización y organización del trabajo, ambas en nivel B.",
    puntos: [
      { texto: "Responsabilidad con la organización: actuar conforme a la misión y los procedimientos, cuidar los recursos y asumir las consecuencias de las propias decisiones.", fuenteId: "academico" },
      { texto: "Organización del trabajo: planear, priorizar y hacer seguimiento a las tareas para cumplir plazos con calidad.", fuenteId: "academico" },
      { texto: "Consulte el Diccionario de Competencias Comportamentales de la PGN: describe las conductas observables de cada nivel.", fuenteId: "conv-51-2026", referencia: "Sección 6" }
    ]
  },
  {
    temaId: "m9-perfil",
    resumen: "Las competencias por perfil del cargo describen cómo actúa un asesor de seguridad: investiga, conceptualiza, logra resultados, cumple parámetros e innova.",
    puntos: [
      { texto: "Investigación (B) y pensamiento conceptual (A): fundamentar con evidencia, estructurar problemas complejos y proponer conceptos claros.", fuenteId: "conv-51-2026", referencia: "Sección 6" },
      { texto: "Orientación a resultados (A): fijar metas medibles y actuar a tiempo ante desviaciones.", fuenteId: "conv-51-2026", referencia: "Sección 6" },
      { texto: "Cumplimiento de parámetros (B) y creatividad e innovación (C): proponer alternativas sin saltarse procedimientos ni controles.", fuenteId: "conv-51-2026", referencia: "Sección 6" },
      { texto: "En casos situacionales suelen puntuar mejor las respuestas que combinan acción oportuna, uso del procedimiento, escalamiento a quien corresponde y evidencia documentada.", fuenteId: "academico" }
    ]
  }
];

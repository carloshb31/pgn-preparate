import { q } from "./helpers";

export const M1_AMPLIACION = [
  q({
    id: "M1-015", modulo: "M1_SEGURIDAD", temaId: "m1-incid", dificultad: 3, tipo: "caso_ciberseguridad",
    enunciado: "El equipo de respuesta aisló de la red un servidor con malware para evitar su propagación. Según el ciclo de gestión de incidentes, ¿qué debe hacerse antes de restablecer el servicio?",
    opciones: [
      ["Reconectar el servidor y monitorear si el malware reaparece", "Incorrecta: reintroduce la amenaza sin haberla eliminado."],
      ["Erradicar la causa: eliminar el malware, cerrar la vulnerabilidad explotada y revisar credenciales comprometidas", "Correcta: la erradicación sigue a la contención y precede a la recuperación."],
      ["Redactar el informe de lecciones aprendidas", "Incorrecta: es una actividad posterior al incidente."],
      ["Cerrar el ticket del incidente", "Incorrecta: el incidente no está resuelto."]
    ],
    correcta: "B",
    explicacion: "El ciclo de NIST SP 800-61 ordena contención, erradicación y recuperación. Recuperar sin erradicar suele terminar en reinfección. Las lecciones aprendidas se documentan al final.",
    fuenteId: "academico", referencia: "NIST SP 800-61", esInferencia: true, etiquetas: ["incidentes"]
  }),
  q({
    id: "M1-016", modulo: "M1_SEGURIDAD", temaId: "m1-incid", dificultad: 2, tipo: "interpretacion",
    enunciado: "¿Cuál de las siguientes situaciones constituye un incidente de seguridad y no solo un evento?",
    opciones: [
      ["Un intento fallido de inicio de sesión de un usuario que olvidó su contraseña", "Incorrecta: es un evento esperado sin compromiso."],
      ["La exfiltración confirmada de expedientes mediante una cuenta comprometida", "Correcta: compromete la confidencialidad de la información."],
      ["Un escaneo de puertos bloqueado por el firewall perimetral", "Incorrecta: es un evento que el control detuvo."],
      ["La actualización programada de un servidor", "Incorrecta: es un cambio planeado."]
    ],
    correcta: "B",
    explicacion: "Un evento es cualquier ocurrencia observable. Es incidente cuando compromete o amenaza de forma real la confidencialidad, integridad o disponibilidad. Clasificar bien evita saturar al equipo de respuesta.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["incidentes"]
  }),
  q({
    id: "M1-017", modulo: "M1_SEGURIDAD", temaId: "m1-mspi", dificultad: 2, tipo: "conceptual",
    enunciado: "Una entidad va a implementar el Modelo de Seguridad y Privacidad de la Información (MSPI). ¿Con qué fase inicia el ciclo del modelo?",
    opciones: [
      ["Implementación de controles técnicos", "Incorrecta: requiere un diagnóstico y una planificación previos."],
      ["Diagnóstico del estado actual de seguridad y privacidad", "Correcta: establece la línea base del modelo."],
      ["Evaluación del desempeño", "Incorrecta: se hace después de implementar."],
      ["Mejora continua", "Incorrecta: cierra el ciclo."]
    ],
    correcta: "B",
    explicacion: "El MSPI sigue un ciclo de diagnóstico, planificación, implementación, evaluación del desempeño y mejora continua, alineado con el ciclo PHVA de ISO/IEC 27001.",
    fuenteId: "mspi", etiquetas: ["MSPI"]
  }),
  q({
    id: "M1-018", modulo: "M1_SEGURIDAD", temaId: "m1-mspi", dificultad: 3, tipo: "asesoria_institucional",
    enunciado: "Un directivo afirma que el MSPI es un asunto solo técnico de la oficina de tecnología. ¿Qué le respondería como asesor?",
    opciones: [
      ["Tiene razón: el MSPI se limita a firewalls y antivirus", "Incorrecta: el modelo abarca gestión, procesos y personas."],
      ["El MSPI abarca seguridad y privacidad de la información, incluida la protección de datos personales, e involucra a toda la entidad", "Correcta: es un modelo de gestión, no solo técnico."],
      ["El MSPI aplica solo a entidades del orden territorial", "Incorrecta: aplica a los sujetos de la Política de Gobierno Digital."],
      ["El MSPI es opcional y reemplaza a ISO/IEC 27001", "Incorrecta: se alinea con ISO/IEC 27001 y la Resolución 500 de 2021 lo adoptó."]
    ],
    correcta: "B",
    explicacion: "La privacidad es parte del nombre y del alcance del modelo. Requiere liderazgo de la alta dirección, roles en los procesos y apropiación de los servidores.",
    fuenteId: "res-500-2021", etiquetas: ["MSPI", "privacidad"]
  }),
  q({
    id: "M1-019", modulo: "M1_SEGURIDAD", temaId: "m1-gob", dificultad: 2, tipo: "conceptual",
    enunciado: "La mesa de ayuda necesita un documento que indique paso a paso cómo verificar la identidad de un usuario antes de restablecer su contraseña. ¿Qué tipo de documento es?",
    opciones: [
      ["Política de seguridad", "Incorrecta: la política define qué se exige y por qué, a alto nivel."],
      ["Procedimiento", "Correcta: describe cómo se ejecuta una actividad, paso a paso."],
      ["Declaración de aplicabilidad", "Incorrecta: justifica los controles del Anexo A."],
      ["Matriz de riesgos", "Incorrecta: registra riesgos y su tratamiento."]
    ],
    correcta: "B",
    explicacion: "La jerarquía documental va de la política (aprobada por la alta dirección) a los estándares, procedimientos y guías. La función 10 del empleo incluye mantener procedimientos, manuales y cartillas.",
    fuenteId: "conv-51-2026", referencia: "Función 10", esInferencia: true, etiquetas: ["gobierno", "documentación"]
  }),
  q({
    id: "M1-020", modulo: "M1_SEGURIDAD", temaId: "m1-gob", dificultad: 3, tipo: "decision_tecnica",
    enunciado: "Para demostrar a la alta dirección la efectividad del programa de sensibilización en seguridad, ¿qué indicador es más adecuado?",
    opciones: [
      ["Número de charlas realizadas en el año", "Incorrecta: mide actividad, no cambio de comportamiento."],
      ["Evolución de la tasa de clic y de la tasa de reporte en simulaciones periódicas de phishing", "Correcta: mide el comportamiento que el programa busca cambiar."],
      ["Cantidad de afiches publicados", "Incorrecta: no mide efecto."],
      ["Porcentaje del presupuesto ejecutado", "Incorrecta: mide ejecución financiera."]
    ],
    correcta: "B",
    explicacion: "La función 14 pide garantizar el uso y apropiación del plan de comunicaciones en seguridad. Un buen indicador mide resultados: menos clics y más reportes en el tiempo.",
    fuenteId: "conv-51-2026", referencia: "Función 14", esInferencia: true, etiquetas: ["sensibilización", "indicadores"]
  }),
  q({
    id: "M1-021", modulo: "M1_SEGURIDAD", temaId: "m1-iso", dificultad: 4, tipo: "conceptual",
    enunciado: "¿Cuál de los siguientes controles fue incorporado como nuevo en ISO/IEC 27001:2022 / 27002:2022?",
    opciones: [
      ["Política de control de acceso", "Incorrecta: ya existía en la versión 2013."],
      ["Inteligencia de amenazas", "Correcta: es el control 5.7, nuevo en 2022."],
      ["Copias de respaldo de la información", "Incorrecta: ya existía en la versión 2013."],
      ["Gestión de la capacidad", "Incorrecta: ya existía en la versión 2013."]
    ],
    correcta: "B",
    explicacion: "Los 11 controles nuevos incluyen inteligencia de amenazas, seguridad en servicios en la nube, preparación TIC para la continuidad, gestión de configuración, eliminación de información, enmascaramiento de datos, prevención de fuga de datos, monitoreo, filtrado web y codificación segura, entre otros.",
    fuenteId: "iso-27002-2022", referencia: "Control 5.7", etiquetas: ["ISO 27001"]
  }),
  q({
    id: "M1-022", modulo: "M1_SEGURIDAD", temaId: "m1-iso", dificultad: 3, tipo: "conceptual",
    enunciado: "En ISO/IEC 27001:2022, ¿en qué cláusula se ubican la auditoría interna y la revisión por la dirección?",
    opciones: [
      ["Cláusula 6, Planificación", "Incorrecta: trata riesgos, objetivos y planificación de cambios."],
      ["Cláusula 8, Operación", "Incorrecta: trata la ejecución de los procesos y del tratamiento de riesgos."],
      ["Cláusula 9, Evaluación del desempeño", "Correcta: incluye seguimiento y medición, auditoría interna y revisión por la dirección."],
      ["Cláusula 10, Mejora", "Incorrecta: trata no conformidades, acciones correctivas y mejora continua."]
    ],
    correcta: "C",
    explicacion: "Las cláusulas 4 a 10 son requisitos: contexto, liderazgo, planificación, soporte, operación, evaluación del desempeño y mejora.",
    fuenteId: "iso-27001-2022", referencia: "Cláusula 9", etiquetas: ["ISO 27001", "SGSI"]
  }),
  q({
    id: "M1-023", modulo: "M1_SEGURIDAD", temaId: "m1-nist", dificultad: 3, tipo: "interpretacion",
    enunciado: "En el NIST Cybersecurity Framework 2.0, ¿qué describen los niveles (tiers) 1 a 4?",
    opciones: [
      ["El rigor de las prácticas de gestión de riesgos de ciberseguridad de la organización", "Correcta: van de parcial a adaptativo."],
      ["Niveles de certificación obligatorios otorgados por NIST", "Incorrecta: el marco no certifica."],
      ["La severidad de las vulnerabilidades", "Incorrecta: eso lo hace CVSS."],
      ["El número de controles implementados", "Incorrecta: no es un conteo de controles."]
    ],
    correcta: "A",
    explicacion: "Los tiers (parcial, informado por riesgos, repetible y adaptativo) caracterizan el gobierno y la gestión de riesgos. Se usan junto con perfiles actual y objetivo para planear mejoras.",
    fuenteId: "nist-csf-2", etiquetas: ["NIST"]
  }),
  q({
    id: "M1-024", modulo: "M1_SEGURIDAD", temaId: "m1-riesgo", dificultad: 2, tipo: "conceptual",
    enunciado: "Después de implementar MFA y segmentación, el análisis indica que aún existe una probabilidad baja de acceso no autorizado al sistema misional. ¿Cómo se denomina ese riesgo?",
    opciones: [
      ["Riesgo inherente", "Incorrecta: es el que existe antes de aplicar controles."],
      ["Riesgo residual", "Correcta: es el que permanece después de los controles."],
      ["Riesgo transferido", "Incorrecta: implica trasladar consecuencias a un tercero."],
      ["Apetito de riesgo", "Incorrecta: es el nivel que la dirección está dispuesta a asumir."]
    ],
    correcta: "B",
    explicacion: "El riesgo residual se compara con el apetito de riesgo: si lo supera, requiere tratamiento adicional o aceptación formal del dueño del riesgo.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["riesgo"]
  }),
  q({
    id: "M1-025", modulo: "M1_SEGURIDAD", temaId: "m1-vuln", dificultad: 2, tipo: "conceptual",
    enunciado: "Un escáner reporta una vulnerabilidad con puntaje base CVSS 7.5. ¿En qué categoría de severidad cualitativa se ubica?",
    opciones: [
      ["Media", "Incorrecta: media va de 4.0 a 6.9."],
      ["Alta", "Correcta: alta va de 7.0 a 8.9."],
      ["Crítica", "Incorrecta: crítica va de 9.0 a 10.0."],
      ["Baja", "Incorrecta: baja va de 0.1 a 3.9."]
    ],
    correcta: "B",
    explicacion: "La escala cualitativa de CVSS orienta la prioridad, pero la decisión final considera exposición, explotación activa y criticidad del activo.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["CVSS"]
  }),
  q({
    id: "M1-026", modulo: "M1_SEGURIDAD", temaId: "m1-zt", dificultad: 4, tipo: "conceptual",
    enunciado: "En la arquitectura Zero Trust de NIST SP 800-207, ¿qué componente habilita, monitorea y termina la conexión entre el sujeto y el recurso, según la decisión tomada?",
    opciones: [
      ["El punto de aplicación de políticas (PEP)", "Correcta: ejecuta la decisión en el camino de acceso."],
      ["El motor de políticas (policy engine)", "Incorrecta: toma la decisión de conceder o negar."],
      ["El SIEM", "Incorrecta: es una fuente de información para la decisión, no el punto de aplicación."],
      ["La autoridad certificadora", "Incorrecta: emite certificados."]
    ],
    correcta: "A",
    explicacion: "El punto de decisión (PDP) lo forman el motor y el administrador de políticas; el PEP aplica la decisión en cada sesión.",
    fuenteId: "nist-800-207", etiquetas: ["Zero Trust"]
  }),
  q({
    id: "M1-027", modulo: "M1_SEGURIDAD", temaId: "m1-iam", dificultad: 3, tipo: "asesoria_institucional",
    enunciado: "Una auditoría encuentra 40 cuentas activas de personas que ya no trabajan en la entidad. ¿Qué control recomienda para la causa raíz?",
    opciones: [
      ["Cambiar la contraseña de todas las cuentas cada mes", "Incorrecta: no resuelve que las cuentas sigan activas."],
      ["Integrar el proceso de retiro de talento humano con la gestión de identidades para desactivar las cuentas el mismo día, y revisar accesos periódicamente", "Correcta: ataca la causa y detecta lo que se escape."],
      ["Eliminar todas las cuentas de usuario y crearlas de nuevo", "Incorrecta: desproporcionado y no evita que vuelva a pasar."],
      ["Aumentar la longitud mínima de las contraseñas", "Incorrecta: no está relacionado con la causa."]
    ],
    correcta: "B",
    explicacion: "El ciclo de vida de identidades (alta, cambio, retiro) debe estar ligado al proceso de talento humano. Las revisiones periódicas de acceso son el control detectivo complementario.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["identidad"]
  }),
  q({
    id: "M1-028", modulo: "M1_SEGURIDAD", temaId: "m1-soc", dificultad: 2, tipo: "conceptual",
    enunciado: "¿Cuál es el propósito principal de una plataforma SOAR en un centro de operaciones de seguridad?",
    opciones: [
      ["Almacenar copias de respaldo", "Incorrecta: no es su función."],
      ["Orquestar y automatizar la respuesta a incidentes mediante playbooks", "Correcta: reduce tiempos y estandariza la respuesta."],
      ["Reemplazar el firewall perimetral", "Incorrecta: no filtra tráfico."],
      ["Escanear vulnerabilidades en las aplicaciones", "Incorrecta: eso lo hacen los escáneres."]
    ],
    correcta: "B",
    explicacion: "SOAR integra herramientas (SIEM, EDR, correo, ticketing) y ejecuta acciones repetibles, como aislar un equipo o bloquear un indicador.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["SOC"]
  }),
  q({
    id: "M1-029", modulo: "M1_SEGURIDAD", temaId: "m1-app", dificultad: 3, tipo: "caso_ciberseguridad",
    enunciado: "En el portal de consultas, un usuario autenticado cambia el número de expediente en la URL y obtiene datos de otra persona. ¿Qué categoría del OWASP Top 10 (2021) describe la falla?",
    opciones: [
      ["Inyección (A03)", "Incorrecta: no se inyectó código ni consultas."],
      ["Pérdida de control de acceso (A01)", "Correcta: la aplicación no verifica que el recurso pertenezca al usuario."],
      ["Fallas criptográficas (A02)", "Incorrecta: no se trata de cifrado."],
      ["Falsificación de solicitudes del lado del servidor (A10)", "Incorrecta: no hay solicitudes forzadas desde el servidor."]
    ],
    correcta: "B",
    explicacion: "Es una referencia directa insegura a objetos (IDOR), dentro de la pérdida de control de acceso, primera categoría del Top 10 de 2021. Se corrige validando la autorización en el servidor para cada recurso.",
    fuenteId: "owasp-top10", referencia: "A01:2021", etiquetas: ["OWASP", "aplicaciones"]
  }),
  q({
    id: "M1-030", modulo: "M1_SEGURIDAD", temaId: "m1-forense", dificultad: 2, tipo: "conceptual",
    enunciado: "Al adquirir la imagen forense de un disco se calcula su hash SHA-256. ¿Para qué sirve?",
    opciones: [
      ["Para cifrar la evidencia", "Incorrecta: un hash no cifra."],
      ["Para demostrar que la copia no ha cambiado desde su adquisición", "Correcta: cualquier alteración cambia el hash."],
      ["Para comprimir la imagen", "Incorrecta: no comprime."],
      ["Para recuperar archivos borrados", "Incorrecta: no recupera información."]
    ],
    correcta: "B",
    explicacion: "El hash se registra en la cadena de custodia y se recalcula antes de cada análisis para probar la integridad de la evidencia.",
    fuenteId: "nist-800-86", etiquetas: ["forense"]
  })
];

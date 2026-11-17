import { q } from "./helpers";

export const M1 = [
  q({
    id: "M1-001", modulo: "M1_SEGURIDAD", temaId: "m1-fund", subtema: "Confidencialidad, integridad y disponibilidad", dificultad: 2, tipo: "escenario",
    enunciado: "Un servidor de la entidad, con credenciales válidas, consulta expedientes disciplinarios reservados que no tienen relación con sus funciones. No modifica ni elimina información. ¿Qué propiedad de la seguridad de la información se vulneró principalmente?",
    opciones: [
      ["Disponibilidad", "Incorrecta: el servicio y los expedientes siguieron accesibles para quienes debían usarlos."],
      ["Integridad", "Incorrecta: no hubo modificación ni alteración de los datos."],
      ["Confidencialidad", "Correcta: personas no autorizadas para ese fin accedieron a información reservada."],
      ["No repudio", "Incorrecta: el no repudio impide negar la autoría de una acción; aquí el problema es el acceso indebido."]
    ],
    correcta: "C",
    explicacion: "La confidencialidad garantiza que la información solo sea accesible para quienes están autorizados. Tener credenciales válidas no autoriza a consultar información ajena a las funciones: el control de acceso debe aplicar el principio de mínimo privilegio y necesidad de conocer.",
    fuenteId: "iso-27001-2022", referencia: "Términos y definiciones (ISO/IEC 27000)", etiquetas: ["CIA", "mínimo privilegio"]
  }),
  q({
    id: "M1-002", modulo: "M1_SEGURIDAD", temaId: "m1-iso", subtema: "Anexo A", dificultad: 2, tipo: "conceptual",
    enunciado: "En la versión 2022 de ISO/IEC 27001, ¿cómo están organizados los controles de referencia del Anexo A?",
    opciones: [
      ["114 controles en 14 dominios", "Incorrecta: esa era la estructura de la versión 2013."],
      ["93 controles en 4 temas: organizacionales, de personas, físicos y tecnológicos", "Correcta: es la estructura adoptada en 2022, alineada con ISO/IEC 27002:2022."],
      ["Seis funciones: gobernar, identificar, proteger, detectar, responder y recuperar", "Incorrecta: corresponde al NIST Cybersecurity Framework 2.0, no a ISO/IEC 27001."],
      ["Cinco fases del ciclo PHVA con 35 objetivos de control", "Incorrecta: PHVA describe la mejora continua del SGSI, no la agrupación de controles."]
    ],
    correcta: "B",
    explicacion: "ISO/IEC 27001:2022 redujo y reagrupó los controles: 93 controles en cuatro temas (37 organizacionales, 8 de personas, 14 físicos y 34 tecnológicos). La Declaración de Aplicabilidad debe justificar la inclusión o exclusión de cada uno.",
    fuenteId: "iso-27001-2022", referencia: "Anexo A", etiquetas: ["SGSI", "SoA"]
  }),
  q({
    id: "M1-003", modulo: "M1_SEGURIDAD", temaId: "m1-nist", dificultad: 3, tipo: "asesoria_institucional",
    enunciado: "El jefe de la oficina le pide ubicar en el NIST CSF 2.0 las actividades de definir roles y responsabilidades de ciberseguridad, establecer la estrategia de gestión de riesgos y supervisar el cumplimiento de la política. ¿En qué función del marco se ubican?",
    opciones: [
      ["Identificar (Identify)", "Incorrecta: Identify se centra en entender activos, riesgos actuales y oportunidades de mejora."],
      ["Gobernar (Govern)", "Correcta: Govern, incorporada en la versión 2.0, agrupa estrategia, expectativas, política, roles y supervisión."],
      ["Proteger (Protect)", "Incorrecta: Protect agrupa salvaguardas para gestionar los riesgos, como control de acceso y protección de datos."],
      ["Responder (Respond)", "Incorrecta: Respond trata las acciones frente a un incidente detectado."]
    ],
    correcta: "B",
    explicacion: "La versión 2.0 del CSF (2024) agregó la función Govern como eje transversal: establece y supervisa la estrategia de gestión de riesgos de ciberseguridad, las expectativas y la política de la organización.",
    fuenteId: "nist-csf-2", referencia: "Función GV (Govern)", etiquetas: ["NIST", "gobierno"]
  }),
  q({
    id: "M1-004", modulo: "M1_SEGURIDAD", temaId: "m1-riesgo", subtema: "Tratamiento del riesgo", dificultad: 3, tipo: "decision_tecnica",
    enunciado: "Después de aplicar controles, el riesgo residual de afectación por ransomware sigue por encima del apetito de riesgo aprobado. La entidad decide contratar una póliza de ciberseguro que cubra costos de recuperación. ¿Qué opción de tratamiento está aplicando?",
    opciones: [
      ["Evitar el riesgo", "Incorrecta: evitar implica suprimir la actividad que origina el riesgo."],
      ["Modificar o mitigar el riesgo", "Incorrecta: mitigar reduce probabilidad o impacto con controles; la póliza no cambia la probabilidad del ataque."],
      ["Compartir o transferir el riesgo", "Correcta: una parte de las consecuencias económicas se traslada a un tercero."],
      ["Aceptar o retener el riesgo", "Incorrecta: aceptar implica asumir el riesgo sin acciones adicionales."]
    ],
    correcta: "C",
    explicacion: "La póliza traslada parte del impacto financiero a la aseguradora. La responsabilidad sobre la información y el impacto reputacional o en el servicio permanecen en la entidad, por lo que el seguro complementa, y no reemplaza, los controles.",
    fuenteId: "academico", referencia: "Opciones de tratamiento descritas en ISO/IEC 27005 e ISO 31000", esInferencia: true, etiquetas: ["riesgo"]
  }),
  q({
    id: "M1-005", modulo: "M1_SEGURIDAD", temaId: "m1-perim", subtema: "IDS e IPS", dificultad: 2, tipo: "decision_tecnica",
    enunciado: "Se requiere un control que analice el tráfico entre el segmento de usuarios y el centro de datos y que bloquee automáticamente el tráfico que coincida con firmas de explotación conocidas. ¿Qué control y modo de despliegue cumple el requisito?",
    opciones: [
      ["IDS conectado a un puerto espejo (SPAN)", "Incorrecta: el IDS en modo pasivo detecta y alerta, pero no está en el camino del tráfico para bloquearlo."],
      ["IPS desplegado en línea (inline)", "Correcta: al estar en el camino del tráfico puede descartar paquetes maliciosos en tiempo real."],
      ["SIEM con reglas de correlación", "Incorrecta: el SIEM correlaciona registros y alerta; no inspecciona ni bloquea tráfico en línea."],
      ["Servidor proxy de navegación", "Incorrecta: controla el acceso web de los usuarios, no el tráfico hacia el centro de datos."]
    ],
    correcta: "B",
    explicacion: "La diferencia clave es la ubicación: un IPS en línea puede prevenir; un IDS pasivo solo detecta. El costo del IPS en línea es el riesgo de bloquear tráfico legítimo por falsos positivos, por lo que suele iniciarse en modo de monitoreo.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["perimetral"]
  }),
  q({
    id: "M1-006", modulo: "M1_SEGURIDAD", temaId: "m1-perim", subtema: "WAF", dificultad: 3, tipo: "caso_ciberseguridad",
    enunciado: "Un análisis de vulnerabilidades reporta inyección SQL en el portal de trámites. La corrección del código tomará seis semanas por un contrato de desarrollo vigente. ¿Cuál es la medida compensatoria más adecuada mientras se corrige?",
    opciones: [
      ["Cerrar el puerto 443 del portal en el firewall perimetral", "Incorrecta: elimina el servicio a la ciudadanía; no es proporcional."],
      ["Aplicar en un WAF reglas que inspeccionen y bloqueen patrones de inyección SQL hacia el portal", "Correcta: el WAF inspecciona la capa de aplicación y permite un parche virtual mientras se corrige el código."],
      ["Aumentar el número de reglas de estado en el firewall de red", "Incorrecta: un firewall de estado filtra en capas 3 y 4; no analiza el contenido de las peticiones HTTP."],
      ["Instalar antivirus en el servidor web", "Incorrecta: el antivirus no inspecciona las consultas que llegan a la aplicación."]
    ],
    correcta: "B",
    explicacion: "El WAF actúa en capa 7 sobre HTTP/HTTPS. Es un control compensatorio: reduce la exposición, pero la vulnerabilidad debe corregirse en el código con consultas parametrizadas, y el riesgo residual debe quedar documentado.",
    fuenteId: "owasp-top10", referencia: "Categoría de inyección", etiquetas: ["WAF", "OWASP"]
  }),
  q({
    id: "M1-007", modulo: "M1_SEGURIDAD", temaId: "m1-zt", dificultad: 3, tipo: "conceptual",
    enunciado: "Según el enfoque de Zero Trust descrito por NIST, ¿cuál afirmación refleja un principio de esa arquitectura?",
    opciones: [
      ["Un usuario conectado por VPN a la red interna puede acceder a todos los recursos internos", "Incorrecta: otorga confianza implícita por ubicación de red, lo que Zero Trust rechaza."],
      ["El acceso a cada recurso se concede por sesión, según políticas dinámicas y sin confianza implícita por la ubicación en la red", "Correcta: es un principio central de NIST SP 800-207."],
      ["La DMZ se protege y la LAN interna se considera zona de confianza", "Incorrecta: describe el modelo perimetral tradicional."],
      ["Los equipos con certificado de dominio quedan exentos de autenticación", "Incorrecta: la identidad y el estado del dispositivo se evalúan en cada solicitud."]
    ],
    correcta: "B",
    explicacion: "Zero Trust traslada la defensa del perímetro a los recursos: cada solicitud se evalúa con información de identidad, dispositivo y contexto, aplicando mínimo privilegio.",
    fuenteId: "nist-800-207", referencia: "Sección 2.1 Tenets of Zero Trust", etiquetas: ["Zero Trust"]
  }),
  q({
    id: "M1-008", modulo: "M1_SEGURIDAD", temaId: "m1-soc", dificultad: 3, tipo: "decision_tecnica",
    enunciado: "La entidad quiere detectar intentos de fuerza bruta distribuidos que combinan fallos de autenticación en Active Directory, conexiones rechazadas en el firewall y accesos a la VPN. ¿Qué herramienta es la más adecuada para esa detección?",
    opciones: [
      ["EDR", "Incorrecta: el EDR observa la actividad dentro de los endpoints, no correlaciona registros de varias plataformas."],
      ["SIEM con reglas de correlación", "Correcta: centraliza y correlaciona eventos de distintas fuentes para identificar patrones."],
      ["WAF", "Incorrecta: protege aplicaciones web en capa 7."],
      ["Escáner de vulnerabilidades", "Incorrecta: identifica debilidades; no analiza eventos en tiempo real."]
    ],
    correcta: "B",
    explicacion: "El valor del SIEM está en la correlación: un fallo aislado no es relevante, pero muchos fallos desde orígenes distintos en una ventana corta sí lo son. EDR, NDR y XDR complementan con detección en endpoints, red o de forma integrada.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["SOC", "SIEM"]
  }),
  q({
    id: "M1-009", modulo: "M1_SEGURIDAD", temaId: "m1-app", subtema: "SPF, DKIM y DMARC", dificultad: 3, tipo: "conceptual",
    enunciado: "Se detectan correos que suplantan el dominio de la entidad. ¿Qué mecanismo permite publicar una política que indique a los servidores receptores qué hacer con los mensajes que no superen la alineación de SPF o DKIM, y recibir reportes?",
    opciones: [
      ["SPF", "Incorrecta: SPF declara qué servidores pueden enviar correo por el dominio, pero no define la acción ante fallos ni reportes."],
      ["DKIM", "Incorrecta: DKIM firma los mensajes; no establece la política de manejo."],
      ["DMARC", "Correcta: define la política (none, quarantine o reject) y el envío de reportes de agregados y fallos."],
      ["STARTTLS", "Incorrecta: cifra la conexión entre servidores, no autentica el remitente."]
    ],
    correcta: "C",
    explicacion: "DMARC se apoya en SPF y DKIM y exige alineación con el dominio visible del remitente. Se recomienda iniciar con p=none para recolectar reportes y avanzar a quarantine y reject.",
    fuenteId: "rfc-7489", etiquetas: ["correo"]
  }),
  q({
    id: "M1-010", modulo: "M1_SEGURIDAD", temaId: "m1-vuln", subtema: "Plan de mitigación", dificultad: 4, tipo: "asesoria_institucional",
    enunciado: "Con capacidad para remediar solo una vulnerabilidad esta semana, el equipo tiene dos hallazgos: (1) CVSS 9.8 en un servidor de pruebas aislado, sin datos reales ni conectividad externa; (2) CVSS 7.5 en el portal publicado en Internet, con explotación activa reportada. ¿Qué recomienda?",
    opciones: [
      ["Remediar primero el hallazgo 1, porque su puntaje CVSS es mayor", "Incorrecta: el CVSS base no considera exposición, explotación activa ni criticidad del activo."],
      ["Remediar primero el hallazgo 2, por su exposición a Internet y explotación activa", "Correcta: la priorización debe basarse en riesgo, no solo en severidad base."],
      ["Esperar al siguiente ciclo para remediar ambos juntos", "Incorrecta: deja expuesto un activo con explotación activa."],
      ["Aceptar ambos riesgos y documentarlos", "Incorrecta: aceptar un riesgo con explotación activa en un servicio expuesto no es razonable sin análisis del dueño del riesgo."]
    ],
    correcta: "B",
    explicacion: "Una gestión de vulnerabilidades madura combina severidad, exposición, existencia de explotación conocida y criticidad del activo. El hallazgo aislado sigue en el plan, con una fecha comprometida.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["vulnerabilidades", "priorización"]
  }),
  q({
    id: "M1-011", modulo: "M1_SEGURIDAD", temaId: "m1-forense", subtema: "Orden de volatilidad", dificultad: 4, tipo: "caso_ciberseguridad",
    enunciado: "Un servidor comprometido sigue encendido y conectado. Se requiere preservar evidencia para un posible proceso. ¿Cuál debe ser la primera acción de recolección?",
    opciones: [
      ["Apagar el servidor de inmediato para detener el ataque", "Incorrecta: se pierde la evidencia volátil, como memoria, procesos y conexiones."],
      ["Ejecutar un análisis completo de antivirus", "Incorrecta: modifica el sistema y puede alterar evidencia."],
      ["Adquirir la memoria volátil y el estado del sistema antes de la imagen del disco, documentando la cadena de custodia", "Correcta: se recolecta primero lo más volátil."],
      ["Reinstalar el sistema operativo desde una imagen limpia", "Incorrecta: destruye la evidencia y la causa raíz."]
    ],
    correcta: "C",
    explicacion: "El orden de volatilidad recomienda empezar por la memoria y el estado de la red antes de la imagen del disco. El aislamiento de red se coordina con el equipo de respuesta para no perder datos.",
    fuenteId: "nist-800-86", etiquetas: ["forense", "cadena de custodia"]
  }),
  q({
    id: "M1-012", modulo: "M1_SEGURIDAD", temaId: "m1-datos", dificultad: 2, tipo: "normativa",
    enunciado: "Según la Ley 1581 de 2012, ¿qué entidad ejerce como autoridad de protección de datos personales en Colombia?",
    opciones: [
      ["La Procuraduría General de la Nación", "Incorrecta: la PGN no fue designada por la ley como autoridad de protección de datos."],
      ["El Ministerio de Tecnologías de la Información y las Comunicaciones", "Incorrecta: MinTIC lidera la política de gobierno digital, no la vigilancia del régimen de datos personales."],
      ["La Superintendencia de Industria y Comercio, a través de una Delegatura para la Protección de Datos Personales", "Correcta: así lo dispone el artículo 19."],
      ["La Defensoría del Pueblo", "Incorrecta: no tiene esa función según la Ley 1581."]
    ],
    correcta: "C",
    explicacion: "El artículo 19 de la Ley 1581 de 2012 designa a la SIC como autoridad de protección de datos, con funciones de vigilancia para garantizar el respeto de los principios, derechos y garantías del régimen.",
    fuenteId: "ley-1581-2012", referencia: "Artículo 19", etiquetas: ["habeas data"]
  }),
  q({
    id: "M1-013", modulo: "M1_SEGURIDAD", temaId: "m1-activos", subtema: "Clasificación", dificultad: 3, tipo: "asesoria_institucional",
    enunciado: "Al actualizar el inventario de activos de información, surge la duda de quién debe definir el nivel de clasificación de la base de datos de un sistema misional. ¿Qué recomienda?",
    opciones: [
      ["La oficina de tecnología, porque administra el servidor", "Incorrecta: TI suele actuar como custodio; la clasificación corresponde a quien responde por la información."],
      ["El propietario del activo, aplicando el esquema de clasificación adoptado por la entidad", "Correcta: el propietario responde por la información y por su clasificación."],
      ["La oficina de control interno", "Incorrecta: evalúa el sistema de control; no clasifica la información de los procesos."],
      ["Cada usuario que consulta la base de datos", "Incorrecta: genera criterios dispersos e inconsistentes."]
    ],
    correcta: "B",
    explicacion: "ISO/IEC 27002:2022 trata el inventario de activos con propietarios asignados y la clasificación según necesidades de confidencialidad, integridad y disponibilidad. El custodio implementa los controles que el propietario requiere.",
    fuenteId: "iso-27002-2022", referencia: "Controles 5.9 y 5.12", etiquetas: ["activos", "clasificación"]
  }),
  q({
    id: "M1-014", modulo: "M1_SEGURIDAD", temaId: "m1-iam", subtema: "MFA", dificultad: 4, tipo: "decision_tecnica",
    enunciado: "Tras una campaña de phishing que capturó contraseñas y códigos de un solo uso enviados por SMS, la entidad quiere un segundo factor resistente a ese tipo de ataque para administradores. ¿Qué opción es la más adecuada?",
    opciones: [
      ["Código OTP por correo electrónico", "Incorrecta: un sitio falso puede capturarlo y reutilizarlo de inmediato."],
      ["Preguntas de seguridad", "Incorrecta: son un conocimiento adicional, no un segundo factor de otra categoría, y son fáciles de obtener."],
      ["Autenticadores FIDO2/WebAuthn ligados al origen del sitio", "Correcta: la credencial criptográfica está asociada al dominio legítimo y no funciona en un sitio suplantado."],
      ["Aumentar la longitud mínima de la contraseña", "Incorrecta: no evita la captura de credenciales mediante phishing."]
    ],
    correcta: "C",
    explicacion: "Los autenticadores FIDO2 firman un desafío ligado al origen, por lo que el phishing tradicional no logra reutilizar la autenticación. Son prioritarios para cuentas privilegiadas.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["MFA", "identidad"]
  })
];

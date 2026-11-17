import type { MaterialTema } from "./tipos";

export const MATERIAL_M1: MaterialTema[] = [
  {
    temaId: "m1-fund",
    resumen: "La seguridad de la información protege la confidencialidad, la integridad y la disponibilidad de los activos de información. Toda decisión de control se justifica por la propiedad que protege.",
    puntos: [
      { texto: "Confidencialidad: solo acceden quienes están autorizados. Integridad: la información es exacta y completa, y no se altera sin autorización. Disponibilidad: está accesible cuando se necesita.", fuenteId: "iso-27001-2022" },
      { texto: "Autenticación verifica quién es el usuario; autorización determina qué puede hacer; trazabilidad (auditoría) registra qué hizo. Juntas forman el esquema AAA.", fuenteId: "academico" },
      { texto: "No repudio: el autor de una acción no puede negarla. Se logra con firmas digitales y registros protegidos contra alteración.", fuenteId: "academico" },
      { texto: "Mínimo privilegio y necesidad de conocer: tener credenciales válidas no autoriza a consultar información ajena a las funciones.", fuenteId: "academico" }
    ],
    trampas: ["Confundir integridad (alteración) con confidencialidad (acceso indebido).", "Creer que el cifrado garantiza disponibilidad: protege confidencialidad e integridad."]
  },
  {
    temaId: "m1-riesgo",
    resumen: "El riesgo de seguridad es la posibilidad de que una amenaza explote una vulnerabilidad de un activo y cause un impacto. Se gestiona con identificación, análisis, evaluación, tratamiento y seguimiento.",
    puntos: [
      { texto: "Nivel de riesgo = probabilidad × impacto. Riesgo inherente es el que existe antes de controles; residual, el que queda después.", fuenteId: "academico" },
      { texto: "Opciones de tratamiento: evitar (eliminar la actividad), mitigar o modificar (controles), compartir o transferir (seguros, terceros) y aceptar (decisión documentada del dueño del riesgo).", fuenteId: "academico", referencia: "ISO/IEC 27005 e ISO 31000" },
      { texto: "El apetito de riesgo lo fija la alta dirección; el riesgo residual que lo supere exige tratamiento adicional o aceptación formal.", fuenteId: "academico" },
      { texto: "La matriz de riesgos (mapa de calor) y el plan de tratamiento con responsables y fechas son entregables explícitos de la función 5 del empleo.", fuenteId: "conv-51-2026", referencia: "Función 5" }
    ],
    trampas: ["Transferir el riesgo no transfiere la responsabilidad sobre la información.", "Aceptar un riesgo no es omitir la decisión: debe quedar documentada."]
  },
  {
    temaId: "m1-iso",
    resumen: "ISO/IEC 27001:2022 especifica los requisitos de un Sistema de Gestión de Seguridad de la Información (SGSI). ISO/IEC 27002:2022 orienta cómo implementar los controles.",
    puntos: [
      { texto: "Las cláusulas 4 a 10 son requisitos obligatorios: contexto, liderazgo, planificación, soporte, operación, evaluación del desempeño y mejora.", fuenteId: "iso-27001-2022" },
      { texto: "El Anexo A tiene 93 controles en 4 temas: 37 organizacionales (5.x), 8 de personas (6.x), 14 físicos (7.x) y 34 tecnológicos (8.x).", fuenteId: "iso-27001-2022", referencia: "Anexo A" },
      { texto: "Controles nuevos en 2022: inteligencia de amenazas (5.7), seguridad en servicios en la nube (5.23), preparación TIC para la continuidad (5.30), monitoreo de seguridad física (7.4), gestión de configuración (8.9), eliminación de información (8.10), enmascaramiento de datos (8.11), prevención de fuga de datos (8.12), actividades de monitoreo (8.16), filtrado web (8.22) y codificación segura (8.28).", fuenteId: "iso-27002-2022" },
      { texto: "La Declaración de Aplicabilidad (SoA) justifica la inclusión o exclusión de cada control del Anexo A.", fuenteId: "iso-27001-2022", referencia: "6.1.3" }
    ],
    trampas: ["La versión 2013 tenía 114 controles en 14 dominios: no mezclar estructuras.", "El Anexo A es una referencia: los controles se seleccionan según el tratamiento de riesgos."]
  },
  {
    temaId: "m1-nist",
    resumen: "El NIST Cybersecurity Framework 2.0 (2024) organiza los resultados de ciberseguridad en seis funciones aplicables a cualquier organización.",
    puntos: [
      { texto: "Funciones: Govern (GV), Identify (ID), Protect (PR), Detect (DE), Respond (RS) y Recover (RC). Govern es nueva en 2.0 y atraviesa las demás.", fuenteId: "nist-csf-2" },
      { texto: "Govern agrupa contexto organizacional, estrategia de gestión de riesgos, roles y responsabilidades, política, supervisión y gestión de riesgos de la cadena de suministro.", fuenteId: "nist-csf-2" },
      { texto: "Los perfiles (actual y objetivo) permiten medir brechas; los niveles (tiers 1 a 4: parcial, informado por riesgos, repetible, adaptativo) describen el rigor de la gestión.", fuenteId: "nist-csf-2" }
    ],
    trampas: ["La versión 1.1 tenía cinco funciones; 2.0 tiene seis.", "Los tiers no son niveles de madurez obligatorios ni una certificación."]
  },
  {
    temaId: "m1-mspi",
    resumen: "El Modelo de Seguridad y Privacidad de la Información (MSPI) de MinTIC es el referente para entidades públicas colombianas y se alinea con ISO/IEC 27001.",
    puntos: [
      { texto: "El ciclo del MSPI comprende diagnóstico, planificación, implementación, evaluación del desempeño y mejora continua.", fuenteId: "mspi" },
      { texto: "La Resolución 500 de 2021 de MinTIC adoptó el MSPI como habilitador de la Política de Gobierno Digital y fijó lineamientos para la estrategia de seguridad digital.", fuenteId: "res-500-2021" },
      { texto: "El modelo incluye un instrumento de autodiagnóstico que sirve de línea base para el plan de seguridad y privacidad de la entidad.", fuenteId: "mspi" }
    ],
    trampas: ["El MSPI incluye privacidad (datos personales), no solo seguridad técnica."]
  },
  {
    temaId: "m1-incid",
    resumen: "La gestión de incidentes busca detectar, contener, erradicar y recuperarse de eventos que comprometen la seguridad, y aprender de ellos.",
    puntos: [
      { texto: "Ciclo clásico (NIST SP 800-61): preparación; detección y análisis; contención, erradicación y recuperación; actividades posteriores (lecciones aprendidas). La revisión 3 lo alinea con las funciones del CSF 2.0.", fuenteId: "academico", referencia: "NIST SP 800-61" },
      { texto: "Evento no es lo mismo que incidente: un incidente es un evento que compromete o amenaza la confidencialidad, integridad o disponibilidad.", fuenteId: "academico" },
      { texto: "La función 13 del empleo exige registrar actuaciones, informes, indicadores, eventos e incidentes, fallas, soluciones y acciones de mejora.", fuenteId: "conv-51-2026", referencia: "Función 13" },
      { texto: "En Colombia operan el CSIRT de Gobierno (MinTIC) y el colCERT; los reportes siguen los lineamientos de seguridad digital vigentes.", fuenteId: "res-500-2021" }
    ],
    trampas: ["Restaurar antes de contener y erradicar puede reinfectar el entorno.", "Apagar un equipo destruye evidencia volátil."]
  },
  {
    temaId: "m1-soc",
    resumen: "Un SOC (centro de operaciones de seguridad) monitorea, detecta y responde. Se apoya en plataformas que cubren distintas fuentes de telemetría.",
    puntos: [
      { texto: "SIEM: centraliza y correlaciona registros de múltiples fuentes. SOAR: automatiza la respuesta con playbooks.", fuenteId: "academico" },
      { texto: "EDR: telemetría y respuesta en endpoints (aislar un equipo, matar procesos). NDR: análisis de tráfico de red. XDR: integra endpoints, correo, nube, identidad y red.", fuenteId: "academico" },
      { texto: "MITRE ATT&CK sirve para mapear tácticas y técnicas del adversario y medir la cobertura de detección.", fuenteId: "academico" }
    ]
  },
  {
    temaId: "m1-perim",
    resumen: "La seguridad perimetral filtra y examina el tráfico entre zonas de confianza. Hoy se complementa con segmentación interna y controles en las aplicaciones.",
    puntos: [
      { texto: "Firewall de estado: filtra en capas 3 y 4 considerando el estado de la conexión. NGFW: agrega identificación de aplicaciones, usuarios e IPS.", fuenteId: "academico" },
      { texto: "IDS detecta y alerta (pasivo, por ejemplo con puerto espejo); IPS bloquea en línea. El costo del IPS en línea son los falsos positivos.", fuenteId: "academico" },
      { texto: "WAF: protege aplicaciones web en capa 7 frente a inyección, XSS y otros ataques; sirve como parche virtual mientras se corrige el código.", fuenteId: "owasp-top10" },
      { texto: "Una DMZ aísla los servicios publicados; la política por defecto entre zonas debe ser denegar todo y permitir solo lo necesario.", fuenteId: "academico" }
    ]
  },
  {
    temaId: "m1-zt",
    resumen: "Zero Trust elimina la confianza implícita basada en la ubicación de red: cada acceso a cada recurso se evalúa.",
    puntos: [
      { texto: "Principios (NIST SP 800-207): todos los recursos se tratan como recursos; toda comunicación se asegura sin importar la ubicación; el acceso se concede por sesión; la política es dinámica; se monitorea el estado de los activos.", fuenteId: "nist-800-207", referencia: "Sección 2.1" },
      { texto: "Componentes lógicos: el punto de decisión de políticas (PDP: motor y administrador de políticas) y el punto de aplicación (PEP).", fuenteId: "nist-800-207" },
      { texto: "En la práctica se apoya en identidad fuerte con MFA, estado del dispositivo, microsegmentación y mínimo privilegio.", fuenteId: "academico" }
    ],
    trampas: ["Zero Trust no es un producto; es una arquitectura y una estrategia."]
  },
  {
    temaId: "m1-iam",
    resumen: "La gestión de identidades y accesos controla quién accede, a qué y durante cuánto tiempo, a lo largo del ciclo de vida de cada cuenta.",
    puntos: [
      { texto: "Factores de autenticación: algo que se sabe, algo que se tiene y algo que se es. MFA combina al menos dos categorías distintas.", fuenteId: "academico" },
      { texto: "Los autenticadores FIDO2/WebAuthn resisten phishing porque la credencial queda ligada al dominio legítimo.", fuenteId: "academico" },
      { texto: "Ciclo de vida: alta, cambio de cargo y retiro. La desvinculación debe desactivar las cuentas de inmediato; las revisiones periódicas detectan privilegios acumulados.", fuenteId: "academico" },
      { texto: "PAM gestiona cuentas privilegiadas (bóveda, sesiones grabadas, acceso justo a tiempo). La segregación de funciones evita que una persona controle un proceso crítico completo.", fuenteId: "academico" }
    ]
  },
  {
    temaId: "m1-vuln",
    resumen: "La gestión de vulnerabilidades es un ciclo continuo: descubrir, priorizar, remediar, verificar y reportar.",
    puntos: [
      { texto: "CVE identifica la vulnerabilidad; CVSS mide su severidad base de 0 a 10 (crítica 9.0-10.0, alta 7.0-8.9, media 4.0-6.9, baja 0.1-3.9).", fuenteId: "academico" },
      { texto: "Priorizar por riesgo: severidad, exposición (por ejemplo a Internet), explotación activa conocida y criticidad del activo.", fuenteId: "academico" },
      { texto: "Los escaneos autenticados ven más que los no autenticados. Las pruebas de penetración pueden ser de caja negra, gris o blanca.", fuenteId: "academico" },
      { texto: "El hardening reduce la superficie de ataque con líneas base (por ejemplo, benchmarks CIS). Todo plan de mitigación lleva responsable, fecha y verificación posterior.", fuenteId: "conv-51-2026", referencia: "Función 4" }
    ]
  },
  {
    temaId: "m1-app",
    resumen: "La seguridad de aplicaciones y del correo cubre los vectores de ataque más frecuentes contra una entidad pública: portales web y suplantación por correo.",
    puntos: [
      { texto: "OWASP Top 10 (edición 2021): control de acceso roto (A01), fallas criptográficas (A02), inyección (A03), diseño inseguro, configuración insegura, componentes vulnerables, fallas de autenticación, fallas de integridad, fallas de registro y monitoreo, y SSRF. Verifique si hay una edición más reciente.", fuenteId: "owasp-top10" },
      { texto: "SPF: registro TXT que lista los servidores autorizados para enviar correo del dominio. DKIM: firma criptográfica verificada con una clave pública en DNS.", fuenteId: "academico" },
      { texto: "DMARC: exige alineación con el dominio visible, define la política (none, quarantine o reject) y solicita reportes.", fuenteId: "rfc-7489" }
    ]
  },
  {
    temaId: "m1-activos",
    resumen: "El inventario de activos de información es la base del análisis de riesgos: no se protege lo que no se conoce.",
    puntos: [
      { texto: "Cada activo tiene propietario (responde por la información y su clasificación) y custodio (implementa los controles, con frecuencia TI).", fuenteId: "iso-27002-2022", referencia: "Controles 5.9 y 5.12" },
      { texto: "La clasificación considera confidencialidad, integridad y disponibilidad; en el Estado colombiano se articula con información pública, clasificada y reservada de la Ley 1712 de 2014.", fuenteId: "ley-1712-2014" },
      { texto: "La función 6 del empleo pide liderar la identificación, actualización y seguimiento del inventario.", fuenteId: "conv-51-2026", referencia: "Función 6" }
    ]
  },
  {
    temaId: "m1-datos",
    resumen: "La Ley 1581 de 2012 regula el tratamiento de datos personales: la seguridad de la información es uno de sus principios.",
    puntos: [
      { texto: "Actores: titular (la persona), responsable (decide sobre el tratamiento) y encargado (trata datos por cuenta del responsable).", fuenteId: "ley-1581-2012", referencia: "Artículo 3" },
      { texto: "Principios: legalidad, finalidad, libertad, veracidad o calidad, transparencia, acceso y circulación restringida, seguridad y confidencialidad.", fuenteId: "ley-1581-2012", referencia: "Artículo 4" },
      { texto: "Los datos sensibles tienen protección reforzada y su tratamiento está prohibido salvo excepciones legales.", fuenteId: "ley-1581-2012", referencia: "Artículos 5 y 6" },
      { texto: "La Superintendencia de Industria y Comercio es la autoridad de protección de datos.", fuenteId: "ley-1581-2012", referencia: "Artículo 19" }
    ]
  },
  {
    temaId: "m1-forense",
    resumen: "El análisis forense preserva y examina evidencia digital de manera que sea admisible y reproducible.",
    puntos: [
      { texto: "Fases: recolección, examen, análisis y reporte.", fuenteId: "nist-800-86" },
      { texto: "Orden de volatilidad: primero memoria y estado de red, luego disco. Se trabaja sobre copias bit a bit, nunca sobre el original.", fuenteId: "nist-800-86" },
      { texto: "La cadena de custodia documenta quién tuvo la evidencia, cuándo y para qué. Los hashes (por ejemplo SHA-256) demuestran que no cambió.", fuenteId: "academico" }
    ]
  },
  {
    temaId: "m1-gob",
    resumen: "El gobierno de ciberseguridad alinea la seguridad con la estrategia institucional mediante políticas, roles, recursos e indicadores.",
    puntos: [
      { texto: "Jerarquía documental: política (qué y por qué, aprobada por la alta dirección), estándares, procedimientos (cómo) y guías o instructivos.", fuenteId: "academico" },
      { texto: "Las funciones 2, 10 y 14 del empleo piden formular y actualizar políticas, mantener procedimientos, manuales y cartillas, y garantizar la sensibilización.", fuenteId: "conv-51-2026", referencia: "Funciones 2, 10 y 14" },
      { texto: "En el sector público, seguridad digital es una política de gestión y desempeño del MIPG; las decisiones pasan por el Comité Institucional de Gestión y Desempeño.", fuenteId: "dec-1499-2017" },
      { texto: "El CONPES 3995 de 2020 fija la política nacional de confianza y seguridad digital.", fuenteId: "conpes-3995" }
    ]
  }
];

import { q } from "./helpers";

export const M4 = [
  q({
    id: "M4-001", modulo: "M4_CLOUD_ARQ", temaId: "m4-resp", subtema: "AWS", dificultad: 3, tipo: "asesoria_institucional",
    enunciado: "La entidad despliega un sistema en máquinas virtuales IaaS de un proveedor de nube pública. Una vulnerabilidad crítica afecta al sistema operativo invitado. ¿Quién es responsable de aplicar el parche?",
    opciones: [
      ["El proveedor de nube, porque es dueño de la infraestructura", "Incorrecta: en IaaS el proveedor responde por la infraestructura física y la virtualización, no por el sistema operativo invitado."],
      ["La entidad cliente, porque en IaaS administra el sistema operativo invitado", "Correcta: así lo establece el modelo de responsabilidad compartida."],
      ["Nadie, porque la nube aplica parches automáticos a todo", "Incorrecta: no ocurre en IaaS salvo que el cliente contrate o configure ese servicio."],
      ["El fabricante del sistema operativo", "Incorrecta: publica el parche, pero no lo instala."]
    ],
    correcta: "B",
    explicacion: "La frontera de responsabilidad se desplaza según el modelo: en IaaS el cliente gestiona sistema operativo, aplicaciones, datos e identidades; en PaaS y SaaS el proveedor asume más capas.",
    fuenteId: "aws-shared", etiquetas: ["responsabilidad compartida"]
  }),
  q({
    id: "M4-002", modulo: "M4_CLOUD_ARQ", temaId: "m4-resp", subtema: "Azure", dificultad: 3, tipo: "conceptual",
    enunciado: "En un servicio SaaS de colaboración, ¿qué responsabilidades conserva siempre la entidad cliente, según el modelo de responsabilidad compartida de Microsoft?",
    opciones: [
      ["La seguridad física de los centros de datos", "Incorrecta: corresponde al proveedor en todos los modelos de nube."],
      ["La información y los datos, los dispositivos, y las cuentas e identidades", "Correcta: el cliente conserva estas responsabilidades sin importar el modelo."],
      ["El parcheo del hipervisor", "Incorrecta: es responsabilidad del proveedor."],
      ["La red física entre centros de datos", "Incorrecta: es del proveedor."]
    ],
    correcta: "B",
    explicacion: "Aunque el proveedor opere la aplicación, la entidad decide quién accede, cómo se clasifican y comparten los datos y qué dispositivos se conectan. Por eso la gestión de identidades es crítica en SaaS.",
    fuenteId: "azure-shared", etiquetas: ["SaaS"]
  }),
  q({
    id: "M4-003", modulo: "M4_CLOUD_ARQ", temaId: "m4-cloud", subtema: "Características NIST SP 800-145", dificultad: 2, tipo: "conceptual",
    enunciado: "¿Cuál de las siguientes NO es una de las cinco características esenciales de la computación en la nube según NIST SP 800-145?",
    opciones: [
      ["Autoservicio bajo demanda", "Incorrecta: es una característica esencial."],
      ["Elasticidad rápida", "Incorrecta: es una característica esencial."],
      ["Servicio medido", "Incorrecta: es una característica esencial."],
      ["Ubicación física fija y conocida de cada dato por el cliente", "Correcta: NIST describe la agrupación de recursos con independencia de ubicación."]
    ],
    correcta: "D",
    explicacion: "Las cinco características son autoservicio bajo demanda, amplio acceso por red, agrupación de recursos, elasticidad rápida y servicio medido. La ubicación puede definirse a alto nivel (región), lo que importa para requisitos de residencia de datos.",
    fuenteId: "nist-800-145", etiquetas: ["cloud"]
  }),
  q({
    id: "M4-004", modulo: "M4_CLOUD_ARQ", temaId: "m4-alm", subtema: "Objeto, bloque y archivo", dificultad: 3, tipo: "decision_tecnica",
    enunciado: "Se requiere almacenar millones de expedientes digitalizados en PDF, consultados por una aplicación mediante API HTTP, con políticas de ciclo de vida que los muevan a un nivel de archivo tras cinco años. ¿Qué tipo de almacenamiento es el más adecuado?",
    opciones: [
      ["Almacenamiento en bloque adjunto a una máquina virtual", "Incorrecta: está pensado para discos de sistemas y bases de datos, no para millones de objetos vía API."],
      ["Almacenamiento de objetos, como Amazon S3 o Azure Blob Storage", "Correcta: escala para datos no estructurados, se accede por API y admite políticas de ciclo de vida."],
      ["Memoria caché en RAM", "Incorrecta: es volátil."],
      ["Una base de datos relacional con los PDF en columnas binarias", "Incorrecta: encarece y complica la escala; la base de datos debe guardar metadatos."]
    ],
    correcta: "B",
    explicacion: "El almacenamiento de objetos guarda cada archivo con metadatos y un identificador, y ofrece niveles de acceso frecuente, infrecuente y de archivo. Se complementa con cifrado, versionado y bloqueo de objetos para retención.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["almacenamiento"]
  }),
  q({
    id: "M4-005", modulo: "M4_CLOUD_ARQ", temaId: "m4-cloud", subtema: "Pública, privada, híbrida", dificultad: 2, tipo: "conceptual",
    enunciado: "¿Qué describe mejor una nube híbrida según NIST SP 800-145?",
    opciones: [
      ["Una nube pública con varios clientes", "Incorrecta: describe la nube pública multiinquilino."],
      ["La composición de dos o más infraestructuras de nube distintas que permanecen como entidades únicas y se vinculan con tecnología que permite portabilidad de datos y aplicaciones", "Correcta: es la definición de NIST."],
      ["Un centro de datos tradicional con virtualización", "Incorrecta: la virtualización no hace por sí sola una nube."],
      ["Una nube compartida por entidades con una misión común", "Incorrecta: describe la nube comunitaria."]
    ],
    correcta: "B",
    explicacion: "En entidades públicas es común mantener sistemas misionales en infraestructura privada y llevar cargas elásticas o de respaldo a la nube pública.",
    fuenteId: "nist-800-145", etiquetas: ["cloud"]
  })
];

export const M5 = [
  q({
    id: "M5-001", modulo: "M5_CONTINUIDAD", temaId: "m5-metricas", subtema: "RPO", dificultad: 3, tipo: "escenario",
    enunciado: "El BIA fijó un RPO de 4 horas para el sistema de gestión de expedientes. Hoy se hace un respaldo completo diario a las 23:00. ¿Qué concluye?",
    opciones: [
      ["Se cumple, porque existe respaldo diario", "Incorrecta: un fallo a las 22:00 perdería hasta 23 horas de información."],
      ["No se cumple; se requieren copias o replicación con una frecuencia de 4 horas o menos", "Correcta: el RPO limita la pérdida de datos medida en tiempo."],
      ["Se cumple si la restauración tarda menos de 4 horas", "Incorrecta: esa condición se refiere al RTO."],
      ["El RPO no aplica a sistemas con base de datos", "Incorrecta: aplica a cualquier sistema con información."]
    ],
    correcta: "B",
    explicacion: "RPO es la cantidad máxima de datos que se puede perder, expresada en tiempo desde el último punto recuperable. RTO es el tiempo máximo para restablecer el servicio.",
    fuenteId: "nist-800-34", etiquetas: ["RPO", "BIA"]
  }),
  q({
    id: "M5-002", modulo: "M5_CONTINUIDAD", temaId: "m5-metricas", subtema: "RTO y MTTR", dificultad: 3, tipo: "conceptual",
    enunciado: "¿Cuál es la diferencia entre RTO y MTTR?",
    opciones: [
      ["Son sinónimos", "Incorrecta: uno es un objetivo y el otro una medición."],
      ["El RTO es el tiempo máximo tolerable de restablecimiento definido por el negocio; el MTTR es el tiempo promedio de reparación observado", "Correcta: el RTO es una meta y el MTTR un indicador operativo."],
      ["El RTO mide pérdida de datos y el MTTR, pérdida de servicio", "Incorrecta: la pérdida de datos la expresa el RPO."],
      ["El MTTR se define en el BIA y el RTO se calcula con estadísticas de incidentes", "Incorrecta: es al revés."]
    ],
    correcta: "B",
    explicacion: "Si el MTTR histórico de un servicio supera su RTO, la estrategia de recuperación no es suficiente y debe ajustarse.",
    fuenteId: "nist-800-34", etiquetas: ["RTO", "MTTR"]
  }),
  q({
    id: "M5-003", modulo: "M5_CONTINUIDAD", temaId: "m5-bia", dificultad: 2, tipo: "conceptual",
    enunciado: "¿Cuál es el propósito principal del análisis de impacto al negocio (BIA) en la planeación de contingencias?",
    opciones: [
      ["Elegir el proveedor de respaldo más económico", "Incorrecta: esa decisión ocurre después, con base en el BIA."],
      ["Identificar procesos y recursos críticos, el impacto de su interrupción en el tiempo y las prioridades y objetivos de recuperación", "Correcta: el BIA alimenta el RTO, el RPO y la estrategia."],
      ["Probar el plan de recuperación", "Incorrecta: las pruebas son una etapa posterior."],
      ["Inventariar licencias de software", "Incorrecta: no es su propósito."]
    ],
    correcta: "B",
    explicacion: "El BIA relaciona los sistemas con los procesos que soportan y estima el impacto de la interrupción. Sin BIA, las estrategias de recuperación no tienen justificación.",
    fuenteId: "nist-800-34", referencia: "Business Impact Analysis", etiquetas: ["BIA"]
  }),
  q({
    id: "M5-004", modulo: "M5_CONTINUIDAD", temaId: "m5-plan", subtema: "Estrategias de respaldo", dificultad: 3, tipo: "decision_tecnica",
    enunciado: "Tras un incidente de ransomware que cifró también los respaldos en red, se rediseña la estrategia. ¿Qué práctica reduce mejor ese riesgo?",
    opciones: [
      ["Hacer respaldos más frecuentes en el mismo almacenamiento de red", "Incorrecta: siguen expuestos al mismo atacante."],
      ["Mantener al menos una copia fuera de línea o inmutable, separada del dominio de producción, con pruebas de restauración", "Correcta: una copia que el atacante no puede alterar permite recuperar."],
      ["Cifrar los respaldos con la misma cuenta de administrador del dominio", "Incorrecta: si esa cuenta se compromete, los respaldos quedan expuestos."],
      ["Eliminar los respaldos antiguos para liberar espacio", "Incorrecta: reduce los puntos de recuperación."]
    ],
    correcta: "B",
    explicacion: "La regla 3-2-1 (tres copias, dos medios, una fuera del sitio) se refuerza hoy con copias inmutables o desconectadas y credenciales separadas. Un respaldo solo vale si se ha probado su restauración.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["respaldos", "ransomware"]
  }),
  q({
    id: "M5-005", modulo: "M5_CONTINUIDAD", temaId: "m5-plan", subtema: "Sitios alternos", dificultad: 3, tipo: "decision_tecnica",
    enunciado: "Un sistema misional tiene un RTO de 2 horas y un RPO cercano a cero. ¿Qué estrategia de sitio alterno es coherente con esos objetivos?",
    opciones: [
      ["Sitio frío: espacio físico y energía, sin equipos ni datos", "Incorrecta: alistarlo tomaría días o semanas."],
      ["Sitio caliente con replicación de datos continua o casi continua", "Correcta: equipos listos y datos actualizados permiten cumplir ambos objetivos."],
      ["Restaurar desde cintas semanales en otra ciudad", "Incorrecta: incumple RTO y RPO."],
      ["Sitio tibio con respaldos diarios", "Incorrecta: el respaldo diario no cumple un RPO cercano a cero."]
    ],
    correcta: "B",
    explicacion: "A menor RTO y RPO, mayor costo. El BIA justifica esa inversión solo para los procesos que lo requieren.",
    fuenteId: "nist-800-34", etiquetas: ["DRP"]
  }),
  q({
    id: "M5-006", modulo: "M5_CONTINUIDAD", temaId: "m5-pruebas", dificultad: 2, tipo: "conceptual",
    enunciado: "Se quiere validar que los responsables conocen sus roles en el plan de recuperación sin afectar sistemas en producción. ¿Qué tipo de prueba es la indicada?",
    opciones: [
      ["Prueba de interrupción total (full interruption)", "Incorrecta: detiene producción; es la de mayor riesgo."],
      ["Ejercicio de mesa (tabletop) basado en un escenario", "Correcta: los participantes recorren el plan en discusión, sin activar sistemas."],
      ["Prueba de penetración", "Incorrecta: evalúa seguridad, no continuidad."],
      ["Prueba de carga", "Incorrecta: evalúa rendimiento."]
    ],
    correcta: "B",
    explicacion: "Las pruebas suelen escalar en complejidad: revisión documental, ejercicio de mesa, ejercicio funcional y simulación completa. Sus hallazgos alimentan la actualización del plan.",
    fuenteId: "nist-800-34", referencia: "Testing, Training and Exercises", etiquetas: ["pruebas"]
  })
];

export const M6 = [
  q({
    id: "M6-001", modulo: "M6_PROYECTOS", temaId: "m6-form", subtema: "VPN y TIR", dificultad: 3, tipo: "interpretacion",
    enunciado: "La evaluación financiera de un proyecto de renovación de la plataforma de seguridad arroja un valor presente neto positivo con la tasa de descuento definida. ¿Cómo se interpreta?",
    opciones: [
      ["El proyecto recupera la inversión en el primer año", "Incorrecta: eso lo indica el periodo de recuperación, no el VPN."],
      ["Los flujos descontados superan la inversión: el proyecto genera valor por encima de la tasa exigida", "Correcta: VPN mayor que cero."],
      ["La TIR es igual a cero", "Incorrecta: si el VPN es positivo, la TIR supera la tasa de descuento."],
      ["El proyecto no tiene riesgos", "Incorrecta: el VPN no mide el riesgo."]
    ],
    correcta: "B",
    explicacion: "El VPN descuenta los flujos futuros a la tasa de oportunidad. En proyectos públicos de seguridad, muchos beneficios son pérdidas evitadas y deben estimarse con cuidado.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["evaluación financiera"]
  }),
  q({
    id: "M6-002", modulo: "M6_PROYECTOS", temaId: "m6-ind", subtema: "SLA", dificultad: 2, tipo: "conceptual",
    enunciado: "El contrato con el proveedor de monitoreo establece que el 95 % de los incidentes de prioridad 1 se atiendan en menos de 30 minutos cada mes. ¿Cómo se denomina ese compromiso?",
    opciones: [
      ["Indicador clave de rendimiento interno (KPI)", "Incorrecta: el KPI mide el desempeño; aquí se trata de un compromiso contractual."],
      ["Acuerdo de nivel de servicio (SLA)", "Correcta: es el nivel comprometido entre proveedor y cliente."],
      ["Objetivo de punto de recuperación (RPO)", "Incorrecta: el RPO se refiere a la pérdida de datos."],
      ["Matriz RACI", "Incorrecta: asigna roles y responsabilidades."]
    ],
    correcta: "B",
    explicacion: "El SLA se mide con indicadores. El asesor debe verificar que el SLA defina medición, fuente de datos, periodo y consecuencias por incumplimiento.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["SLA", "contratación"]
  }),
  q({
    id: "M6-003", modulo: "M6_PROYECTOS", temaId: "m6-pm", subtema: "Scrum y métodos ágiles", dificultad: 2, tipo: "conceptual",
    enunciado: "Según la Guía de Scrum 2020, ¿quién es responsable de maximizar el valor del producto y de gestionar eficazmente el Product Backlog?",
    opciones: [
      ["El Scrum Master", "Incorrecta: es responsable de la eficacia del equipo y del uso de Scrum."],
      ["El Product Owner", "Correcta: así lo define la guía."],
      ["Los Developers", "Incorrecta: son responsables de crear el incremento y el Sprint Backlog."],
      ["El patrocinador del proyecto", "Incorrecta: no es una responsabilidad definida en Scrum."]
    ],
    correcta: "B",
    explicacion: "La guía de 2020 habla de responsabilidades (accountabilities): Product Owner, Scrum Master y Developers, en un solo Scrum Team.",
    fuenteId: "scrum-guide", referencia: "Product Owner", etiquetas: ["Scrum"]
  }),
  q({
    id: "M6-004", modulo: "M6_PROYECTOS", temaId: "m6-ind", subtema: "KPI", dificultad: 3, tipo: "asesoria_institucional",
    enunciado: "Para el tablero de seguridad que se presentará a la alta dirección, ¿cuál indicador está mejor formulado?",
    opciones: [
      ["Mejorar la seguridad de la entidad", "Incorrecta: es un propósito, no es medible."],
      ["Número de herramientas de seguridad adquiridas", "Incorrecta: mide insumos, no resultados."],
      ["Porcentaje de vulnerabilidades críticas corregidas en 15 días o menos desde su detección, medido mensualmente", "Correcta: define fórmula, umbral, periodo y orientación a resultados."],
      ["Cantidad de correos enviados a los usuarios", "Incorrecta: mide actividad, no efecto."]
    ],
    correcta: "C",
    explicacion: "Un indicador útil tiene fórmula, fuente de datos, periodicidad, meta y responsable. Debe medir el resultado que la entidad quiere lograr.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["indicadores"]
  })
];

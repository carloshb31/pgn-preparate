import { q } from "./helpers";

export const M2_AMPLIACION = [
  q({
    id: "M2-011", modulo: "M2_REDES", temaId: "m2-modelos", dificultad: 1, tipo: "conceptual",
    enunciado: "¿Cuál es la secuencia del establecimiento de una conexión TCP?",
    opciones: [
      ["SYN, ACK, FIN", "Incorrecta: FIN cierra conexiones."],
      ["SYN, SYN-ACK, ACK", "Correcta: es el saludo de tres vías."],
      ["ACK, SYN, SYN-ACK", "Incorrecta: el orden está invertido."],
      ["DISCOVER, OFFER, ACK", "Incorrecta: se parece a DHCP."]
    ],
    correcta: "B",
    explicacion: "TCP es orientado a conexión: el cliente envía SYN, el servidor responde SYN-ACK y el cliente confirma con ACK. Un ataque de inundación SYN abusa de este proceso.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["TCP"]
  }),
  q({
    id: "M2-012", modulo: "M2_REDES", temaId: "m2-modelos", dificultad: 1, tipo: "conceptual",
    enunciado: "¿En qué capa del modelo OSI toma decisiones un router al reenviar paquetes entre redes?",
    opciones: [
      ["Capa 2, enlace de datos", "Incorrecta: allí operan los switches con direcciones MAC."],
      ["Capa 3, red", "Correcta: usa direcciones IP y tablas de enrutamiento."],
      ["Capa 4, transporte", "Incorrecta: allí operan TCP y UDP."],
      ["Capa 7, aplicación", "Incorrecta: allí operan protocolos como HTTP."]
    ],
    correcta: "B",
    explicacion: "El router decide con la dirección IP de destino y la regla del prefijo más largo.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["OSI"]
  }),
  q({
    id: "M2-013", modulo: "M2_REDES", temaId: "m2-ha", dificultad: 2, tipo: "decision_tecnica",
    enunciado: "La red de una sede tiene equipos de dos fabricantes y se necesita redundancia de la puerta de enlace con un protocolo estándar. ¿Cuál elegiría?",
    opciones: [
      ["HSRP", "Incorrecta: es propietario de Cisco."],
      ["VRRP", "Correcta: es un estándar abierto de redundancia de primer salto."],
      ["STP", "Incorrecta: evita bucles de capa 2, no da redundancia de gateway."],
      ["OSPF", "Incorrecta: es enrutamiento dinámico; no provee una IP de gateway virtual."]
    ],
    correcta: "B",
    explicacion: "VRRP presenta una dirección IP virtual compartida por varios routers; si falla el principal, otro asume la dirección sin reconfigurar los equipos.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["alta disponibilidad"]
  }),
  q({
    id: "M2-014", modulo: "M2_REDES", temaId: "m2-ha", dificultad: 2, tipo: "conceptual",
    enunciado: "Se conectan dos enlaces de 10 Gb/s entre el switch de núcleo y el de distribución para sumar capacidad y redundancia. ¿Qué tecnología permite usarlos como un solo enlace lógico?",
    opciones: [
      ["Agregación de enlaces con LACP (IEEE 802.3ad)", "Correcta: agrupa enlaces físicos en uno lógico."],
      ["NAT", "Incorrecta: traduce direcciones."],
      ["Spanning Tree en modo bloqueo", "Incorrecta: bloquearía uno de los enlaces."],
      ["DHCP relay", "Incorrecta: reenvía solicitudes DHCP."]
    ],
    correcta: "A",
    explicacion: "LACP negocia el grupo de enlaces; si uno falla, el tráfico continúa por los demás. STP ve el grupo como un único enlace.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["LACP"]
  }),
  q({
    id: "M2-015", modulo: "M2_REDES", temaId: "m2-ip", subtema: "IPv6", dificultad: 3, tipo: "conceptual",
    enunciado: "¿Qué prefijo identifica las direcciones IPv6 de enlace local (link-local)?",
    opciones: [
      ["2000::/3", "Incorrecta: corresponde a unicast global."],
      ["fe80::/10", "Correcta: son direcciones válidas solo en el enlace local."],
      ["fc00::/7", "Incorrecta: corresponde a direcciones locales únicas (ULA)."],
      ["ff00::/8", "Incorrecta: corresponde a multicast."]
    ],
    correcta: "B",
    explicacion: "Toda interfaz IPv6 tiene una dirección link-local, usada por protocolos como el descubrimiento de vecinos. IPv6 no tiene broadcast.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["IPv6"]
  }),
  q({
    id: "M2-016", modulo: "M2_REDES", temaId: "m2-l2", dificultad: 2, tipo: "conceptual",
    enunciado: "¿Cuántos bits tiene el identificador de VLAN en la etiqueta IEEE 802.1Q?",
    opciones: [
      ["8 bits", "Incorrecta: permitiría solo 256 VLAN."],
      ["12 bits", "Correcta: admite hasta 4094 VLAN utilizables."],
      ["16 bits", "Incorrecta: la etiqueta completa tiene 32 bits, pero el VLAN ID ocupa 12."],
      ["24 bits", "Incorrecta: no corresponde al estándar."]
    ],
    correcta: "B",
    explicacion: "Con 12 bits hay 4096 valores; 0 y 4095 están reservados, por lo que quedan 4094 VLAN utilizables.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["VLAN"]
  }),
  q({
    id: "M2-017", modulo: "M2_REDES", temaId: "m2-diag", dificultad: 2, tipo: "decision_tecnica",
    enunciado: "Para monitorear switches y routers sin exponer credenciales en texto claro, ¿qué versión de SNMP debe usarse?",
    opciones: [
      ["SNMPv1", "Incorrecta: usa cadenas de comunidad en claro."],
      ["SNMPv2c", "Incorrecta: también envía la comunidad en claro."],
      ["SNMPv3", "Correcta: ofrece autenticación y cifrado."],
      ["Cualquiera, si se cambia la comunidad public", "Incorrecta: cambiar la comunidad no la cifra."]
    ],
    correcta: "C",
    explicacion: "SNMPv3 incorpora el modelo de seguridad basado en usuarios con autenticación e integridad, y cifrado opcional.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["monitoreo"]
  }),
  q({
    id: "M2-018", modulo: "M2_REDES", temaId: "m2-serv", subtema: "DNS", dificultad: 3, tipo: "conceptual",
    enunciado: "¿En qué tipo de registro DNS se publica la política DMARC de un dominio?",
    opciones: [
      ["Un registro MX del dominio", "Incorrecta: MX indica los servidores de correo entrantes."],
      ["Un registro TXT en el subdominio _dmarc del dominio", "Correcta: así lo define el estándar."],
      ["Un registro PTR", "Incorrecta: PTR resuelve direcciones a nombres."],
      ["Un registro CNAME en la raíz del dominio", "Incorrecta: no es el mecanismo de DMARC."]
    ],
    correcta: "B",
    explicacion: "SPF, DKIM y DMARC se publican en registros TXT; DMARC usa el nombre _dmarc.dominio.",
    fuenteId: "rfc-7489", etiquetas: ["DNS", "correo"]
  }),
  q({
    id: "M2-019", modulo: "M2_REDES", temaId: "m2-wan", subtema: "SD-WAN", dificultad: 3, tipo: "decision_tecnica",
    enunciado: "La entidad conecta 30 sedes con MPLS y quiere aprovechar enlaces de Internet, con selección de ruta por aplicación y gestión centralizada. ¿Qué tecnología responde a esa necesidad?",
    opciones: [
      ["SD-WAN", "Correcta: crea un overlay sobre varios transportes con control centralizado."],
      ["Spanning Tree", "Incorrecta: opera en capa 2 dentro de una red local."],
      ["NAT estático", "Incorrecta: traduce direcciones."],
      ["VLAN nativa", "Incorrecta: es un concepto de troncales 802.1Q."]
    ],
    correcta: "A",
    explicacion: "SD-WAN mide la calidad de cada enlace y dirige cada aplicación por el mejor camino. La seguridad del tráfico por Internet se resuelve con túneles cifrados.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["WAN"]
  })
];

export const M3_AMPLIACION = [
  q({
    id: "M3-007", modulo: "M3_SO", temaId: "m3-win-seg", dificultad: 2, tipo: "conceptual",
    enunciado: "Al investigar un ataque de fuerza bruta contra cuentas del dominio, ¿qué identificador de evento de seguridad de Windows corresponde a un inicio de sesión fallido?",
    opciones: [
      ["4624", "Incorrecta: es un inicio de sesión exitoso."],
      ["4625", "Correcta: es un inicio de sesión fallido."],
      ["4720", "Incorrecta: es la creación de una cuenta."],
      ["4740", "Incorrecta: es el bloqueo de una cuenta."]
    ],
    correcta: "B",
    explicacion: "Correlacionar muchos 4625 con algún 4624 posterior desde el mismo origen es un patrón típico de fuerza bruta exitosa.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["Windows", "auditoría"]
  }),
  q({
    id: "M3-008", modulo: "M3_SO", temaId: "m3-win-seg", dificultad: 3, tipo: "decision_tecnica",
    enunciado: "Todas las estaciones de trabajo comparten la misma contraseña de administrador local. ¿Qué solución mitiga el movimiento lateral derivado de esa práctica?",
    opciones: [
      ["Deshabilitar el firewall de Windows", "Incorrecta: aumenta el riesgo."],
      ["Implementar LAPS para que cada equipo tenga una contraseña de administrador local única y rotada", "Correcta: una credencial robada ya no sirve en otros equipos."],
      ["Publicar la contraseña en el manual de la mesa de ayuda", "Incorrecta: la expone."],
      ["Agregar a todos los usuarios al grupo de administradores", "Incorrecta: amplía los privilegios."]
    ],
    correcta: "B",
    explicacion: "LAPS almacena la contraseña en el directorio con permisos controlados y la rota periódicamente.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["Windows", "credenciales"]
  }),
  q({
    id: "M3-009", modulo: "M3_SO", temaId: "m3-linux-adm", subtema: "Permisos", dificultad: 3, tipo: "conceptual",
    enunciado: "¿Qué efecto tiene el sticky bit en un directorio compartido como /tmp?",
    opciones: [
      ["Ejecuta los archivos con los privilegios del dueño", "Incorrecta: describe SUID."],
      ["Solo el dueño de un archivo (o root) puede borrarlo o renombrarlo, aunque otros tengan escritura en el directorio", "Correcta: protege los archivos de cada usuario."],
      ["Hace que los archivos hereden el grupo del directorio", "Incorrecta: describe SGID en directorios."],
      ["Impide leer cualquier archivo del directorio", "Incorrecta: no restringe la lectura."]
    ],
    correcta: "B",
    explicacion: "/tmp suele tener permisos 1777: todos escriben, pero cada uno solo borra lo propio.",
    fuenteId: "linux-man", referencia: "chmod(1)", etiquetas: ["Linux"]
  }),
  q({
    id: "M3-010", modulo: "M3_SO", temaId: "m3-linux-seg", dificultad: 2, tipo: "asesoria_institucional",
    enunciado: "Cuatro administradores comparten la contraseña de root en los servidores Linux. ¿Qué recomienda?",
    opciones: [
      ["Cambiar la contraseña de root cada semana", "Incorrecta: no resuelve la falta de trazabilidad."],
      ["Usar cuentas nominales con privilegios mediante sudo y deshabilitar el acceso directo de root", "Correcta: cada acción queda asociada a una persona."],
      ["Permitir el acceso de root solo por SSH con contraseña", "Incorrecta: mantiene la cuenta compartida y expuesta."],
      ["Desactivar los registros para mejorar el rendimiento", "Incorrecta: elimina la trazabilidad."]
    ],
    correcta: "B",
    explicacion: "La trazabilidad exige identidades individuales. sudo registra quién ejecutó cada comando privilegiado.",
    fuenteId: "linux-man", esInferencia: true, etiquetas: ["Linux", "privilegios"]
  }),
  q({
    id: "M3-011", modulo: "M3_SO", temaId: "m3-win-ad", dificultad: 4, tipo: "conceptual",
    enunciado: "¿Qué rol FSMO actúa como fuente de hora autoritativa del dominio en Active Directory?",
    opciones: [
      ["Maestro de esquema", "Incorrecta: controla cambios al esquema del bosque."],
      ["Maestro RID", "Incorrecta: asigna bloques de identificadores relativos."],
      ["Emulador PDC", "Correcta: es la referencia de tiempo del dominio."],
      ["Maestro de infraestructura", "Incorrecta: actualiza referencias entre dominios."]
    ],
    correcta: "C",
    explicacion: "La hora es crítica porque Kerberos tolera por defecto solo 5 minutos de diferencia. El emulador PDC del dominio raíz debe sincronizarse con una fuente externa confiable.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["Active Directory"]
  })
];

export const M4_M6_AMPLIACION = [
  q({
    id: "M4-006", modulo: "M4_CLOUD_ARQ", temaId: "m4-virt", dificultad: 2, tipo: "conceptual",
    enunciado: "¿Qué caracteriza a un hipervisor de tipo 1?",
    opciones: [
      ["Se ejecuta directamente sobre el hardware", "Correcta: por ejemplo ESXi, Hyper-V o KVM."],
      ["Se instala como una aplicación sobre un sistema operativo", "Incorrecta: describe el tipo 2."],
      ["Solo ejecuta contenedores", "Incorrecta: ejecuta máquinas virtuales."],
      ["No permite aislar máquinas virtuales", "Incorrecta: el aislamiento es su función."]
    ],
    correcta: "A",
    explicacion: "Los hipervisores de tipo 1 son los de los centros de datos; los de tipo 2 se usan sobre todo en estaciones de trabajo.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["virtualización"]
  }),
  q({
    id: "M4-007", modulo: "M4_CLOUD_ARQ", temaId: "m4-virt", dificultad: 3, tipo: "interpretacion",
    enunciado: "¿Qué diferencia técnica explica que los contenedores ofrezcan menor aislamiento que las máquinas virtuales?",
    opciones: [
      ["Los contenedores comparten el kernel del sistema operativo anfitrión", "Correcta: una falla del kernel afecta a todos."],
      ["Los contenedores no pueden usar red", "Incorrecta: sí usan red."],
      ["Los contenedores siempre se ejecutan como root", "Incorrecta: pueden y deben ejecutarse sin privilegios."],
      ["Las máquinas virtuales no tienen sistema operativo", "Incorrecta: cada una tiene el suyo."]
    ],
    correcta: "A",
    explicacion: "Por eso se recomiendan imágenes mínimas, ejecución sin privilegios, perfiles de seguridad y aislamiento por espacios de nombres y políticas de red.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["contenedores"]
  }),
  q({
    id: "M4-008", modulo: "M4_CLOUD_ARQ", temaId: "m4-arq", dificultad: 3, tipo: "asesoria_institucional",
    enunciado: "Un equipo propone migrar el sistema misional monolítico a microservicios. ¿Qué consideración debe incluir el concepto técnico?",
    opciones: [
      ["Los microservicios eliminan la necesidad de monitoreo", "Incorrecta: lo hacen más necesario."],
      ["Permiten desplegar y escalar componentes de forma independiente, a cambio de mayor complejidad operativa, de observabilidad y de seguridad entre servicios", "Correcta: es el balance real de la decisión."],
      ["Siempre reducen el costo total", "Incorrecta: pueden aumentarlo."],
      ["Hacen innecesarias las APIs", "Incorrecta: se comunican por APIs."]
    ],
    correcta: "B",
    explicacion: "Un concepto técnico debe explicitar beneficios, costos y riesgos, y la capacidad del equipo para operar la arquitectura propuesta.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["arquitectura"]
  }),
  q({
    id: "M4-009", modulo: "M4_CLOUD_ARQ", temaId: "m4-alm", dificultad: 3, tipo: "decision_tecnica",
    enunciado: "La entidad quiere poder revocar el acceso a los datos cifrados en la nube si termina el contrato con el proveedor. ¿Qué opción de cifrado lo facilita?",
    opciones: [
      ["Cifrado con claves gestionadas por el cliente en un servicio de gestión de claves", "Correcta: la entidad controla el ciclo de vida de las claves."],
      ["No cifrar los datos", "Incorrecta: no hay nada que revocar."],
      ["Cifrado solo en tránsito con TLS", "Incorrecta: no protege los datos en reposo."],
      ["Comprimir los archivos", "Incorrecta: comprimir no es cifrar."]
    ],
    correcta: "A",
    explicacion: "Con claves gestionadas por el cliente (por ejemplo en AWS KMS o Azure Key Vault), deshabilitar o destruir la clave vuelve ilegibles los datos.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["cifrado", "cloud"]
  }),
  q({
    id: "M5-007", modulo: "M5_CONTINUIDAD", temaId: "m5-metricas", dificultad: 3, tipo: "resolucion_problemas",
    enunciado: "Un proveedor ofrece un SLA de disponibilidad del 99,9 % anual. ¿Cuánto tiempo de caída al año permite aproximadamente?",
    opciones: [
      ["Unos 52 minutos", "Incorrecta: corresponde a 99,99 %."],
      ["Unas 8,76 horas", "Correcta: 0,1 % de 8.760 horas."],
      ["Unos 3,65 días", "Incorrecta: corresponde a 99 %."],
      ["Unos 5 minutos", "Incorrecta: corresponde a 99,999 %."]
    ],
    correcta: "B",
    explicacion: "Un año tiene 8.760 horas; el 0,1 % son 8,76 horas. Al evaluar un SLA, compárelo con el RTO del proceso que soporta.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["disponibilidad", "SLA"]
  }),
  q({
    id: "M5-008", modulo: "M5_CONTINUIDAD", temaId: "m5-plan", subtema: "Estrategias de respaldo", dificultad: 3, tipo: "resolucion_problemas",
    enunciado: "Se hace un respaldo completo el domingo y diferenciales de lunes a sábado. El jueves falla el servidor. ¿Qué se necesita para restaurar hasta el último respaldo?",
    opciones: [
      ["El completo del domingo y todos los diferenciales de lunes a miércoles", "Incorrecta: describe la restauración con incrementales."],
      ["El completo del domingo y el diferencial del miércoles", "Correcta: cada diferencial contiene todo lo cambiado desde el último completo."],
      ["Solo el diferencial del miércoles", "Incorrecta: falta la base completa."],
      ["Solo el completo del domingo", "Incorrecta: se perderían los cambios hasta el miércoles."]
    ],
    correcta: "B",
    explicacion: "El diferencial crece cada día pero simplifica la restauración. El incremental es más pequeño, pero exige toda la cadena desde el completo.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["respaldos"]
  }),
  q({
    id: "M5-009", modulo: "M5_CONTINUIDAD", temaId: "m5-bia", dificultad: 3, tipo: "interpretacion",
    enunciado: "El BIA estableció que el proceso de notificaciones no tolera una interrupción mayor a 8 horas (MTD). ¿Qué RTO es coherente para el sistema que lo soporta?",
    opciones: [
      ["12 horas", "Incorrecta: supera el tiempo máximo tolerable."],
      ["Un valor menor a 8 horas, dejando margen para reanudar el proceso", "Correcta: el RTO debe ser menor que el MTD."],
      ["Exactamente 24 horas", "Incorrecta: supera el MTD."],
      ["El RTO no se relaciona con el MTD", "Incorrecta: se deriva de él."]
    ],
    correcta: "B",
    explicacion: "El MTD incluye el tiempo para recuperar la tecnología (RTO) y el tiempo para verificar y reanudar el proceso.",
    fuenteId: "nist-800-34", etiquetas: ["BIA", "RTO"]
  }),
  q({
    id: "M6-005", modulo: "M6_PROYECTOS", temaId: "m6-contr", dificultad: 2, tipo: "conceptual",
    enunciado: "¿Qué norma es el Estatuto General de Contratación de la Administración Pública en Colombia?",
    opciones: [
      ["Ley 80 de 1993", "Correcta: complementada por la Ley 1150 de 2007."],
      ["Ley 1712 de 2014", "Incorrecta: regula transparencia y acceso a la información."],
      ["Ley 594 de 2000", "Incorrecta: es la Ley General de Archivos."],
      ["Ley 87 de 1993", "Incorrecta: regula el control interno."]
    ],
    correcta: "A",
    explicacion: "La Ley 1150 de 2007 introdujo medidas de eficiencia y transparencia, y definió modalidades como la selección abreviada y el concurso de méritos.",
    fuenteId: "ley-80-1993", etiquetas: ["contratación"]
  }),
  q({
    id: "M6-006", modulo: "M6_PROYECTOS", temaId: "m6-contr", dificultad: 3, tipo: "asesoria_institucional",
    enunciado: "Para renovar el licenciamiento de la plataforma de seguridad, ¿qué debe preceder a la elección de la modalidad de contratación?",
    opciones: [
      ["La firma del contrato", "Incorrecta: es posterior."],
      ["Los estudios previos con la identificación de la necesidad, el análisis del sector y la justificación técnica", "Correcta: sustentan la modalidad y el presupuesto."],
      ["La compra directa al proveedor actual", "Incorrecta: requiere justificación legal."],
      ["La publicación del acta de liquidación", "Incorrecta: corresponde al cierre del contrato."]
    ],
    correcta: "B",
    explicacion: "La función 9 del empleo pide identificar necesidades y adelantar procesos de contratación. El análisis del sector y la necesidad bien definida sostienen la decisión ante los órganos de control.",
    fuenteId: "conv-51-2026", referencia: "Función 9", esInferencia: true, etiquetas: ["contratación"]
  }),
  q({
    id: "M6-007", modulo: "M6_PROYECTOS", temaId: "m6-pm", dificultad: 3, tipo: "interpretacion",
    enunciado: "En el seguimiento del proyecto de renovación de firewalls, el índice de desempeño del costo (CPI) es 0,85. ¿Qué indica?",
    opciones: [
      ["El proyecto está por debajo del presupuesto", "Incorrecta: CPI menor que 1 indica lo contrario."],
      ["Por cada peso gastado se obtiene 0,85 de valor ganado: hay sobrecosto", "Correcta: CPI = EV / AC."],
      ["El proyecto va adelantado en el cronograma", "Incorrecta: eso lo indica el SPI."],
      ["El alcance aumentó un 15 %", "Incorrecta: el CPI no mide alcance."]
    ],
    correcta: "B",
    explicacion: "CPI y SPI menores que 1 indican sobrecosto y atraso. Ante una desviación, el asesor debe cuantificar el impacto y proponer alternativas.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["valor ganado"]
  })
];

export const M7_M8_AMPLIACION = [
  q({
    id: "M7-010", modulo: "M7_INSTITUCIONAL", temaId: "m7-pgn", dificultad: 2, tipo: "conceptual",
    enunciado: "¿Cuáles son las funciones misionales que ejerce la Procuraduría General de la Nación?",
    opciones: [
      ["Preventiva, de intervención y disciplinaria", "Correcta: son las tres funciones misionales."],
      ["Legislativa, fiscal y judicial", "Incorrecta: corresponden a otras ramas y órganos."],
      ["Fiscal, de auditoría y de cobro coactivo", "Incorrecta: describen el control fiscal."],
      ["Electoral y de registro civil", "Incorrecta: corresponden a la organización electoral."]
    ],
    correcta: "A",
    explicacion: "La PGN previene, interviene en procesos para defender el orden jurídico, el patrimonio público y los derechos, y ejerce el poder disciplinario.",
    fuenteId: "dl-262-2000", etiquetas: ["PGN"]
  }),
  q({
    id: "M7-011", modulo: "M7_INSTITUCIONAL", temaId: "m7-pgn", dificultad: 3, tipo: "normativa",
    enunciado: "Según el formato de la Convocatoria 51-2026, ¿quién resuelve la apelación contra la decisión de una reclamación sobre la lista de admitidos y no admitidos?",
    opciones: [
      ["El Procurador General de la Nación", "Incorrecta: no es la instancia prevista."],
      ["La Comisión de Carrera", "Correcta: así lo dispone la sección 7 del formato."],
      ["La Comisión Nacional del Servicio Civil", "Incorrecta: la PGN tiene un régimen especial de carrera."],
      ["La Universidad de Antioquia", "Incorrecta: es el operador del concurso."]
    ],
    correcta: "B",
    explicacion: "La reclamación se presenta ante el jefe de la Oficina de Selección y Carrera dentro de los dos días hábiles siguientes a la publicación; contra su decisión procede apelación ante la Comisión de Carrera.",
    fuenteId: "conv-51-2026", referencia: "Sección 7", etiquetas: ["carrera"]
  }),
  q({
    id: "M7-012", modulo: "M7_INSTITUCIONAL", temaId: "m7-ofi", dificultad: 1, tipo: "conceptual",
    enunciado: "Se necesita resumir 20.000 registros de tickets por sede, mes y prioridad en una hoja de cálculo. ¿Qué herramienta es la más adecuada?",
    opciones: [
      ["Una tabla dinámica", "Correcta: agrupa y resume grandes volúmenes de datos."],
      ["El corrector ortográfico", "Incorrecta: no resume datos."],
      ["Combinar correspondencia", "Incorrecta: genera documentos a partir de datos."],
      ["Insertar un comentario", "Incorrecta: no procesa datos."]
    ],
    correcta: "A",
    explicacion: "Las tablas dinámicas permiten cambiar filas, columnas y filtros sin fórmulas, y son base para tableros de indicadores.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["ofimática"]
  }),
  q({
    id: "M7-013", modulo: "M7_INSTITUCIONAL", temaId: "m7-mipg", dificultad: 3, tipo: "conceptual",
    enunciado: "En el esquema de líneas de defensa del MIPG, ¿quién ejerce la tercera línea?",
    opciones: [
      ["Los líderes de proceso", "Incorrecta: son la primera línea."],
      ["La oficina de control interno, con evaluación independiente", "Correcta: es la tercera línea."],
      ["Las áreas de planeación y riesgos", "Incorrecta: suelen ejercer la segunda línea."],
      ["La alta dirección", "Incorrecta: es la línea estratégica."]
    ],
    correcta: "B",
    explicacion: "La primera línea gestiona los riesgos en el día a día, la segunda monitorea y asesora, y la tercera evalúa de forma independiente.",
    fuenteId: "dec-1499-2017", etiquetas: ["MIPG", "control interno"]
  }),
  q({
    id: "M7-014", modulo: "M7_INSTITUCIONAL", temaId: "m7-ciud", dificultad: 2, tipo: "normativa",
    enunciado: "Según la Ley 1755 de 2015, ¿cuál es el término general para resolver un derecho de petición?",
    opciones: [
      ["5 días hábiles", "Incorrecta: no es el término general."],
      ["15 días hábiles", "Correcta: es el término general del artículo 14."],
      ["30 días calendario", "Incorrecta: 30 días aplica a consultas y son hábiles."],
      ["60 días hábiles", "Incorrecta: no corresponde."]
    ],
    correcta: "B",
    explicacion: "El artículo 14 fija 15 días hábiles como regla general, 10 días para solicitudes de documentos e información y 30 días para consultas.",
    fuenteId: "ley-1755-2015", referencia: "Artículo 14", etiquetas: ["derecho de petición"]
  }),
  q({
    id: "M7-015", modulo: "M7_INSTITUCIONAL", temaId: "m7-doc", dificultad: 2, tipo: "conceptual",
    enunciado: "¿Qué instrumento archivístico define, por cada serie documental, los tiempos de permanencia en cada etapa del ciclo vital y su disposición final?",
    opciones: [
      ["La tabla de retención documental (TRD)", "Correcta: es el instrumento de retención."],
      ["El inventario de activos de información", "Incorrecta: es un instrumento de seguridad y transparencia."],
      ["El manual de funciones", "Incorrecta: describe empleos."],
      ["El plan anual de adquisiciones", "Incorrecta: planea compras."]
    ],
    correcta: "A",
    explicacion: "La TRD se complementa con la tabla de valoración documental (TVD) para fondos acumulados y con el programa de gestión documental (PGD).",
    fuenteId: "ley-594-2000", etiquetas: ["gestión documental"]
  }),
  q({
    id: "M7-016", modulo: "M7_INSTITUCIONAL", temaId: "m7-const", subtema: "Órganos de control", dificultad: 2, tipo: "normativa",
    enunciado: "Según el artículo 117 de la Constitución, ¿cuáles son los órganos de control?",
    opciones: [
      ["El Ministerio Público y la Contraloría General de la República", "Correcta: así lo dispone el artículo 117."],
      ["La Fiscalía y la Policía Nacional", "Incorrecta: no son órganos de control en ese sentido."],
      ["El Consejo de Estado y la Corte Constitucional", "Incorrecta: pertenecen a la rama judicial."],
      ["La Registraduría y el Consejo Nacional Electoral", "Incorrecta: forman la organización electoral."]
    ],
    correcta: "A",
    explicacion: "Los órganos de control son autónomos e independientes de las tres ramas del poder público, según el artículo 113.",
    fuenteId: "cp-1991", referencia: "Artículo 117", etiquetas: ["Constitución"]
  }),
  q({
    id: "M8-006", modulo: "M8_NORMATIVA_TIC", temaId: "m8-cpaca", dificultad: 2, tipo: "normativa",
    enunciado: "Según el artículo 74 de la Ley 1437 de 2011, ¿qué recursos proceden por regla general contra los actos administrativos definitivos?",
    opciones: [
      ["Reposición, apelación y queja", "Correcta: son los recursos del artículo 74."],
      ["Casación y revisión", "Incorrecta: son recursos judiciales extraordinarios."],
      ["Tutela y acción popular", "Incorrecta: son acciones constitucionales."],
      ["Súplica y nulidad", "Incorrecta: no corresponden a la regla general del procedimiento administrativo."]
    ],
    correcta: "A",
    explicacion: "La reposición se presenta ante quien expidió el acto; la apelación, ante el inmediato superior; la queja, cuando se rechaza la apelación.",
    fuenteId: "ley-1437-2011", referencia: "Artículo 74", etiquetas: ["CPACA"]
  }),
  q({
    id: "M8-007", modulo: "M8_NORMATIVA_TIC", temaId: "m8-delitos", dificultad: 3, tipo: "normativa",
    enunciado: "Un contratista copia sin autorización una base de datos con información personal de ciudadanos y la vende. ¿Qué artículo de la Ley 1273 de 2009 describe principalmente esa conducta?",
    opciones: [
      ["Artículo 269F, violación de datos personales", "Correcta: sanciona obtener, vender o divulgar datos personales sin autorización."],
      ["Artículo 269B, obstaculización ilegítima", "Incorrecta: se refiere a impedir el funcionamiento de un sistema."],
      ["Artículo 269D, daño informático", "Incorrecta: se refiere a destruir o alterar datos o sistemas."],
      ["Artículo 269G, suplantación de sitios web", "Incorrecta: no hubo un sitio falso."]
    ],
    correcta: "A",
    explicacion: "Además de la responsabilidad penal, el caso implica una brecha de datos personales que debe gestionarse según la Ley 1581 de 2012.",
    fuenteId: "ley-1273-2009", referencia: "Artículo 269F", etiquetas: ["delitos informáticos", "datos personales"]
  }),
  q({
    id: "M8-008", modulo: "M8_NORMATIVA_TIC", temaId: "m8-gd", dificultad: 3, tipo: "normativa",
    enunciado: "En la Política de Gobierno Digital actualizada por el Decreto 767 de 2022, ¿cuál de los siguientes es un habilitador?",
    opciones: [
      ["Seguridad y privacidad de la información", "Correcta: es uno de los habilitadores, junto con arquitectura, cultura y apropiación, y servicios ciudadanos digitales."],
      ["Control fiscal", "Incorrecta: es función de la Contraloría."],
      ["Régimen disciplinario", "Incorrecta: no es un habilitador de la política."],
      ["Presupuesto general de la Nación", "Incorrecta: no es un habilitador."]
    ],
    correcta: "A",
    explicacion: "Los habilitadores permiten desarrollar las líneas de acción de la política. El MSPI concreta el habilitador de seguridad y privacidad. Verifique la norma vigente antes del examen.",
    fuenteId: "dec-767-2022", etiquetas: ["Gobierno Digital"]
  }),
  q({
    id: "M8-009", modulo: "M8_NORMATIVA_TIC", temaId: "m8-transp", dificultad: 3, tipo: "normativa",
    enunciado: "¿Cuáles son los instrumentos de gestión de información pública previstos por la Ley 1712 de 2014?",
    opciones: [
      ["Registro de activos de información, índice de información clasificada y reservada, y esquema de publicación", "Correcta: son los tres instrumentos."],
      ["Matriz de riesgos, plan de continuidad y DRP", "Incorrecta: son instrumentos de seguridad y continuidad."],
      ["Plan de compras, presupuesto y PAC", "Incorrecta: son instrumentos financieros."],
      ["Manual de funciones, organigrama y nómina", "Incorrecta: son instrumentos de talento humano."]
    ],
    correcta: "A",
    explicacion: "El registro de activos de información conecta la transparencia con el inventario de activos que exige la función 6 del empleo.",
    fuenteId: "ley-1712-2014", etiquetas: ["transparencia"]
  })
];

import { q } from "./helpers";

export const M2 = [
  q({
    id: "M2-001", modulo: "M2_REDES", temaId: "m2-ip", subtema: "Subnetting y VLSM", dificultad: 4, tipo: "resolucion_problemas",
    enunciado: "Se asignó el bloque 10.20.0.0/24 para cinco sedes y cada sede necesita hasta 50 hosts. ¿Qué concluye?",
    opciones: [
      ["Usar /26 en todas las sedes", "Incorrecta: una /24 dividida en /26 da solo 4 subredes de 62 hosts; falta una."],
      ["Usar /27 en todas las sedes", "Incorrecta: una /27 tiene 30 hosts utilizables, insuficientes para 50."],
      ["No alcanza: se requiere un bloque mayor, por ejemplo una /23, para crear cinco /26", "Correcta: cinco subredes de al menos 50 hosts requieren 5 × 64 = 320 direcciones."],
      ["Usar /25 en todas las sedes", "Incorrecta: una /24 solo admite dos /25."]
    ],
    correcta: "C",
    explicacion: "Para 50 hosts se necesitan 6 bits de host (2^6 − 2 = 62), es decir /26 de 64 direcciones. Cinco /26 suman 320 direcciones y una /24 solo tiene 256. Una /23 (512 direcciones) permite ocho /26.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["subnetting"]
  }),
  q({
    id: "M2-002", modulo: "M2_REDES", temaId: "m2-ip", subtema: "Subnetting y VLSM", dificultad: 3, tipo: "resolucion_problemas",
    enunciado: "Un equipo tiene la dirección 172.16.10.77/27. ¿Cuál es la dirección de broadcast de su subred?",
    opciones: [
      ["172.16.10.63", "Incorrecta: es el broadcast de la subred 172.16.10.32/27."],
      ["172.16.10.95", "Correcta: la subred es 172.16.10.64/27 (bloques de 32) y su broadcast es .95."],
      ["172.16.10.79", "Incorrecta: correspondería a un bloque de 16 (/28)."],
      ["172.16.10.127", "Incorrecta: sería el broadcast de una /25 o de la /27 que inicia en .96."]
    ],
    correcta: "B",
    explicacion: "Una /27 agrupa de 32 en 32 en el último octeto: 0, 32, 64, 96… La dirección .77 cae en 64–95. Red .64, hosts .65 a .94 y broadcast .95.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["subnetting"]
  }),
  q({
    id: "M2-003", modulo: "M2_REDES", temaId: "m2-ip", subtema: "Direcciones privadas RFC 1918", dificultad: 2, tipo: "conceptual",
    enunciado: "¿Cuál de estas direcciones NO pertenece a los rangos privados definidos en el RFC 1918?",
    opciones: [
      ["10.255.1.1", "Incorrecta: pertenece a 10.0.0.0/8."],
      ["172.31.200.5", "Incorrecta: pertenece a 172.16.0.0/12, que va de 172.16.0.0 a 172.31.255.255."],
      ["192.168.100.1", "Incorrecta: pertenece a 192.168.0.0/16."],
      ["172.32.1.10", "Correcta: queda por fuera de 172.16.0.0/12, que termina en 172.31.255.255."]
    ],
    correcta: "D",
    explicacion: "Los rangos privados son 10.0.0.0/8, 172.16.0.0/12 y 192.168.0.0/16. El error frecuente es suponer que todo 172.x es privado.",
    fuenteId: "rfc-1918", referencia: "Sección 3", etiquetas: ["IPv4"]
  }),
  q({
    id: "M2-004", modulo: "M2_REDES", temaId: "m2-l3", subtema: "OSPF", dificultad: 3, tipo: "conceptual",
    enunciado: "En un diseño OSPF multiárea para la red de sedes regionales, ¿qué condición debe cumplir toda área distinta del backbone?",
    opciones: [
      ["Conectarse al área 0, directamente o mediante un enlace virtual", "Correcta: el área 0 es el backbone y el tráfico entre áreas pasa por ella."],
      ["Tener un único router", "Incorrecta: un área puede tener muchos routers."],
      ["Usar BGP para comunicarse con las demás áreas", "Incorrecta: el intercambio entre áreas lo hacen los ABR de OSPF."],
      ["Usar el mismo identificador de router en todos sus equipos", "Incorrecta: el router ID debe ser único."]
    ],
    correcta: "A",
    explicacion: "OSPF es un protocolo de estado de enlace que usa el algoritmo SPF (Dijkstra). La jerarquía de áreas reduce el tamaño de la base de estados de enlace y todas las áreas deben conectarse al backbone.",
    fuenteId: "rfc-2328", referencia: "Sección 3 (Splitting the AS into Areas)", etiquetas: ["routing"]
  }),
  q({
    id: "M2-005", modulo: "M2_REDES", temaId: "m2-l3", subtema: "BGP", dificultad: 4, tipo: "conceptual",
    enunciado: "En eBGP, ¿qué mecanismo evita principalmente los bucles de enrutamiento entre sistemas autónomos?",
    opciones: [
      ["El contador de saltos máximo de 15", "Incorrecta: es propio de RIP."],
      ["El rechazo de rutas cuyo atributo AS_PATH ya contiene el AS propio", "Correcta: BGP es un protocolo de vector de ruta y usa AS_PATH para detectar bucles."],
      ["El cálculo SPF sobre la topología completa", "Incorrecta: es propio de los protocolos de estado de enlace."],
      ["El temporizador de retención de 180 segundos", "Incorrecta: el hold timer mantiene la sesión; no previene bucles."]
    ],
    correcta: "B",
    explicacion: "Cada AS agrega su número al AS_PATH al anunciar una ruta. Si un router recibe una ruta que ya incluye su propio AS, la descarta. BGP opera sobre TCP en el puerto 179.",
    fuenteId: "rfc-4271", referencia: "Atributo AS_PATH", etiquetas: ["routing"]
  }),
  q({
    id: "M2-006", modulo: "M2_REDES", temaId: "m2-l2", subtema: "STP", dificultad: 2, tipo: "conceptual",
    enunciado: "Se conectan dos enlaces redundantes entre switches de acceso y distribución. ¿Qué función cumple el Spanning Tree Protocol en ese escenario?",
    opciones: [
      ["Balancear la carga entre ambos enlaces en capa 3", "Incorrecta: STP opera en capa 2 y no balancea en capa 3."],
      ["Bloquear lógicamente los enlaces redundantes para evitar bucles de capa 2 y habilitarlos si falla el activo", "Correcta: evita tormentas de broadcast y mantiene redundancia."],
      ["Cifrar las tramas entre switches", "Incorrecta: STP no cifra."],
      ["Asignar automáticamente las VLAN a los puertos", "Incorrecta: no es una función de STP."]
    ],
    correcta: "B",
    explicacion: "Sin STP, un bucle de capa 2 genera tormentas de broadcast e inestabilidad de las tablas MAC. Para usar ambos enlaces a la vez se recurre a agregación de enlaces o a STP por VLAN.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["switching"]
  }),
  q({
    id: "M2-007", modulo: "M2_REDES", temaId: "m2-serv", subtema: "DHCP", dificultad: 2, tipo: "conceptual",
    enunciado: "¿Cuál es el orden correcto de los mensajes en la asignación inicial de una dirección por DHCP?",
    opciones: [
      ["Request, Offer, Discover, Acknowledge", "Incorrecta: el cliente no puede solicitar sin haber descubierto servidores."],
      ["Discover, Offer, Request, Acknowledge", "Correcta: es la secuencia DORA."],
      ["Discover, Request, Offer, Acknowledge", "Incorrecta: la oferta del servidor precede a la solicitud del cliente."],
      ["Offer, Discover, Acknowledge, Request", "Incorrecta: el servidor responde a un descubrimiento previo."]
    ],
    correcta: "B",
    explicacion: "El cliente difunde un DHCPDISCOVER, los servidores responden con DHCPOFFER, el cliente elige con DHCPREQUEST y el servidor confirma con DHCPACK.",
    fuenteId: "rfc-2131", etiquetas: ["DHCP"]
  }),
  q({
    id: "M2-008", modulo: "M2_REDES", temaId: "m2-wan", subtema: "VPN IPsec", dificultad: 3, tipo: "decision_tecnica",
    enunciado: "Se configurará una VPN IPsec entre una sede regional y el centro de datos para transportar información reservada. ¿Qué protocolo de IPsec ofrece confidencialidad del contenido?",
    opciones: [
      ["AH (Authentication Header)", "Incorrecta: AH ofrece integridad y autenticación del origen, pero no cifra."],
      ["ESP (Encapsulating Security Payload)", "Correcta: ESP cifra la carga útil y puede ofrecer además integridad y autenticación."],
      ["GRE sin cifrado", "Incorrecta: GRE encapsula pero no protege la confidencialidad."],
      ["IKE en modo agresivo sin ESP", "Incorrecta: IKE negocia las asociaciones de seguridad; por sí solo no protege los datos."]
    ],
    correcta: "B",
    explicacion: "En IPsec, IKE negocia las claves y ESP protege los datos. Entre sedes se usa el modo túnel, que cifra el paquete original completo.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["VPN"]
  }),
  q({
    id: "M2-009", modulo: "M2_REDES", temaId: "m2-serv", subtema: "NAT y PAT", dificultad: 2, tipo: "conceptual",
    enunciado: "Doscientos equipos de una sede salen a Internet usando una sola dirección IP pública. Las sesiones se distinguen por número de puerto. ¿Qué técnica se usa?",
    opciones: [
      ["NAT estático uno a uno", "Incorrecta: requeriría una IP pública por equipo."],
      ["PAT (NAT con sobrecarga)", "Correcta: traduce muchas direcciones internas a una pública usando puertos."],
      ["NAT dinámico con un pool de 200 IP públicas", "Incorrecta: el enunciado indica una sola IP pública."],
      ["Enrutamiento entre VLAN", "Incorrecta: no traduce direcciones hacia Internet."]
    ],
    correcta: "B",
    explicacion: "PAT mantiene una tabla con dirección y puerto internos frente al puerto externo, lo que permite que muchos equipos compartan una IP pública.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["NAT"]
  }),
  q({
    id: "M2-010", modulo: "M2_REDES", temaId: "m2-diag", subtema: "Resolución de problemas por capas", dificultad: 2, tipo: "resolucion_problemas",
    enunciado: "En una sede, los usuarios hacen ping a 8.8.8.8 con éxito, pero ningún sitio web abre cuando se escribe su nombre. ¿Qué componente revisaría primero?",
    opciones: [
      ["El cableado del switch de acceso", "Incorrecta: el ping exitoso a Internet indica que la conectividad física funciona."],
      ["La resolución de nombres (DNS)", "Correcta: hay conectividad IP, pero fallan los nombres."],
      ["La tabla ARP del router", "Incorrecta: si ARP fallara no habría conectividad IP hacia Internet."],
      ["La licencia del navegador", "Incorrecta: no explica el síntoma."]
    ],
    correcta: "B",
    explicacion: "Diagnosticar por capas acota rápido la causa: si responde por IP pero no por nombre, el problema está en DNS (servidor configurado, reenviadores o bloqueo del puerto 53).",
    fuenteId: "academico", esInferencia: true, etiquetas: ["diagnóstico"]
  })
];

export const M3 = [
  q({
    id: "M3-001", modulo: "M3_SO", temaId: "m3-linux-adm", subtema: "Permisos", dificultad: 2, tipo: "conceptual",
    enunciado: "Se ejecuta chmod 750 respaldo.sh. ¿Qué permisos quedan?",
    opciones: [
      ["Dueño: lectura, escritura y ejecución; grupo: lectura y ejecución; otros: ninguno", "Correcta: 7 = rwx, 5 = r-x, 0 = ---."],
      ["Dueño: lectura y escritura; grupo: lectura; otros: ninguno", "Incorrecta: corresponde a 640."],
      ["Todos pueden leer y ejecutar; solo el dueño escribe", "Incorrecta: corresponde a 755."],
      ["Dueño: todo; grupo: escritura; otros: ninguno", "Incorrecta: 5 no incluye escritura."]
    ],
    correcta: "A",
    explicacion: "En notación octal cada dígito suma lectura (4), escritura (2) y ejecución (1) para dueño, grupo y otros. 750 equivale a rwxr-x---.",
    fuenteId: "linux-man", referencia: "chmod(1)", etiquetas: ["Linux"]
  }),
  q({
    id: "M3-002", modulo: "M3_SO", temaId: "m3-linux-adm", subtema: "Procesos y systemd", dificultad: 2, tipo: "conceptual",
    enunciado: "¿Qué hace el comando systemctl enable --now auditd?",
    opciones: [
      ["Solo inicia el servicio en este momento", "Incorrecta: eso lo hace systemctl start."],
      ["Habilita el servicio para que arranque con el sistema y lo inicia de inmediato", "Correcta: --now combina enable con start."],
      ["Reinicia el servicio y borra sus registros", "Incorrecta: no borra registros."],
      ["Impide que el servicio sea iniciado por otros servicios", "Incorrecta: eso se logra con mask."]
    ],
    correcta: "B",
    explicacion: "enable crea los enlaces para el arranque; --now además lo inicia. Para verificar se usa systemctl status y para ver los registros journalctl -u.",
    fuenteId: "linux-man", referencia: "systemctl(1)", etiquetas: ["Linux", "systemd"]
  }),
  q({
    id: "M3-003", modulo: "M3_SO", temaId: "m3-linux-seg", subtema: "SSH", dificultad: 3, tipo: "decision_tecnica",
    enunciado: "Para endurecer el acceso SSH a servidores Linux expuestos a la red de administración, ¿qué combinación de parámetros en sshd_config es la más adecuada?",
    opciones: [
      ["PermitRootLogin yes y PasswordAuthentication yes", "Incorrecta: expone la cuenta root y permite ataques de contraseña."],
      ["PermitRootLogin no y PasswordAuthentication no, con autenticación por llave pública", "Correcta: elimina el acceso directo de root y los ataques de fuerza bruta por contraseña."],
      ["Cambiar solo el puerto a 2222", "Incorrecta: reduce ruido, pero no es un control de autenticación."],
      ["PermitEmptyPasswords yes para cuentas de servicio", "Incorrecta: permite el acceso sin contraseña."]
    ],
    correcta: "B",
    explicacion: "El acceso administrativo se hace con usuarios nominales y sudo, para conservar trazabilidad. Se complementa con restricción de origen, MFA y bloqueo de intentos fallidos.",
    fuenteId: "linux-man", referencia: "sshd_config(5)", etiquetas: ["Linux", "hardening"]
  }),
  q({
    id: "M3-004", modulo: "M3_SO", temaId: "m3-win-gpo", subtema: "Procesamiento de GPO", dificultad: 3, tipo: "resolucion_problemas",
    enunciado: "Una GPO vinculada al dominio fija el bloqueo de pantalla en 15 minutos y otra GPO vinculada a la OU de una dependencia lo fija en 5. No hay GPO forzada (Enforced) ni bloqueo de herencia. ¿Qué valor reciben los equipos de esa OU?",
    opciones: [
      ["15 minutos, porque el dominio tiene prioridad", "Incorrecta: el dominio se procesa antes que la OU y su valor es sobrescrito."],
      ["5 minutos, porque la GPO de la OU se aplica después", "Correcta: el orden es local, sitio, dominio y OU; la última aplicada prevalece."],
      ["El sistema elige el valor más restrictivo", "Incorrecta: las GPO no se combinan por restricción, se aplican en orden."],
      ["Ninguno, porque hay un conflicto", "Incorrecta: los conflictos se resuelven por orden de procesamiento."]
    ],
    correcta: "B",
    explicacion: "Si la GPO del dominio estuviera marcada como Enforced, prevalecería sobre la OU. Para diagnosticar el resultado efectivo se usan gpresult y el conjunto resultante de directivas (RSoP).",
    fuenteId: "ms-gpo", etiquetas: ["Windows Server", "GPO"]
  }),
  q({
    id: "M3-005", modulo: "M3_SO", temaId: "m3-win-gpo", subtema: "Permisos NTFS y de recurso compartido", dificultad: 3, tipo: "resolucion_problemas",
    enunciado: "Un grupo tiene permiso de recurso compartido Lectura y permiso NTFS Modificar sobre una carpeta. Un miembro accede por la red. ¿Cuál es su permiso efectivo?",
    opciones: [
      ["Modificar", "Incorrecta: aplica solo al acceder localmente, donde no intervienen los permisos de recurso compartido."],
      ["Lectura", "Correcta: por la red se combinan ambos y prevalece el más restrictivo."],
      ["Control total", "Incorrecta: ninguno de los dos lo otorga."],
      ["Ninguno", "Incorrecta: ambos conceden al menos lectura."]
    ],
    correcta: "B",
    explicacion: "Por la red el acceso efectivo es la intersección de los permisos de recurso compartido y NTFS. Una práctica común es dar permisos amplios en el recurso compartido y controlar con NTFS.",
    fuenteId: "academico", esInferencia: true, etiquetas: ["Windows Server", "NTFS"]
  }),
  q({
    id: "M3-006", modulo: "M3_SO", temaId: "m3-win-ad", subtema: "Kerberos", dificultad: 4, tipo: "resolucion_problemas",
    enunciado: "En una sede, los usuarios no pueden autenticarse en el dominio; la red y el DNS funcionan. Se observa que el reloj del servidor local está nueve minutos adelantado respecto al controlador de dominio. ¿Cuál es la causa más probable?",
    opciones: [
      ["El puerto 389 de LDAP está bloqueado", "Incorrecta: el síntoma de diferencia de hora apunta a Kerberos, no a LDAP."],
      ["La diferencia de hora supera la tolerancia de Kerberos, por defecto 5 minutos en Active Directory", "Correcta: Kerberos usa marcas de tiempo para evitar ataques de repetición."],
      ["Las cuentas de usuario expiraron al mismo tiempo", "Incorrecta: no explica que solo falle una sede con hora desfasada."],
      ["El servidor DHCP agotó su ámbito", "Incorrecta: los equipos ya tienen red."]
    ],
    correcta: "B",
    explicacion: "Kerberos rechaza autenticadores con marcas de tiempo fuera de la tolerancia configurada. La solución es una jerarquía de NTP con el emulador PDC del bosque como referencia.",
    fuenteId: "rfc-4120", referencia: "Tolerancia de reloj (clock skew)", etiquetas: ["Active Directory", "Kerberos"]
  })
];

import type { MaterialTema } from "./tipos";

export const MATERIAL_M2_M5: MaterialTema[] = [
  // ---------- M2 Redes ----------
  {
    temaId: "m2-modelos",
    resumen: "Los modelos OSI y TCP/IP describen la comunicación por capas; diagnosticar por capas acota rápido la causa de una falla.",
    puntos: [
      { texto: "OSI: física, enlace, red, transporte, sesión, presentación y aplicación. PDU: bits, tramas, paquetes, segmentos (TCP) o datagramas (UDP) y datos.", fuenteId: "academico" },
      { texto: "TCP/IP: acceso a red, internet, transporte y aplicación. TCP es orientado a conexión (SYN, SYN-ACK, ACK); UDP no.", fuenteId: "academico" },
      { texto: "Puertos clave: 22 SSH, 25 SMTP, 53 DNS, 80 HTTP, 88 Kerberos, 123 NTP, 161/162 SNMP, 389 LDAP, 443 HTTPS, 514 syslog, 636 LDAPS, 3389 RDP.", fuenteId: "academico" }
    ]
  },
  {
    temaId: "m2-ip",
    resumen: "El direccionamiento IPv4 con VLSM y la transición a IPv6 son base de cualquier diseño de red institucional.",
    puntos: [
      { texto: "Hosts utilizables = 2^(bits de host) − 2. /24: 254, /25: 126, /26: 62, /27: 30, /28: 14, /29: 6, /30: 2.", fuenteId: "academico" },
      { texto: "Rangos privados: 10.0.0.0/8, 172.16.0.0/12 (hasta 172.31.255.255) y 192.168.0.0/16.", fuenteId: "rfc-1918" },
      { texto: "Con VLSM se asignan primero las subredes más grandes para evitar solapamientos.", fuenteId: "academico" },
      { texto: "IPv6: 128 bits, subredes /64. Global unicast 2000::/3, link-local fe80::/10, ULA fc00::/7, multicast ff00::/8. No existe broadcast.", fuenteId: "academico" }
    ],
    trampas: ["172.32.x.x no es privada.", "Restar 2 direcciones (red y broadcast) en IPv4."]
  },
  {
    temaId: "m2-l2",
    resumen: "La capa 2 segmenta con VLAN y evita bucles con STP; su configuración también es un control de seguridad.",
    puntos: [
      { texto: "Una VLAN es un dominio de broadcast. IEEE 802.1Q agrega una etiqueta de 4 bytes con un VLAN ID de 12 bits.", fuenteId: "academico" },
      { texto: "Puertos de acceso llevan una VLAN; troncales llevan varias etiquetadas. La VLAN nativa viaja sin etiqueta.", fuenteId: "academico" },
      { texto: "STP elige un puente raíz (menor ID de puente: prioridad + MAC) y bloquea enlaces redundantes. RSTP (802.1w) converge más rápido.", fuenteId: "academico" },
      { texto: "Controles: BPDU guard, port security, DHCP snooping y deshabilitar la negociación automática de troncales.", fuenteId: "academico" }
    ]
  },
  {
    temaId: "m2-l3",
    resumen: "El enrutamiento decide por dónde viajan los paquetes entre redes; la elección del protocolo depende del alcance: interno (IGP) o entre sistemas autónomos (EGP).",
    puntos: [
      { texto: "Regla de coincidencia más específica: gana la ruta con el prefijo más largo.", fuenteId: "academico" },
      { texto: "OSPF: estado de enlace, algoritmo SPF de Dijkstra, métrica de costo basada en ancho de banda y jerarquía de áreas con backbone en el área 0.", fuenteId: "rfc-2328" },
      { texto: "BGP: vector de ruta sobre TCP 179; eBGP entre sistemas autónomos, iBGP dentro de uno. Evita bucles con AS_PATH.", fuenteId: "rfc-4271" },
      { texto: "RIP: vector distancia, máximo 15 saltos. Rutas estáticas: simples y predecibles, pero no se adaptan a fallas.", fuenteId: "academico" }
    ]
  },
  {
    temaId: "m2-serv",
    resumen: "DNS, DHCP y NAT son servicios de infraestructura: cuando fallan, parece que falla todo.",
    puntos: [
      { texto: "Registros DNS: A (IPv4), AAAA (IPv6), CNAME (alias), MX (correo), TXT (SPF, DKIM, DMARC), PTR (inverso), NS y SOA. Usa UDP 53 y TCP 53 para transferencias y respuestas grandes. DNSSEC firma las respuestas.", fuenteId: "academico" },
      { texto: "DHCP: Discover, Offer, Request, Acknowledge (UDP 67/68). Entre subredes se usa un agente de retransmisión (relay).", fuenteId: "rfc-2131" },
      { texto: "NAT estático (uno a uno), dinámico (pool) y PAT o sobrecarga (muchos a una IP pública distinguiendo por puerto).", fuenteId: "academico" }
    ]
  },
  {
    temaId: "m2-wan",
    resumen: "La conectividad entre sedes combina VPN, servicios de operador y overlays definidos por software.",
    puntos: [
      { texto: "IPsec: IKE negocia (UDP 500; 4500 con NAT-T), ESP (protocolo 50) cifra y autentica, AH (protocolo 51) solo autentica. Entre sedes se usa modo túnel.", fuenteId: "academico" },
      { texto: "VPN SSL/TLS: habitual para acceso remoto de usuarios.", fuenteId: "academico" },
      { texto: "MPLS: el proveedor conmuta por etiquetas y ofrece QoS; no cifra por sí mismo.", fuenteId: "academico" },
      { texto: "SD-WAN: overlay sobre varios transportes (MPLS, Internet, LTE) con control centralizado y selección de ruta por aplicación.", fuenteId: "academico" }
    ]
  },
  {
    temaId: "m2-ha",
    resumen: "La alta disponibilidad elimina puntos únicos de falla en enlaces, equipos y servicios.",
    puntos: [
      { texto: "Redundancia de primer salto: HSRP (Cisco), VRRP (estándar) y GLBP.", fuenteId: "academico" },
      { texto: "Agregación de enlaces con LACP (IEEE 802.3ad) suma capacidad y redundancia.", fuenteId: "academico" },
      { texto: "Balanceadores de capa 4 o 7, con algoritmos como round robin o menos conexiones, y chequeos de salud. Esquemas activo-activo o activo-pasivo.", fuenteId: "academico" }
    ]
  },
  {
    temaId: "m2-diag",
    resumen: "El monitoreo anticipa fallas y el diagnóstico metódico reduce el tiempo de solución.",
    puntos: [
      { texto: "SNMPv3 ofrece autenticación y cifrado; v1 y v2c envían la comunidad en claro.", fuenteId: "academico" },
      { texto: "NetFlow, sFlow e IPFIX describen flujos; syslog centraliza eventos.", fuenteId: "academico" },
      { texto: "Herramientas: ping, traceroute, nslookup o dig, netstat o ss, tcpdump y Wireshark. Métodos: de abajo arriba, de arriba abajo y divide y vencerás.", fuenteId: "academico" }
    ]
  },
  // ---------- M3 Sistemas operativos ----------
  {
    temaId: "m3-linux-adm",
    resumen: "La administración de Linux se basa en usuarios, permisos, servicios gestionados por systemd y registros.",
    puntos: [
      { texto: "Cuentas en /etc/passwd, hashes en /etc/shadow y grupos en /etc/group.", fuenteId: "linux-man" },
      { texto: "Permisos rwx para dueño, grupo y otros (4, 2, 1). Bits especiales: SUID 4000, SGID 2000 y sticky 1000. umask define los permisos por defecto.", fuenteId: "linux-man" },
      { texto: "systemctl start, stop, enable, disable y status; journalctl -u <servicio> para sus registros. Señales: 15 (TERM) pide terminar, 9 (KILL) fuerza.", fuenteId: "linux-man" },
      { texto: "Paquetes: apt/dpkg en Debian y Ubuntu; dnf/yum/rpm en la familia Red Hat. Autenticación en /var/log/auth.log (Debian) o /var/log/secure (Red Hat).", fuenteId: "linux-man" }
    ]
  },
  {
    temaId: "m3-linux-seg",
    resumen: "Endurecer un servidor Linux reduce su superficie de ataque y mejora la trazabilidad.",
    puntos: [
      { texto: "SSH: autenticación por llave, PermitRootLogin no, PasswordAuthentication no y AllowUsers o AllowGroups.", fuenteId: "linux-man", referencia: "sshd_config(5)" },
      { texto: "sudo con usuarios nominales (editar con visudo) conserva la trazabilidad de acciones administrativas.", fuenteId: "linux-man" },
      { texto: "Firewall con nftables o iptables, o con ufw o firewalld. Control de acceso obligatorio con SELinux (Red Hat) o AppArmor (Ubuntu).", fuenteId: "academico" },
      { texto: "auditd registra eventos de seguridad; fail2ban bloquea intentos repetidos; los scripts deben fallar de forma segura (set -euo pipefail).", fuenteId: "academico" }
    ]
  },
  {
    temaId: "m3-win-ad",
    resumen: "Active Directory centraliza identidades y políticas en entornos Windows; DNS y la hora son críticos para su funcionamiento.",
    puntos: [
      { texto: "Estructura lógica: bosque, dominios, unidades organizativas y objetos. Los controladores de dominio replican en modo multimaestro.", fuenteId: "academico" },
      { texto: "Roles FSMO: maestro de esquema y de nombres de dominio (por bosque); maestro RID, emulador PDC e infraestructura (por dominio).", fuenteId: "academico" },
      { texto: "Kerberos (puerto 88): el KDC emite el TGT y luego tickets de servicio. La tolerancia de reloj por defecto es 5 minutos; el emulador PDC es la fuente de hora del dominio.", fuenteId: "rfc-4120" },
      { texto: "LDAP 389 y LDAPS 636; catálogo global 3268. Los clientes localizan los controladores mediante registros SRV de DNS.", fuenteId: "academico" }
    ]
  },
  {
    temaId: "m3-win-gpo",
    resumen: "Las directivas de grupo aplican configuración de forma masiva; entender su precedencia evita resultados inesperados.",
    puntos: [
      { texto: "Orden de aplicación: local, sitio, dominio y OU (de la más alta a la más específica). Prevalece la última aplicada, salvo directivas forzadas (Enforced) o bloqueo de herencia.", fuenteId: "ms-gpo" },
      { texto: "Diagnóstico: gpupdate /force y gpresult /r o el conjunto resultante de directivas (RSoP).", fuenteId: "ms-gpo" },
      { texto: "Por la red, el permiso efectivo es el más restrictivo entre el del recurso compartido y el NTFS. En NTFS, una denegación explícita prevalece sobre un permiso.", fuenteId: "academico" }
    ]
  },
  {
    temaId: "m3-win-seg",
    resumen: "La seguridad en Windows Server combina endurecimiento, protección de credenciales y auditoría.",
    puntos: [
      { texto: "Eventos de seguridad: 4624 inicio de sesión exitoso, 4625 fallido, 4672 privilegios especiales, 4720 cuenta creada, 4740 cuenta bloqueada.", fuenteId: "academico" },
      { texto: "LAPS gestiona contraseñas únicas de administrador local; el modelo por niveles separa cuentas de administración de dominio, servidores y estaciones.", fuenteId: "academico" },
      { texto: "Deshabilite protocolos heredados como SMBv1. La política de ejecución de PowerShell no es un control de seguridad: use registro de scripts y AppLocker o WDAC.", fuenteId: "academico" }
    ]
  },
  // ---------- M4 Cloud y arquitectura ----------
  {
    temaId: "m4-cloud",
    resumen: "NIST define la nube por cinco características esenciales, tres modelos de servicio y cuatro modelos de despliegue.",
    puntos: [
      { texto: "Características: autoservicio bajo demanda, amplio acceso por red, agrupación de recursos, elasticidad rápida y servicio medido.", fuenteId: "nist-800-145" },
      { texto: "Servicio: IaaS, PaaS y SaaS. Despliegue: privada, comunitaria, pública e híbrida.", fuenteId: "nist-800-145" }
    ]
  },
  {
    temaId: "m4-resp",
    resumen: "En la nube la seguridad es compartida: la frontera depende del modelo de servicio.",
    puntos: [
      { texto: "El proveedor siempre responde por la infraestructura física. En IaaS el cliente gestiona sistema operativo, aplicaciones, datos e identidades.", fuenteId: "aws-shared" },
      { texto: "En todos los modelos el cliente conserva la información y los datos, los dispositivos, y las cuentas e identidades.", fuenteId: "azure-shared" },
      { texto: "Los errores de configuración (almacenamiento público, permisos excesivos) son una causa frecuente de incidentes en la nube.", fuenteId: "academico" }
    ]
  },
  {
    temaId: "m4-alm",
    resumen: "El tipo de almacenamiento se elige por el patrón de acceso, el costo y los requisitos de retención.",
    puntos: [
      { texto: "Objeto (Amazon S3, Azure Blob): datos no estructurados por API. Bloque (discos de máquinas virtuales): bases de datos y sistemas. Archivo (Amazon EFS, Azure Files): recursos compartidos.", fuenteId: "academico" },
      { texto: "Niveles de acceso frecuente, infrecuente y de archivo, con políticas de ciclo de vida que mueven los datos automáticamente.", fuenteId: "academico" },
      { texto: "Controles: cifrado en reposo (claves del proveedor o del cliente), TLS en tránsito, versionado, inmutabilidad (WORM) y bloqueo de acceso público.", fuenteId: "academico" }
    ]
  },
  {
    temaId: "m4-virt",
    resumen: "Virtualización y contenedores consolidan cargas; su seguridad depende de aislar y reducir privilegios.",
    puntos: [
      { texto: "Hipervisor tipo 1 (sobre hardware: ESXi, Hyper-V, KVM) frente a tipo 2 (sobre un sistema operativo).", fuenteId: "academico" },
      { texto: "Los contenedores comparten el kernel del anfitrión; son más ligeros que las máquinas virtuales, con menor aislamiento.", fuenteId: "academico" },
      { texto: "Kubernetes: pods, nodos, deployments y services; plano de control con API server, etcd y scheduler. Controles: RBAC, imágenes escaneadas y políticas de red.", fuenteId: "academico" }
    ]
  },
  {
    temaId: "m4-arq",
    resumen: "La arquitectura de sistemas de información alinea las soluciones con la estrategia y asegura que se integren y evolucionen de forma gobernada.",
    puntos: [
      { texto: "Marcos de arquitectura empresarial como TOGAF y, para el Estado colombiano, el Marco de Referencia de Arquitectura Empresarial de MinTIC.", fuenteId: "academico" },
      { texto: "Estilos: monolito, arquitectura orientada a servicios y microservicios; cada uno equilibra simplicidad, escalabilidad y complejidad operativa.", fuenteId: "academico" },
      { texto: "Interoperabilidad mediante APIs (REST, autenticación con OAuth 2.0) y los lineamientos de interoperabilidad del Estado.", fuenteId: "academico" }
    ]
  },
  // ---------- M5 Continuidad ----------
  {
    temaId: "m5-bia",
    resumen: "El análisis de impacto al negocio (BIA) prioriza qué recuperar primero y con qué objetivos.",
    puntos: [
      { texto: "Identifica procesos críticos, sus dependencias tecnológicas y el impacto de la interrupción en el tiempo.", fuenteId: "nist-800-34" },
      { texto: "Define el tiempo máximo tolerable de interrupción (MTD o MTPD), del que se derivan el RTO (debe ser menor) y el RPO.", fuenteId: "nist-800-34" }
    ]
  },
  {
    temaId: "m5-metricas",
    resumen: "Las métricas de recuperación convierten la continuidad en objetivos medibles.",
    puntos: [
      { texto: "RTO: tiempo máximo para restablecer el servicio. RPO: pérdida máxima de datos expresada en tiempo.", fuenteId: "nist-800-34" },
      { texto: "MTTR: tiempo medio de reparación; MTTD: tiempo medio de detección; MTBF: tiempo medio entre fallas. Disponibilidad = MTBF / (MTBF + MTTR).", fuenteId: "academico" },
      { texto: "99,9 % de disponibilidad permite unas 8,76 horas de caída al año; 99,99 %, unos 52,6 minutos.", fuenteId: "academico" }
    ],
    trampas: ["RTO es una meta; MTTR es una medición."]
  },
  {
    temaId: "m5-plan",
    resumen: "El BCP mantiene los procesos del negocio; el DRP recupera la tecnología que los soporta.",
    puntos: [
      { texto: "Respaldo completo, incremental (cambios desde el último respaldo de cualquier tipo) y diferencial (cambios desde el último completo).", fuenteId: "academico" },
      { texto: "Regla 3-2-1: tres copias, dos medios distintos y una fuera del sitio; hoy se suma al menos una copia inmutable o desconectada.", fuenteId: "academico" },
      { texto: "Replicación síncrona (RPO cercano a cero, sensible a la distancia) frente a asíncrona. Sitios caliente, tibio y frío según el RTO.", fuenteId: "academico" }
    ]
  },
  {
    temaId: "m5-pruebas",
    resumen: "Un plan que no se prueba no es confiable. Las pruebas escalan de la revisión documental a la interrupción total.",
    puntos: [
      { texto: "Tipos: revisión documental, ejercicio de mesa (tabletop), ejercicio funcional o simulación, prueba en paralelo e interrupción total.", fuenteId: "nist-800-34" },
      { texto: "Cada prueba deja hallazgos y lecciones aprendidas que actualizan el plan. La función 5 del empleo incluye el plan de pruebas.", fuenteId: "conv-51-2026", referencia: "Función 5" }
    ]
  }
];

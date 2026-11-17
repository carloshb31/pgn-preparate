import type { Modulo, ModuloId, Tema } from "@/lib/domain/types";

// Temario organizado a partir de las secciones 3 (funciones), 4 (conocimientos esenciales
// específicos) y 5 (conocimientos esenciales comunes) del Formato de Convocatoria 51-2026 v3.

const t = (id: string, nombre: string, fundamento: Tema["fundamento"], subtemas: string[]): Tema => ({
  id,
  nombre,
  fundamento,
  subtemas
});

export const TEMARIO: Modulo[] = [
  {
    id: "M1_SEGURIDAD",
    numero: 1,
    nombre: "Seguridad informática y ciberseguridad",
    nucleo: "especifico",
    prioridadBase: 5,
    fundamentoConvocatoria: ["Sección 4: Seguridad informática y ciberseguridad", "Propósito del empleo", "Funciones 2, 3, 4, 6, 7, 10, 13 y 14"],
    descripcion: "Núcleo del cargo: modelo, políticas y servicios de seguridad informática y ciberseguridad.",
    temas: [
      t("m1-fund", "Fundamentos de seguridad de la información", "conocimiento_esencial", ["Confidencialidad, integridad y disponibilidad", "Autenticación, autorización y trazabilidad", "No repudio"]),
      t("m1-riesgo", "Gestión de riesgos de seguridad", "funcion", ["Amenazas, vulnerabilidades y explotación", "Matriz y plan de riesgos", "Tratamiento del riesgo"]),
      t("m1-iso", "ISO/IEC 27001:2022 e ISO/IEC 27002", "complementario", ["SGSI y ciclo de mejora", "Anexo A: 93 controles en 4 temas", "Declaración de aplicabilidad"]),
      t("m1-nist", "NIST Cybersecurity Framework 2.0", "complementario", ["Funciones Govern, Identify, Protect, Detect, Respond, Recover", "Perfiles y niveles"]),
      t("m1-mspi", "Modelo de Seguridad y Privacidad de la Información (MSPI)", "complementario", ["Fases del modelo", "Lineamientos MinTIC"]),
      t("m1-incid", "Gestión de incidentes de seguridad", "funcion", ["Registro de eventos e incidentes", "Informes e indicadores", "Lecciones aprendidas"]),
      t("m1-soc", "Operación de seguridad: SOC, SIEM, EDR, XDR, NDR", "complementario", ["Correlación de eventos", "Detección y respuesta en endpoints y red"]),
      t("m1-perim", "Seguridad perimetral", "conocimiento_esencial", ["Firewalls", "IDS e IPS", "WAF", "Segmentación de redes"]),
      t("m1-zt", "Zero Trust", "complementario", ["NIST SP 800-207", "Verificación continua", "Mínimo privilegio"]),
      t("m1-iam", "Gestión de identidades y accesos", "conocimiento_esencial", ["MFA", "Privilegios", "Ciclo de vida de cuentas"]),
      t("m1-vuln", "Gestión de vulnerabilidades y pruebas de seguridad", "funcion", ["Análisis de vulnerabilidades", "Plan de mitigación", "Pruebas de penetración", "Hardening"]),
      t("m1-app", "Seguridad de aplicaciones y correo", "complementario", ["OWASP", "SPF, DKIM y DMARC"]),
      t("m1-activos", "Inventario de activos de información", "funcion", ["Identificación", "Clasificación", "Propietarios"]),
      t("m1-datos", "Protección de datos personales", "complementario", ["Ley 1581 de 2012", "Principios del tratamiento"]),
      t("m1-forense", "Análisis forense digital", "complementario", ["Cadena de custodia", "Orden de volatilidad"]),
      t("m1-gob", "Gobierno de ciberseguridad y políticas", "funcion", ["Políticas, procedimientos, manuales y cartillas", "Sensibilización y plan de comunicaciones"])
    ]
  },
  {
    id: "M2_REDES",
    numero: 2,
    nombre: "Redes informáticas",
    nucleo: "especifico",
    prioridadBase: 5,
    fundamentoConvocatoria: ["Sección 4: Redes informáticas", "Función 7: infraestructura de la plataforma de seguridad"],
    descripcion: "Diseño, operación y diagnóstico de redes institucionales distribuidas.",
    temas: [
      t("m2-modelos", "Modelos OSI y TCP/IP", "conocimiento_esencial", ["Capas y PDU", "Encapsulamiento"]),
      t("m2-ip", "Direccionamiento IPv4 e IPv6", "conocimiento_esencial", ["Subnetting y VLSM", "Direcciones privadas RFC 1918", "IPv6: tipos de dirección"]),
      t("m2-l2", "Switching", "conocimiento_esencial", ["VLAN y 802.1Q", "STP"]),
      t("m2-l3", "Routing", "conocimiento_esencial", ["OSPF", "BGP", "Rutas estáticas"]),
      t("m2-serv", "Servicios de red", "conocimiento_esencial", ["DNS", "DHCP", "NAT y PAT"]),
      t("m2-wan", "WAN y conectividad", "conocimiento_esencial", ["VPN IPsec y SSL", "MPLS", "SD-WAN"]),
      t("m2-ha", "Alta disponibilidad y balanceo", "conocimiento_esencial", ["Redundancia de primer salto", "Balanceadores"]),
      t("m2-diag", "Monitoreo y diagnóstico", "conocimiento_esencial", ["SNMP", "Flujos", "Resolución de problemas por capas"])
    ]
  },
  {
    id: "M3_SO",
    numero: 3,
    nombre: "Sistemas operativos: Linux y Windows Server",
    nucleo: "especifico",
    prioridadBase: 4,
    fundamentoConvocatoria: ["Sección 4: Sistemas operativos", "Sección 4: Sistemas Operativos LINUX, WINDOWS SERVER"],
    descripcion: "Administración y aseguramiento de servidores Linux y Windows Server.",
    temas: [
      t("m3-linux-adm", "Linux: administración", "conocimiento_esencial", ["Usuarios y grupos", "Permisos", "Procesos y systemd", "Paquetes", "Logs"]),
      t("m3-linux-seg", "Linux: seguridad", "conocimiento_esencial", ["SSH", "Firewall", "Hardening", "Scripts"]),
      t("m3-win-ad", "Windows Server: Active Directory", "conocimiento_esencial", ["Controlador de dominio", "Kerberos", "LDAP", "DNS integrado"]),
      t("m3-win-gpo", "Windows Server: GPO y permisos", "conocimiento_esencial", ["Procesamiento de GPO", "Permisos NTFS y de recurso compartido"]),
      t("m3-win-seg", "Windows Server: seguridad y operación", "conocimiento_esencial", ["PowerShell", "Microsoft Defender", "Auditoría de eventos", "Hardening"])
    ]
  },
  {
    id: "M4_CLOUD_ARQ",
    numero: 4,
    nombre: "Cloud y arquitectura de sistemas de información",
    nucleo: "especifico",
    prioridadBase: 4,
    fundamentoConvocatoria: ["Sección 4: Esquemas de almacenamiento cloud (Azure, AWS, entre otros)", "Sección 4: Diseño y análisis de arquitectura de sistemas de información"],
    descripcion: "Servicios en la nube, responsabilidad compartida y arquitectura de soluciones.",
    temas: [
      t("m4-cloud", "Modelos de nube", "conocimiento_esencial", ["IaaS, PaaS, SaaS", "Pública, privada, híbrida", "Características NIST SP 800-145"]),
      t("m4-resp", "Responsabilidad compartida y seguridad cloud", "conocimiento_esencial", ["AWS", "Azure", "Identidades en la nube"]),
      t("m4-alm", "Almacenamiento cloud", "conocimiento_esencial", ["Objeto, bloque y archivo", "Clases de almacenamiento", "Cifrado"]),
      t("m4-virt", "Virtualización y contenedores", "complementario", ["Hipervisores", "Contenedores", "Kubernetes: fundamentos"]),
      t("m4-arq", "Arquitectura de soluciones", "conocimiento_esencial", ["Arquitectura empresarial", "Distribuidas", "APIs e interoperabilidad", "Gobierno de arquitectura"])
    ]
  },
  {
    id: "M5_CONTINUIDAD",
    numero: 5,
    nombre: "Continuidad y recuperación de desastres",
    nucleo: "especifico",
    prioridadBase: 4,
    fundamentoConvocatoria: ["Función 5: plan de recuperación de desastres, matriz y plan de riesgos, plan de pruebas", "Función 8: continuidad de los servicios"],
    descripcion: "BCP, DRP, BIA y métricas de recuperación para servicios críticos.",
    temas: [
      t("m5-bia", "BIA y análisis de impacto", "funcion", ["Procesos críticos", "MTPD"]),
      t("m5-metricas", "Métricas de recuperación", "funcion", ["RTO", "RPO", "MTTR", "MTTD"]),
      t("m5-plan", "BCP, DRP y planes de contingencia", "funcion", ["Estrategias de respaldo", "Replicación", "Sitios alternos"]),
      t("m5-pruebas", "Pruebas de recuperación", "funcion", ["Tipos de prueba", "Mejora continua"])
    ]
  },
  {
    id: "M6_PROYECTOS",
    numero: 6,
    nombre: "Proyectos tecnológicos, indicadores y contratación",
    nucleo: "especifico",
    prioridadBase: 3,
    fundamentoConvocatoria: ["Sección 4: Formulación y evaluación de proyectos tecnológicos", "Sección 4: Herramientas para gestión de indicadores y métricas", "Funciones 1, 9 y 12"],
    descripcion: "Formulación, evaluación, seguimiento y contratación de proyectos TI.",
    temas: [
      t("m6-form", "Formulación y evaluación de proyectos", "conocimiento_esencial", ["Evaluación técnica y financiera", "VPN y TIR", "Ciclo de vida"]),
      t("m6-pm", "Gestión de proyectos", "complementario", ["PMI y PMBOK", "Scrum y métodos ágiles", "Alcance, cronograma y presupuesto"]),
      t("m6-ind", "Indicadores y métricas", "conocimiento_esencial", ["KPI", "SLA", "Tableros de seguimiento"]),
      t("m6-contr", "Contratación tecnológica", "funcion", ["Identificación de necesidades", "Evaluación de proveedores"])
    ]
  },
  {
    id: "M7_INSTITUCIONAL",
    numero: 7,
    nombre: "Procuraduría y gestión pública",
    nucleo: "general",
    prioridadBase: 4,
    fundamentoConvocatoria: ["Sección 5: Estructura y funciones de la PGN", "Sección 5: Gestión pública y funcionamiento del Estado", "Sección 5: Sistemas de gestión", "Sección 5: Gestión documental", "Sección 5: Atención al usuario"],
    descripcion: "Conocimientos comunes: la entidad, el Estado y la gestión pública.",
    temas: [
      t("m7-const", "Constitución Política", "conocimiento_esencial", ["Art. 118 Ministerio Público", "Art. 125 carrera", "Art. 209 función administrativa", "Arts. 275-277 Procurador"]),
      t("m7-pgn", "Estructura y funciones de la PGN", "conocimiento_esencial", ["Decreto Ley 262 de 2000", "Carrera especial de la PGN"]),
      t("m7-mipg", "Sistemas de gestión y MIPG", "conocimiento_esencial", ["Decreto 1499 de 2017", "Control interno: Ley 87 de 1993"]),
      t("m7-doc", "Gestión documental", "conocimiento_esencial", ["Ciclo vital del documento", "Archivos"]),
      t("m7-ciud", "Atención al ciudadano y transparencia", "conocimiento_esencial", ["Ley 1712 de 2014", "Derecho de petición"]),
      t("m7-ofi", "Herramientas ofimáticas y documentos de oficina", "conocimiento_esencial", ["Hoja de cálculo", "Procesador de texto", "Comunicaciones oficiales"])
    ]
  },
  {
    id: "M8_NORMATIVA_TIC",
    numero: 8,
    nombre: "Normatividad tecnológica colombiana",
    nucleo: "especifico",
    prioridadBase: 3,
    fundamentoConvocatoria: ["Función 2: lineamientos legales vigentes", "Propósito: normas vigentes"],
    descripcion: "Marco legal de seguridad digital, datos y gobierno digital. Verificar vigencia antes de estudiar.",
    temas: [
      t("m8-delitos", "Delitos informáticos", "complementario", ["Ley 1273 de 2009"]),
      t("m8-datos", "Habeas data", "complementario", ["Ley 1581 de 2012"]),
      t("m8-transp", "Transparencia y acceso a la información", "complementario", ["Ley 1712 de 2014"]),
      t("m8-gd", "Gobierno y seguridad digital", "complementario", ["Decreto 1078 de 2015", "Resolución 500 de 2021 MinTIC", "Política de Gobierno Digital"]),
      t("m8-cpaca", "Procedimiento administrativo", "complementario", ["Ley 1437 de 2011"])
    ]
  },
  {
    id: "M9_COMPORTAMENTALES",
    numero: 9,
    nombre: "Competencias comportamentales",
    nucleo: "general",
    prioridadBase: 3,
    fundamentoConvocatoria: ["Sección 6: Competencias comportamentales"],
    descripcion: "Siete competencias oficiales: 2 transversales y 5 por perfil del cargo.",
    temas: [
      t("m9-trans", "Competencias transversales", "conocimiento_esencial", ["Responsabilidad con la organización (B)", "Organización del trabajo (B)"]),
      t("m9-perfil", "Competencias por perfil del cargo", "conocimiento_esencial", ["Investigación (B)", "Pensamiento conceptual (A)", "Orientación a resultados (A)", "Cumplimiento de parámetros de trabajo (B)", "Creatividad e innovación (C)"])
    ]
  }
];

export const MODULO_POR_ID: Record<ModuloId, Modulo> = Object.fromEntries(TEMARIO.map((m) => [m.id, m])) as Record<ModuloId, Modulo>;

export const MODULO_IDS = TEMARIO.map((m) => m.id);

export const nombreModulo = (id: ModuloId) => MODULO_POR_ID[id]?.nombre ?? id;
export const nombreCorto = (id: ModuloId) => `M${MODULO_POR_ID[id]?.numero ?? "?"}`;

export function temaPorId(id: string) {
  for (const m of TEMARIO) {
    const tema = m.temas.find((x) => x.id === id);
    if (tema) return { modulo: m, tema };
  }
  return null;
}

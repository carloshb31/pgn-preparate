import type { Fuente } from "@/lib/domain/types";

// Repositorio de fuentes. `fechaVerificacion` queda en null hasta que una persona
// abra la fuente, confirme su vigencia y registre la fecha desde el panel de administración.

const SENADO = "http://www.secretariasenado.gov.co/senado/basedoc/";
const PORTAL_NORMAS = "https://meritoconstruyendoexcelencia.com.co/#/convocatorias/normatividad";

export const FUENTES: Fuente[] = [
  // Nivel 1: documentos oficiales del concurso y normativa
  { id: "conv-51-2026", titulo: "Formato de Convocatoria 51-2026, versión 3", emisor: "Procuraduría General de la Nación", nivel: 1, categoria: "convocatoria", url: "https://meritoconstruyendoexcelencia.com.co/statics/convocatorias/51-2026", fechaVerificacion: "2026-11-10", notas: "Documento rector. Leído en el portal oficial el 10/11/2026." },
  { id: "res-076-2026", titulo: "Resolución 076 de 2026 (reglas del proceso de selección)", emisor: "Procuraduría General de la Nación", nivel: 1, categoria: "resoluciones", url: "https://meritoconstruyendoexcelencia.com.co/statics/normativas_especificas/RESOLUCI%C3%93N-No-076-24-MARZO-2026", fechaVerificacion: "2026-11-10", notas: "Leídos en el portal los arts. 18 a 21, 27 y 28: pruebas, núcleos, calificación estándar y factores de antecedentes." },
  { id: "res-108-2026", titulo: "Resolución 108 de 2026", emisor: "Procuraduría General de la Nación", nivel: 1, categoria: "resoluciones", url: PORTAL_NORMAS, fechaVerificacion: null },
  { id: "res-133-2026", titulo: "Resolución 133 de 2026", emisor: "Procuraduría General de la Nación", nivel: 1, categoria: "resoluciones", url: PORTAL_NORMAS, fechaVerificacion: null },
  { id: "res-212-2026", titulo: "Resolución 212 de 2026", emisor: "Procuraduría General de la Nación", nivel: 1, categoria: "resoluciones", url: PORTAL_NORMAS, fechaVerificacion: null },
  { id: "res-243-2026", titulo: "Resolución 243 de 2026", emisor: "Procuraduría General de la Nación", nivel: 1, categoria: "resoluciones", url: "https://meritoconstruyendoexcelencia.com.co/statics/normativas_especificas/RESOLUCI%C3%93N-No-243-02-SEP-2026", fechaVerificacion: "2026-11-10", notas: "Modifica el artículo 2 de la Resolución 076 (empleos convocados) por orden del Tribunal Administrativo de Cundinamarca." },
  { id: "cronograma-vrm", titulo: "Cronograma de resultados de VRM y reclamaciones", emisor: "PGN y Universidad de Antioquia", nivel: 1, categoria: "convocatoria", url: "https://meritoconstruyendoexcelencia.com.co/#/convocatorias/avisos-informativos", fechaVerificacion: "2026-11-10" },
  { id: "cp-1991", titulo: "Constitución Política de Colombia de 1991", emisor: "Asamblea Nacional Constituyente", nivel: 1, categoria: "legislacion", url: SENADO + "constitucion_politica_1991.html", fechaVerificacion: null },
  { id: "dl-262-2000", titulo: "Decreto Ley 262 de 2000", emisor: "Presidencia de la República", nivel: 1, categoria: "legislacion", url: PORTAL_NORMAS, fechaVerificacion: null, notas: "Estructura de la PGN y régimen de carrera." },
  { id: "dl-263-2000", titulo: "Decreto Ley 263 de 2000", emisor: "Presidencia de la República", nivel: 1, categoria: "legislacion", url: PORTAL_NORMAS, fechaVerificacion: null, notas: "Requisitos de los empleos de la PGN." },
  { id: "ley-87-1993", titulo: "Ley 87 de 1993 (control interno)", emisor: "Congreso de la República", nivel: 1, categoria: "legislacion", url: SENADO + "ley_0087_1993.html", fechaVerificacion: null },
  { id: "ley-80-1993", titulo: "Ley 80 de 1993 (Estatuto General de Contratación)", emisor: "Congreso de la República", nivel: 1, categoria: "legislacion", url: SENADO + "ley_0080_1993.html", fechaVerificacion: null },
  { id: "ley-1150-2007", titulo: "Ley 1150 de 2007 (eficiencia y transparencia en la contratación)", emisor: "Congreso de la República", nivel: 1, categoria: "legislacion", url: SENADO + "ley_1150_2007.html", fechaVerificacion: null },
  { id: "ley-1755-2015", titulo: "Ley 1755 de 2015 (derecho fundamental de petición)", emisor: "Congreso de la República", nivel: 1, categoria: "legislacion", url: SENADO + "ley_1755_2015.html", fechaVerificacion: null },
  { id: "dec-767-2022", titulo: "Decreto 767 de 2022 (Política de Gobierno Digital)", emisor: "MinTIC", nivel: 1, categoria: "legislacion", fechaVerificacion: null },
  { id: "conpes-3995", titulo: "CONPES 3995 de 2020 (Política Nacional de Confianza y Seguridad Digital)", emisor: "Departamento Nacional de Planeación", nivel: 1, categoria: "ciberseguridad", fechaVerificacion: null },
  { id: "ley-594-2000", titulo: "Ley 594 de 2000 (Ley General de Archivos)", emisor: "Congreso de la República", nivel: 1, categoria: "gestion_publica", url: SENADO + "ley_0594_2000.html", fechaVerificacion: null },
  { id: "ley-1273-2009", titulo: "Ley 1273 de 2009 (delitos informáticos)", emisor: "Congreso de la República", nivel: 1, categoria: "legislacion", url: SENADO + "ley_1273_2009.html", fechaVerificacion: null },
  { id: "ley-1437-2011", titulo: "Ley 1437 de 2011 (CPACA)", emisor: "Congreso de la República", nivel: 1, categoria: "legislacion", url: SENADO + "ley_1437_2011.html", fechaVerificacion: null },
  { id: "ley-1581-2012", titulo: "Ley 1581 de 2012 (protección de datos personales)", emisor: "Congreso de la República", nivel: 1, categoria: "legislacion", url: SENADO + "ley_1581_2012.html", fechaVerificacion: null },
  { id: "ley-1712-2014", titulo: "Ley 1712 de 2014 (transparencia y acceso a la información)", emisor: "Congreso de la República", nivel: 1, categoria: "legislacion", url: SENADO + "ley_1712_2014.html", fechaVerificacion: null },
  { id: "dec-1078-2015", titulo: "Decreto 1078 de 2015 (Decreto Único Reglamentario del sector TIC)", emisor: "MinTIC", nivel: 1, categoria: "legislacion", fechaVerificacion: null },
  { id: "dec-1499-2017", titulo: "Decreto 1499 de 2017 (MIPG)", emisor: "Departamento Administrativo de la Función Pública", nivel: 1, categoria: "gestion_publica", url: "https://www.funcionpublica.gov.co/web/mipg", fechaVerificacion: null },
  { id: "res-500-2021", titulo: "Resolución 500 de 2021 (seguridad digital y MSPI)", emisor: "MinTIC", nivel: 1, categoria: "ciberseguridad", fechaVerificacion: null },
  { id: "mspi", titulo: "Modelo de Seguridad y Privacidad de la Información (MSPI)", emisor: "MinTIC", nivel: 1, categoria: "seguridad", url: "https://gobiernodigital.mintic.gov.co/seguridadyprivacidad/portal/", fechaVerificacion: null },

  // Nivel 2: estándares y organismos reconocidos
  { id: "iso-27001-2022", titulo: "ISO/IEC 27001:2022", emisor: "ISO/IEC", nivel: 2, categoria: "seguridad", url: "https://www.iso.org/standard/27001", fechaVerificacion: null },
  { id: "iso-27002-2022", titulo: "ISO/IEC 27002:2022", emisor: "ISO/IEC", nivel: 2, categoria: "seguridad", url: "https://www.iso.org/standard/75652.html", fechaVerificacion: null },
  { id: "nist-csf-2", titulo: "NIST Cybersecurity Framework 2.0", emisor: "NIST", nivel: 2, categoria: "ciberseguridad", url: "https://www.nist.gov/cyberframework", fechaVerificacion: null },
  { id: "nist-800-207", titulo: "NIST SP 800-207 Zero Trust Architecture", emisor: "NIST", nivel: 2, categoria: "ciberseguridad", url: "https://csrc.nist.gov/pubs/sp/800/207/final", fechaVerificacion: null },
  { id: "nist-800-145", titulo: "NIST SP 800-145 The NIST Definition of Cloud Computing", emisor: "NIST", nivel: 2, categoria: "cloud", url: "https://csrc.nist.gov/pubs/sp/800/145/final", fechaVerificacion: null },
  { id: "nist-800-34", titulo: "NIST SP 800-34 Rev. 1 Contingency Planning Guide", emisor: "NIST", nivel: 2, categoria: "continuidad", url: "https://csrc.nist.gov/pubs/sp/800/34/r1/upd1/final", fechaVerificacion: null },
  { id: "nist-800-86", titulo: "NIST SP 800-86 Guide to Integrating Forensic Techniques into Incident Response", emisor: "NIST", nivel: 2, categoria: "ciberseguridad", url: "https://csrc.nist.gov/pubs/sp/800/86/final", fechaVerificacion: null },
  { id: "rfc-1918", titulo: "RFC 1918 Address Allocation for Private Internets", emisor: "IETF", nivel: 2, categoria: "redes", url: "https://www.rfc-editor.org/rfc/rfc1918", fechaVerificacion: null },
  { id: "rfc-2131", titulo: "RFC 2131 Dynamic Host Configuration Protocol", emisor: "IETF", nivel: 2, categoria: "redes", url: "https://www.rfc-editor.org/rfc/rfc2131", fechaVerificacion: null },
  { id: "rfc-2328", titulo: "RFC 2328 OSPF Version 2", emisor: "IETF", nivel: 2, categoria: "redes", url: "https://www.rfc-editor.org/rfc/rfc2328", fechaVerificacion: null },
  { id: "rfc-4271", titulo: "RFC 4271 A Border Gateway Protocol 4 (BGP-4)", emisor: "IETF", nivel: 2, categoria: "redes", url: "https://www.rfc-editor.org/rfc/rfc4271", fechaVerificacion: null },
  { id: "rfc-4120", titulo: "RFC 4120 The Kerberos Network Authentication Service (V5)", emisor: "IETF", nivel: 2, categoria: "sistemas_operativos", url: "https://www.rfc-editor.org/rfc/rfc4120", fechaVerificacion: null },
  { id: "rfc-7489", titulo: "RFC 7489 DMARC", emisor: "IETF", nivel: 2, categoria: "seguridad", url: "https://www.rfc-editor.org/rfc/rfc7489", fechaVerificacion: null },
  { id: "owasp-top10", titulo: "OWASP Top 10", emisor: "OWASP Foundation", nivel: 2, categoria: "seguridad", url: "https://owasp.org/www-project-top-ten/", fechaVerificacion: null },

  // Nivel 3: documentación técnica de fabricantes
  { id: "aws-shared", titulo: "AWS Shared Responsibility Model", emisor: "Amazon Web Services", nivel: 3, categoria: "cloud", url: "https://aws.amazon.com/compliance/shared-responsibility-model/", fechaVerificacion: null },
  { id: "azure-shared", titulo: "Shared responsibility in the cloud", emisor: "Microsoft Learn", nivel: 3, categoria: "cloud", url: "https://learn.microsoft.com/azure/security/fundamentals/shared-responsibility", fechaVerificacion: null },
  { id: "ms-gpo", titulo: "Documentación de Directiva de grupo (Group Policy)", emisor: "Microsoft Learn", nivel: 3, categoria: "sistemas_operativos", url: "https://learn.microsoft.com/windows-server/identity/ad-ds/manage/group-policy/group-policy-processing", fechaVerificacion: null },
  { id: "linux-man", titulo: "Páginas de manual de Linux (chmod, systemctl, sshd_config)", emisor: "man7.org", nivel: 3, categoria: "sistemas_operativos", url: "https://man7.org/linux/man-pages/", fechaVerificacion: null },
  { id: "pmbok", titulo: "PMBOK Guide", emisor: "Project Management Institute", nivel: 3, categoria: "arquitectura", url: "https://www.pmi.org/standards/pmbok", fechaVerificacion: null },
  { id: "scrum-guide", titulo: "The Scrum Guide (2020)", emisor: "Schwaber y Sutherland", nivel: 3, categoria: "arquitectura", url: "https://scrumguides.org/scrum-guide.html", fechaVerificacion: null },
  { id: "academico", titulo: "Inferencia técnica de uso general (sin norma específica)", emisor: "Equipo académico PGN PREPÁRATE", nivel: 3, categoria: "seguridad", fechaVerificacion: null, notas: "Se usa cuando la respuesta es una práctica aceptada y no una disposición literal." }
];

export const FUENTE_POR_ID: Record<string, Fuente> = Object.fromEntries(FUENTES.map((f) => [f.id, f]));

export const ETIQUETA_NIVEL: Record<number, string> = {
  1: "Nivel 1 · Normativa y documentos oficiales",
  2: "Nivel 2 · Estándares y organismos reconocidos",
  3: "Nivel 3 · Libros y documentación técnica",
  4: "Nivel 4 · Comunidad (nunca prevalece sobre lo oficial)"
};

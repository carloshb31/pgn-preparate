/**
 * Genera supabase/seed.sql a partir del contenido versionado en src/lib/content.
 * Uso: npm run seed:sql
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { CONVOCATORIA, COMPETENCIAS_OFICIALES } from "../src/lib/config/convocatoria";
import { TEMARIO } from "../src/lib/content/temario";
import { FUENTES } from "../src/lib/content/fuentes";
import { BANCO_SEMILLA } from "../src/lib/content/preguntas";

const s = (v: unknown): string => {
  if (v === null || v === undefined) return "null";
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "true" : "false";
  return `'${String(v).replace(/'/g, "''")}'`;
};
const arr = (xs: string[]) => (xs.length ? `array[${xs.map(s).join(",")}]::text[]` : "'{}'::text[]");

const out: string[] = ["-- Generado por scripts/generate-seed-sql.ts. No editar a mano.", "begin;"];

out.push(
  `insert into public.convocatorias (id, entidad, denominacion, codigo_grado, dependencia, vacantes, version, resolucion_version, datos) values (${s(CONVOCATORIA.codigo)}, ${s(CONVOCATORIA.entidad)}, ${s(CONVOCATORIA.denominacion)}, ${s(CONVOCATORIA.codigoGrado)}, ${s(CONVOCATORIA.dependencia)}, ${CONVOCATORIA.vacantes}, ${CONVOCATORIA.version}, ${s(CONVOCATORIA.resolucionVersion)}, ${s(JSON.stringify({ proposito: CONVOCATORIA.proposito, ubicacion: CONVOCATORIA.ubicacion, asignacion: CONVOCATORIA.asignacionBasica }))}::jsonb) on conflict (id) do nothing;`
);
out.push(
  `insert into public.temarios (id, convocatoria_id, version, fuente) values ('00000000-0000-0000-0000-000000005126', ${s(CONVOCATORIA.codigo)}, 1, 'Formato de Convocatoria 51-2026 v3, secciones 3, 4 y 5') on conflict do nothing;`
);

for (const m of TEMARIO) {
  out.push(
    `insert into public.modulos (id, temario_id, numero, nombre, nucleo, prioridad_base, fundamento_convocatoria, descripcion) values (${s(m.id)}, '00000000-0000-0000-0000-000000005126', ${m.numero}, ${s(m.nombre)}, ${s(m.nucleo)}, ${m.prioridadBase}, ${arr(m.fundamentoConvocatoria)}, ${s(m.descripcion)}) on conflict (id) do nothing;`
  );
  m.temas.forEach((t, i) =>
    out.push(
      `insert into public.temas (id, modulo_id, nombre, fundamento, subtemas, orden) values (${s(t.id)}, ${s(m.id)}, ${s(t.nombre)}, ${s(t.fundamento)}, ${arr(t.subtemas)}, ${i}) on conflict (id) do nothing;`
    )
  );
}

for (const f of FUENTES) {
  out.push(
    `insert into public.fuentes (id, titulo, emisor, nivel, categoria, url, fecha_verificacion, notas) values (${s(f.id)}, ${s(f.titulo)}, ${s(f.emisor)}, ${f.nivel}, ${s(f.categoria)}, ${s(f.url)}, ${f.fechaVerificacion ? s(f.fechaVerificacion) + "::date" : "null"}, ${s(f.notas)}) on conflict (id) do nothing;`
  );
}

for (const c of COMPETENCIAS_OFICIALES) {
  out.push(`insert into public.competencias (id, nombre, nivel, grupo, convocatoria_id) values (${s(c.id)}, ${s(c.nombre)}, ${s(c.nivel)}, ${s(c.grupo)}, ${s(CONVOCATORIA.codigo)}) on conflict (id) do nothing;`);
}

for (const p of BANCO_SEMILLA) {
  out.push(
    `insert into public.preguntas (id, modulo_id, tema_id, subtema, nucleo, dificultad, tipo, enunciado, explicacion, fuente_id, referencia, es_inferencia, etiquetas, estado, autor) values (${s(p.id)}, ${s(p.modulo)}, ${s(p.temaId)}, ${s(p.subtema)}, ${s(p.nucleo)}, ${p.dificultad}, ${s(p.tipo)}, ${s(p.enunciado)}, ${s(p.explicacion)}, ${s(p.fuenteId)}, ${s(p.referencia)}, ${s(p.esInferencia)}, ${arr(p.etiquetas)}, ${s(p.estado)}, ${s(p.autor)}) on conflict (id) do nothing;`
  );
  for (const o of p.opciones) {
    out.push(
      `insert into public.opciones (pregunta_id, letra, texto, justificacion, es_correcta) values (${s(p.id)}, ${s(o.id)}, ${s(o.texto)}, ${s(o.justificacion)}, ${o.id === p.correcta}) on conflict do nothing;`
    );
  }
}

out.push("commit;");
const destino = path.join(__dirname, "..", "supabase", "seed.sql");
writeFileSync(destino, out.join("\n") + "\n");
console.log(`seed.sql: ${TEMARIO.length} módulos, ${FUENTES.length} fuentes, ${BANCO_SEMILLA.length} preguntas → ${destino}`);

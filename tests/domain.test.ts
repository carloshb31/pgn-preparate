import { describe, expect, it } from "vitest";
import { calcularPonderado, validarPonderaciones } from "@/lib/domain/scoring";
import { PONDERACIONES_OFICIALES } from "@/lib/config/convocatoria";
import { crearIntento, finalizar, responder, informe } from "@/lib/domain/exam";
import { actualizarRepaso } from "@/lib/domain/srs";
import { generarPlan, prioridadesPorDefecto, replanificar } from "@/lib/domain/planner";
import { BANCO_SEMILLA } from "@/lib/content/preguntas";
import { TEMARIO } from "@/lib/content/temario";
import { FUENTE_POR_ID } from "@/lib/content/fuentes";
import type { ConfigSimulacro, ModuloId } from "@/lib/domain/types";

const P = PONDERACIONES_OFICIALES;

describe("ponderación oficial", () => {
  it("las ponderaciones oficiales suman 100 %", () => {
    expect(validarPonderaciones(P)).toEqual([]);
  });
  it("aplica la fórmula 70/20/10", () => {
    const r = calcularPonderado({ conocimientos: 90, comportamentales: 80, antecedentes: 60 }, P);
    expect(r.final).toBe(85);
    expect(r.integraListaElegibles).toBe(true);
  });
  it("conocimientos por debajo de 65 elimina aunque el total supere 70", () => {
    const r = calcularPonderado({ conocimientos: 64, comportamentales: 100, antecedentes: 100 }, P);
    expect(r.superaMinimoConocimientos).toBe(false);
    expect(r.integraListaElegibles).toBe(false);
  });
  it("no asume antecedentes: el final queda pendiente y calcula lo necesario", () => {
    const r = calcularPonderado({ conocimientos: 80, comportamentales: 70, antecedentes: null }, P);
    expect(r.final).toBeNull();
    expect(r.parcial).toBe(70);
    expect(r.necesarioEnPendiente).toEqual({ componente: "antecedentes", valor: 0 });
  });
  it("rechaza puntajes fuera de rango", () => {
    expect(() => calcularPonderado({ conocimientos: 101, comportamentales: 0, antecedentes: 0 }, P)).toThrow();
  });
});

describe("banco semilla", () => {
  const temas = new Set(TEMARIO.flatMap((m) => m.temas.map((t) => t.id)));
  it("cada pregunta tiene una sola respuesta correcta presente entre sus opciones", () => {
    for (const p of BANCO_SEMILLA) {
      const ids = p.opciones.map((o) => o.id);
      expect(new Set(ids).size, p.id).toBe(ids.length);
      expect(ids, p.id).toContain(p.correcta);
      expect(p.opciones.length, p.id).toBeGreaterThanOrEqual(4);
    }
  });
  it("ids únicos, tema y fuente existentes, justificación de cada opción", () => {
    const ids = BANCO_SEMILLA.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of BANCO_SEMILLA) {
      expect(temas.has(p.temaId), `${p.id} tema ${p.temaId}`).toBe(true);
      expect(FUENTE_POR_ID[p.fuenteId], `${p.id} fuente ${p.fuenteId}`).toBeDefined();
      for (const o of p.opciones) expect(o.justificacion.length, `${p.id}/${o.id}`).toBeGreaterThan(10);
    }
  });
  it("ninguna pregunta semilla se presenta como validada sin revisión humana", () => {
    expect(BANCO_SEMILLA.every((p) => p.estado === "pendiente_revision")).toBe(true);
  });
});

describe("motor de simulacros", () => {
  const cfg: ConfigSimulacro = {
    modalidad: "integral",
    cantidad: 10,
    duracionMin: 20,
    dificultades: [],
    modulos: [],
    aleatorizarPreguntas: true,
    aleatorizarOpciones: true,
    incluirNoValidadas: true
  };
  it("crea, responde y califica; bloquea cambios al finalizar", () => {
    let it1 = crearIntento(BANCO_SEMILLA, cfg, 42);
    expect(it1.respuestas.length).toBe(10);
    const porId = new Map(BANCO_SEMILLA.map((p) => [p.id, p]));
    it1.respuestas.slice(0, 7).forEach((r) => {
      it1 = responder(it1, r.preguntaId, porId.get(r.preguntaId)!.correcta);
    });
    const fin = finalizar(it1, BANCO_SEMILLA);
    expect(fin.puntaje).toBe(70);
    expect(() => responder(fin, fin.respuestas[0].preguntaId, "A")).toThrow();
    const inf = informe(fin, BANCO_SEMILLA);
    expect(inf.correctas).toBe(7);
    expect(inf.sinResponder).toBe(3);
  });
  it("misma semilla, mismo simulacro", () => {
    const a = crearIntento(BANCO_SEMILLA, cfg, 7);
    const b = crearIntento(BANCO_SEMILLA, cfg, 7);
    expect(a.orden).toEqual(b.orden);
  });
  it("excluye preguntas no validadas si así se configura", () => {
    expect(() => crearIntento(BANCO_SEMILLA, { ...cfg, incluirNoValidadas: false })).toThrow();
  });
});

describe("repetición espaciada", () => {
  it("un fallo reinicia a 1 día; aciertos amplían el intervalo", () => {
    let e = actualizarRepaso(undefined, "q", 1, "2026-11-10");
    expect(e.intervaloDias).toBe(1);
    e = actualizarRepaso(e, "q", 4, "2026-11-11");
    e = actualizarRepaso(e, "q", 4, "2026-11-12");
    expect(e.intervaloDias).toBe(6);
    expect(e.proxima).toBe("2026-11-18");
  });
});

describe("plan de estudio", () => {
  const dominio = Object.fromEntries(TEMARIO.map((m) => [m.id, null])) as Record<ModuloId, number | null>;
  const cfg = {
    fechaExamen: null,
    fechaInicio: "2026-11-16",
    horasPorDia: 2,
    diasPorSemana: 5,
    minutosPorSesion: 45,
    nivelInicial: "intermedio" as const,
    prioridades: prioridadesPorDefecto()
  };
  it("sin fecha de examen usa el horizonte de práctica y no inventa fechas oficiales", () => {
    const acts = generarPlan(cfg, dominio);
    expect(acts.length).toBeGreaterThan(0);
    expect(acts.every((a) => a.fecha >= "2026-11-16" && a.fecha <= "2027-01-10")).toBe(true);
  });
  it("respeta los días por semana (sin sábados ni domingos con 5 días)", () => {
    const acts = generarPlan(cfg, dominio);
    const fines = acts.filter((a) => [0, 6].includes(new Date(a.fecha + "T12:00:00").getDay()));
    expect(fines.length).toBe(0);
  });
  it("prioriza los módulos con menor dominio", () => {
    const d = { ...dominio, M2_REDES: 95, M1_SEGURIDAD: 20 } as Record<ModuloId, number | null>;
    const acts = generarPlan(cfg, d);
    const n = (m: ModuloId) => acts.filter((a) => a.modulo === m).length;
    expect(n("M1_SEGURIDAD")).toBeGreaterThan(n("M2_REDES"));
  });
  it("replanifica actividades vencidas sin perder las completadas", () => {
    const acts = generarPlan(cfg, dominio);
    acts[1].completada = true;
    const nuevo = replanificar(acts, cfg, dominio, "2026-11-23");
    expect(nuevo.some((a) => a.id === acts[1].id)).toBe(true);
    expect(nuevo.some((a) => a.reprogramadaDesde)).toBe(true);
  });
});

import { importarPreguntas, parsearCSV, COLUMNAS_CSV } from "@/lib/domain/importacion";

describe("importación de preguntas", () => {
  const fila = ["X-001", "M2_REDES", "m2-ip", "", "3", "conceptual", "Enunciado suficientemente largo, con coma, para la prueba", "op A", "porque A es correcta", "op B", "porque B no", "op C", "porque C no", "op D", "porque D no", "A", "Explicación con más de veinte caracteres", "rfc-1918", "", "false", "ipv4|prueba"];
  const csv = COLUMNAS_CSV.join(",") + "\n" + fila.map((c) => `"${c}"`).join(",") + "\n";
  it("parsea CSV con comillas y comas internas", () => {
    expect(parsearCSV('a,"b, c",d\n1,"dos ""comillas""",3')).toEqual([["a", "b, c", "d"], ["1", 'dos "comillas"', "3"]]);
  });
  it("importa y fuerza estado pendiente de revisión", () => {
    const r = importarPreguntas(csv, "csv");
    expect(r.errores).toEqual([]);
    expect(r.validas[0].estado).toBe("pendiente_revision");
    expect(r.validas[0].etiquetas).toEqual(["ipv4", "prueba"]);
  });
  it("rechaza tema de otro módulo y fuentes inexistentes", () => {
    const malo = csv.replace('"m2-ip"', '"m1-fund"').replace('"rfc-1918"', '"inventada"');
    const r = importarPreguntas(malo, "csv");
    expect(r.validas.length).toBe(0);
    expect(r.errores[0].mensaje).toMatch(/no pertenece/);
    expect(r.errores[0].mensaje).toMatch(/fuente/);
  });
});

import { MATERIAL } from "@/lib/content/material";

describe("material de estudio", () => {
  const temas = TEMARIO.flatMap((m) => m.temas.map((t) => t.id));
  it("cubre todos los temas del temario sin duplicados", () => {
    const ids = MATERIAL.map((m) => m.temaId);
    expect(new Set(ids).size).toBe(ids.length);
    expect(temas.filter((t) => !ids.includes(t))).toEqual([]);
  });
  it("cada punto cita una fuente del repositorio", () => {
    for (const m of MATERIAL) for (const p of m.puntos) expect(FUENTE_POR_ID[p.fuenteId], `${m.temaId}: ${p.fuenteId}`).toBeDefined();
  });
});

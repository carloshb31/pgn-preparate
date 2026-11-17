-- PGN PREPÁRATE · Esquema relacional (PostgreSQL / Supabase)
-- Los usuarios viven en auth.users (Supabase Auth). public.user_profiles extiende ese registro.

create extension if not exists pgcrypto;

-- ---------- Tipos ----------
create type nucleo_t as enum ('general', 'especifico');
create type estado_pregunta_t as enum ('borrador_ia', 'pendiente_revision', 'validada', 'publicada', 'descartada');
create type tipo_pregunta_t as enum ('conceptual','normativa','interpretacion','escenario','resolucion_problemas','decision_tecnica','asesoria_institucional','caso_ciberseguridad');
create type fundamento_t as enum ('conocimiento_esencial', 'funcion', 'complementario');
create type modalidad_t as enum ('general','especifico','modulo','comportamental','integral','personalizado');
create type tipo_actividad_t as enum ('lectura','practica','cuestionario','simulacro_parcial','simulacro_integral','repaso');
create type rol_t as enum ('aspirante', 'admin');

-- ---------- Perfiles ----------
create table public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nombre text,
  rol rol_t not null default 'aspirante',
  convocatoria_id text,
  creado timestamptz not null default now()
);

-- ---------- Catálogo oficial ----------
create table public.convocatorias (
  id text primary key,                         -- '51-2026'
  entidad text not null,
  denominacion text not null,
  codigo_grado text not null,
  dependencia text not null,
  vacantes int not null check (vacantes > 0),
  version int not null,
  resolucion_version text not null,
  datos jsonb not null default '{}'::jsonb,    -- propósito, funciones, ubicación…
  -- parámetros oficiales de la prueba: null mientras no se publiquen
  num_preguntas_oficial int,
  duracion_min_oficial int,
  fecha_prueba_oficial date,
  actualizado timestamptz not null default now()
);

create table public.temarios (
  id uuid primary key default gen_random_uuid(),
  convocatoria_id text not null references public.convocatorias(id) on delete cascade,
  version int not null default 1,
  fuente text not null,                        -- 'Formato de Convocatoria 51-2026 v3, págs. 2-4'
  vigente boolean not null default true,
  unique (convocatoria_id, version)
);

create table public.modulos (
  id text primary key,                         -- 'M1_SEGURIDAD'
  temario_id uuid not null references public.temarios(id) on delete cascade,
  numero int not null,
  nombre text not null,
  nucleo nucleo_t not null,
  prioridad_base int not null check (prioridad_base between 1 and 5),
  fundamento_convocatoria text[] not null default '{}',
  descripcion text,
  unique (temario_id, numero)
);

create table public.temas (
  id text primary key,
  modulo_id text not null references public.modulos(id) on delete cascade,
  nombre text not null,
  fundamento fundamento_t not null,
  subtemas text[] not null default '{}',
  orden int not null default 0
);
create index temas_modulo_idx on public.temas(modulo_id);

create table public.fuentes (
  id text primary key,
  titulo text not null,
  emisor text not null,
  nivel int not null check (nivel between 1 and 4),
  categoria text not null,
  url text,
  fecha_verificacion date,                     -- null = no verificada por una persona
  verificada_por uuid references auth.users(id),
  notas text
);

create table public.competencias (
  id text primary key,
  nombre text not null,
  nivel text not null,
  grupo text not null,
  convocatoria_id text not null references public.convocatorias(id) on delete cascade
);

-- ---------- Banco de preguntas ----------
create table public.preguntas (
  id text primary key,
  modulo_id text not null references public.modulos(id),
  tema_id text not null references public.temas(id),
  subtema text,
  nucleo nucleo_t not null,
  dificultad int not null check (dificultad between 1 and 5),
  tipo tipo_pregunta_t not null,
  enunciado text not null check (length(enunciado) >= 20),
  explicacion text not null,
  fuente_id text not null references public.fuentes(id),
  referencia text,
  es_inferencia boolean not null default false,
  competencia_id text references public.competencias(id),
  etiquetas text[] not null default '{}',
  estado estado_pregunta_t not null default 'pendiente_revision',
  autor text not null default 'semilla',
  creado_por uuid references auth.users(id),
  creado timestamptz not null default now(),
  actualizado timestamptz not null default now()
);
create index preguntas_modulo_idx on public.preguntas(modulo_id);
create index preguntas_estado_idx on public.preguntas(estado);
create index preguntas_tema_idx on public.preguntas(tema_id);
create index preguntas_fts_idx on public.preguntas using gin (to_tsvector('spanish', enunciado || ' ' || explicacion));

create table public.opciones (
  pregunta_id text not null references public.preguntas(id) on delete cascade,
  letra char(1) not null check (letra in ('A','B','C','D','E')),
  texto text not null,
  justificacion text not null,
  es_correcta boolean not null default false,
  primary key (pregunta_id, letra)
);
-- Selección múltiple con única respuesta: como máximo una opción correcta por pregunta.
create unique index opciones_una_correcta on public.opciones(pregunta_id) where es_correcta;

create table public.preguntas_revision (
  id uuid primary key default gen_random_uuid(),
  pregunta_id text not null references public.preguntas(id) on delete cascade,
  revisor uuid references auth.users(id),
  estado_anterior estado_pregunta_t,
  estado_nuevo estado_pregunta_t not null,
  comentario text,
  fecha timestamptz not null default now()
);
create index preguntas_revision_pregunta_idx on public.preguntas_revision(pregunta_id);

-- ---------- Biblioteca ----------
create table public.documentos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade, -- null = documento global (admin)
  nombre text not null,
  categoria text not null,
  fuente_id text references public.fuentes(id),
  ruta_storage text not null,
  tamano bigint not null check (tamano >= 0),
  texto_extraido text,                          -- para búsqueda y RAG
  subido timestamptz not null default now()
);
create index documentos_user_idx on public.documentos(user_id);
create index documentos_fts_idx on public.documentos using gin (to_tsvector('spanish', coalesce(nombre,'') || ' ' || coalesce(texto_extraido,'')));

create table public.fichas_estudio (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  titulo text not null,
  modulo_id text references public.modulos(id),
  contenido text not null,
  fuente_id text references public.fuentes(id),
  creada timestamptz not null default now()
);
create index fichas_user_idx on public.fichas_estudio(user_id);

-- ---------- Simulacros e intentos ----------
-- Plantillas de simulacro configuradas por el administrador.
create table public.simulacros (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  modalidad modalidad_t not null,
  cantidad int not null check (cantidad between 1 and 300),
  duracion_min int not null check (duracion_min between 1 and 600),
  config jsonb not null,
  es_oficial boolean not null default false,   -- solo true si replica una estructura oficial publicada
  activo boolean not null default true
);

create table public.intentos (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  simulacro_id uuid references public.simulacros(id),
  modalidad modalidad_t not null,
  config jsonb not null,
  orden jsonb not null,
  inicio timestamptz not null,
  fin timestamptz,
  puntaje numeric(5,2) check (puntaje between 0 and 100),
  finalizado boolean not null default false
);
create index intentos_user_idx on public.intentos(user_id, inicio desc);

create table public.respuestas (
  intento_id text not null references public.intentos(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  pregunta_id text not null references public.preguntas(id),
  seleccion char(1),
  correcta boolean not null,
  marcada boolean not null default false,
  segundos int not null default 0 check (segundos >= 0),
  respondida timestamptz not null default now(),
  primary key (intento_id, pregunta_id)
);
create index respuestas_user_idx on public.respuestas(user_id, pregunta_id);

-- Resultados ponderados (estimados o registrados manualmente con valores oficiales).
create table public.resultados (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tipo text not null check (tipo in ('estimado', 'oficial', 'comportamental_practica')),
  conocimientos numeric(5,2),
  comportamentales numeric(5,2),
  antecedentes numeric(5,2),                   -- null = pendiente, nunca se asume
  detalle jsonb not null default '{}'::jsonb,
  creado timestamptz not null default now()
);
create index resultados_user_idx on public.resultados(user_id, creado desc);

-- ---------- Plan de estudio ----------
create table public.planes_estudio (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  fecha_examen date,                           -- ingresada por el usuario
  fecha_inicio date not null,
  horas_por_dia numeric(4,2) not null check (horas_por_dia > 0 and horas_por_dia <= 16),
  dias_por_semana int not null check (dias_por_semana between 1 and 7),
  minutos_por_sesion int not null check (minutos_por_sesion between 15 and 240),
  nivel_inicial text not null check (nivel_inicial in ('basico','intermedio','avanzado')),
  prioridades jsonb not null,
  actualizado timestamptz not null default now()
);

create table public.actividades_estudio (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null references public.planes_estudio(id) on delete cascade,
  fecha date not null,
  modulo_id text references public.modulos(id),
  tipo tipo_actividad_t not null,
  titulo text not null,
  minutos int not null check (minutos > 0),
  completada boolean not null default false,
  reprogramada_desde date
);
create index actividades_user_fecha_idx on public.actividades_estudio(user_id, fecha);

-- ---------- Progreso y repaso ----------
create table public.progreso (
  user_id uuid not null references auth.users(id) on delete cascade,
  modulo_id text not null references public.modulos(id),
  respuestas int not null default 0,
  aciertos int not null default 0,
  minutos_estudio int not null default 0,
  actualizado timestamptz not null default now(),
  primary key (user_id, modulo_id)
);

create table public.historial_repasos (
  user_id uuid not null references auth.users(id) on delete cascade,
  pregunta_id text not null references public.preguntas(id) on delete cascade,
  facilidad numeric(4,2) not null default 2.5,
  intervalo_dias int not null default 0,
  repeticiones int not null default 0,
  proxima date not null,
  primary key (user_id, pregunta_id)
);
create index repasos_proxima_idx on public.historial_repasos(user_id, proxima);

create table public.configuraciones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade, -- null = configuración global
  clave text not null,
  valor jsonb not null,
  actualizado timestamptz not null default now(),
  -- PostgreSQL 15+: una sola fila global (user_id null) por clave
  constraint configuraciones_user_clave_uq unique nulls not distinct (user_id, clave)
);

-- Registro de actividad
create table public.registro_actividad (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  accion text not null,
  detalle jsonb,
  fecha timestamptz not null default now()
);

-- ---------- Disparadores ----------
create or replace function public.tocar_actualizado() returns trigger language plpgsql as $$
begin new.actualizado := now(); return new; end $$;

create trigger preguntas_actualizado before update on public.preguntas for each row execute function public.tocar_actualizado();

-- Mantiene la tabla de progreso al registrar respuestas.
create or replace function public.actualizar_progreso() returns trigger language plpgsql security definer set search_path = public as $$
declare m text;
begin
  select modulo_id into m from public.preguntas where id = new.pregunta_id;
  insert into public.progreso(user_id, modulo_id, respuestas, aciertos)
  values (new.user_id, m, 1, case when new.correcta then 1 else 0 end)
  on conflict (user_id, modulo_id) do update
    set respuestas = public.progreso.respuestas + 1,
        aciertos = public.progreso.aciertos + (case when new.correcta then 1 else 0 end),
        actualizado = now();
  return new;
end $$;
create trigger respuestas_progreso after insert on public.respuestas for each row execute function public.actualizar_progreso();

-- Registra cada cambio de estado de una pregunta.
create or replace function public.registrar_revision() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.estado is distinct from old.estado then
    insert into public.preguntas_revision(pregunta_id, revisor, estado_anterior, estado_nuevo)
    values (new.id, auth.uid(), old.estado, new.estado);
  end if;
  return new;
end $$;
create trigger preguntas_revision_log after update on public.preguntas for each row execute function public.registrar_revision();

-- Crea el perfil al registrarse un usuario.
create or replace function public.crear_perfil() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.user_profiles(user_id, nombre, convocatoria_id) values (new.id, new.raw_user_meta_data->>'nombre', '51-2026');
  return new;
end $$;
create trigger auth_crear_perfil after insert on auth.users for each row execute function public.crear_perfil();

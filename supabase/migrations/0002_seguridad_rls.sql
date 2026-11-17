-- PGN PREPÁRATE · Políticas de acceso (Row Level Security)
-- Regla: cada usuario ve y modifica solo su información; el catálogo es de lectura
-- para usuarios autenticados y de escritura solo para administradores.

create or replace function public.es_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_profiles where user_id = auth.uid() and rol = 'admin');
$$;

-- Activar RLS en todas las tablas públicas
do $$
declare t text;
begin
  foreach t in array array[
    'user_profiles','convocatorias','temarios','modulos','temas','fuentes','competencias',
    'preguntas','opciones','preguntas_revision','documentos','fichas_estudio','simulacros',
    'intentos','respuestas','resultados','planes_estudio','actividades_estudio','progreso',
    'historial_repasos','configuraciones','registro_actividad'
  ] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- ---------- Perfiles ----------
create policy perfil_propio_select on public.user_profiles for select using (user_id = auth.uid() or public.es_admin());
create policy perfil_propio_update on public.user_profiles for update using (user_id = auth.uid())
  with check (user_id = auth.uid() and rol = (select rol from public.user_profiles where user_id = auth.uid()));
create policy perfil_admin_all on public.user_profiles for all using (public.es_admin()) with check (public.es_admin());

-- ---------- Catálogo: lectura autenticada, escritura admin ----------
do $$
declare t text;
begin
  foreach t in array array['convocatorias','temarios','modulos','temas','fuentes','competencias','simulacros'] loop
    execute format('create policy %I on public.%I for select to authenticated using (true)', t || '_lectura', t);
    execute format('create policy %I on public.%I for all to authenticated using (public.es_admin()) with check (public.es_admin())', t || '_admin', t);
  end loop;
end $$;

-- Preguntas: los aspirantes no ven las descartadas; las experimentales se muestran marcadas en la app.
create policy preguntas_lectura on public.preguntas for select to authenticated using (estado <> 'descartada' or public.es_admin());
create policy preguntas_admin on public.preguntas for all to authenticated using (public.es_admin()) with check (public.es_admin());

create policy opciones_lectura on public.opciones for select to authenticated
  using (exists (select 1 from public.preguntas p where p.id = pregunta_id and (p.estado <> 'descartada' or public.es_admin())));
create policy opciones_admin on public.opciones for all to authenticated using (public.es_admin()) with check (public.es_admin());

create policy revision_admin on public.preguntas_revision for all to authenticated using (public.es_admin()) with check (public.es_admin());

-- ---------- Datos personales del aspirante ----------
do $$
declare t text;
begin
  foreach t in array array['fichas_estudio','intentos','respuestas','resultados','planes_estudio','actividades_estudio','progreso','historial_repasos'] loop
    execute format('create policy %I on public.%I for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid())', t || '_propio', t);
  end loop;
end $$;

-- Un intento finalizado no admite cambios en sus respuestas.
create policy respuestas_bloqueo on public.respuestas as restrictive for update to authenticated
  using (not exists (select 1 from public.intentos i where i.id = intento_id and i.finalizado and i.fin < now() - interval '1 minute'));

-- Documentos: propios o globales (user_id null) en lectura; escritura propia o admin.
create policy documentos_lectura on public.documentos for select to authenticated using (user_id = auth.uid() or user_id is null);
create policy documentos_propios on public.documentos for insert to authenticated with check (user_id = auth.uid() or (user_id is null and public.es_admin()));
create policy documentos_borrar on public.documentos for delete to authenticated using (user_id = auth.uid() or (user_id is null and public.es_admin()));

-- Configuración: propia; la global la edita el admin y la leen todos.
create policy config_lectura on public.configuraciones for select to authenticated using (user_id = auth.uid() or user_id is null);
create policy config_propia on public.configuraciones for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy config_global_admin on public.configuraciones for all to authenticated using (user_id is null and public.es_admin()) with check (user_id is null and public.es_admin());

create policy registro_insert on public.registro_actividad for insert to authenticated with check (user_id = auth.uid());
create policy registro_admin on public.registro_actividad for select to authenticated using (public.es_admin());

-- ---------- Storage ----------
insert into storage.buckets (id, name, public) values ('documentos', 'documentos', false) on conflict (id) do nothing;

create policy storage_doc_lectura on storage.objects for select to authenticated
  using (bucket_id = 'documentos' and ((storage.foldername(name))[1] = auth.uid()::text or (storage.foldername(name))[1] = 'global'));
create policy storage_doc_subir on storage.objects for insert to authenticated
  with check (bucket_id = 'documentos' and ((storage.foldername(name))[1] = auth.uid()::text or ((storage.foldername(name))[1] = 'global' and public.es_admin())));
create policy storage_doc_borrar on storage.objects for delete to authenticated
  using (bucket_id = 'documentos' and ((storage.foldername(name))[1] = auth.uid()::text or ((storage.foldername(name))[1] = 'global' and public.es_admin())));

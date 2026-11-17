# PGN PREPÁRATE · Concurso de Méritos 51-2026

Plataforma de preparación para el empleo **Asesor 1AS-19** de la Procuraduría General de la Nación
(Oficina de Tecnología, Innovación y Transformación Digital, perfil seguridad informática y ciberseguridad).

> Documento rector: Formato de Convocatoria 51-2026, versión 3 (Resolución 212 de 2026), con las
> Resoluciones 076, 108, 133, 212 y 243 de 2026. La aplicación separa siempre las **condiciones oficiales**
> de los **parámetros de práctica** de los simulacros.

## Estado del proyecto

| Fase | Estado | Qué incluye |
|---|---|---|
| 1. Diseño y estructura | Hecha | Arquitectura, navegación lateral y móvil, dashboard, esquema SQL con RLS |
| 2. Contenido académico | Hecha (pendiente de revisión) | Temario de 9 módulos, material de estudio para los 53 temas con fuente por punto, reglas de la Resolución 076 (arts. 18-21, 27-28), 46 fuentes por nivel de autoridad, biblioteca (PDF y fichas) |
| 3. Banco de preguntas | Parcial | Motor, filtros, práctica con retroalimentación, flujo de validación, importación CSV/JSON. **110 preguntas semilla** que cubren los 53 temas (meta: 1.000), todas pendientes de revisión; el generador con IA amplía el banco |
| 4. Simulacros | Hecha | 6 modalidades, modo examen, cronómetro, marcado, aleatorización con semilla, calificación e informe |
| 5. Inteligencia artificial | Hecha | Capa de proveedor intercambiable, RAG, generación validada con zod, tutor. En el artifact funciona con la cuenta de Claude del usuario; en Next.js requiere `ANTHROPIC_API_KEY` |
| 6. Analítica | Hecha | Índice de preparación, estadísticas, repetición espaciada (SM-2), plan adaptativo, exportación a Excel y PDF |
| 7. Pruebas y despliegue | Parcial | 21 pruebas unitarias, pruebas E2E con Playwright (Next.js y artifact), esquema SQL probado en PostgreSQL 16, publicada como artifact de Claude. **Falta:** despliegue en Vercel/Supabase y pruebas de seguridad externas |

## Versión publicada en Claude (sin instalación)

La plataforma se publica como artifact de Claude con `npm run build:artifact`, que genera
`dist-artifact/pgn-preparate.html` (un solo archivo). En esa versión:

- El avance se guarda en la capacidad `db`, en el espacio privado del usuario (`data/users/<id>/`).
- El tutor y el generador de preguntas usan la capacidad `sample`: consumen el uso de la cuenta de Claude de quien la abre y piden autorización la primera vez.
- Los PDF se cargan con `assets` y las exportaciones (Excel, JSON) con `downloads`.
- El enrutamiento usa nombres planos en el hash (`#plan`, `#simulacros`) mediante sustitutos de `next/link` y `next/navigation` (`src/artifact/`).
- El visor no permite imprimir, por eso los botones de PDF se ocultan en esa versión.

## Arranque rápido (modo local de demostración)

```bash
npm install
npm run dev        # http://localhost:3000
```

Sin variables de entorno, la app arranca en **modo local de demostración**, identificado en la barra
lateral: los datos quedan solo en el navegador (localStorage + IndexedDB para PDF). No simula persistencia remota.

## Conectar Supabase (persistencia real y cuentas)

1. Cree un proyecto en Supabase (PostgreSQL 15 o superior).
2. Ejecute en el SQL Editor, en orden:
   - `supabase/migrations/0001_esquema.sql`
   - `supabase/migrations/0002_seguridad_rls.sql`
   - `supabase/seed.sql` (temario, fuentes, competencias y banco semilla)
3. Copie `.env.example` a `.env.local` y complete `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Regístrese en la app. Para ser administrador:
   ```sql
   update public.user_profiles set rol = 'admin' where user_id = (select id from auth.users where email = 'su@correo');
   ```

Si cambia contenido en `src/lib/content`, regenere la semilla con `npm run seed:sql`.

## Conectar la IA

En `.env.local` (solo servidor; la clave nunca llega al navegador):

```
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=...
ANTHROPIC_MODEL=...          # consulte los modelos vigentes en docs.claude.com
SUPABASE_SERVICE_ROLE_KEY=... # opcional: habilita RAG sobre documentos globales cargados en Supabase
```

Para usar otro proveedor, implemente `ProveedorIA` en `src/lib/ai/provider.ts` y regístrelo en `PROVEEDORES`.

## Arquitectura

```
src/
  app/                    Rutas (App Router): /, /plan, /biblioteca, /banco, /simulacros, /competencias,
                          /estadisticas, /asistente, /progreso, /configuracion, /admin, /api/ai/*
  components/             Shell (navegación), store (estado global), UI base, login
  lib/
    config/convocatoria   Datos oficiales: empleo, ponderaciones, cronograma, competencias
    content/              Temario, fuentes, banco semilla, casos situacionales
    domain/               Lógica pura y probada: calificación, simulacros, SRS, plan, analítica, importación
    data/                 Repositorio: interfaz + adaptador local + adaptador Supabase
    ai/                   Proveedor IA, recuperación (RAG), generación y tutor, guardas (auth y límite)
supabase/                 Migraciones (esquema + RLS) y semilla
tests/                    Pruebas unitarias (vitest)
```

**Principios:** la UI nunca habla con localStorage o Supabase directamente (pasa por `Repositorio`);
la lógica de dominio no depende de React; todo dato oficial vive en `lib/config` con su fuente.

### Base de datos

22 tablas en `public` más `auth.users` de Supabase: `user_profiles`, `convocatorias`, `temarios`, `modulos`,
`temas`, `fuentes`, `documentos`, `fichas_estudio`, `preguntas`, `opciones`, `preguntas_revision`,
`competencias`, `simulacros`, `intentos`, `respuestas`, `resultados`, `planes_estudio`,
`actividades_estudio`, `progreso`, `historial_repasos`, `configuraciones` y `registro_actividad`.

- **RLS en todas las tablas.** Cada usuario solo lee y escribe lo suyo; el catálogo es de lectura para
  autenticados y de escritura para `admin`. Un usuario no puede elevarse a admin.
- Índice único parcial: como máximo una opción correcta por pregunta.
- Disparadores: `progreso` se actualiza al insertar respuestas; cada cambio de estado de una pregunta
  queda en `preguntas_revision`; el perfil se crea al registrarse.
- Storage: bucket privado `documentos`, carpeta por usuario.

## Reglas de rigor académico implementadas

- Ponderación 70/20/10, mínimo eliminatorio 65 y mínimo de elegibles 70: configurables y validados.
- Número de preguntas, duración, distribución entre núcleos y fecha: `null` hasta que se publiquen.
  Ningún simulacro afirma reproducir la estructura oficial.
- Antecedentes: nunca se asumen. Quedan pendientes o se registran manualmente como oficiales.
- Toda pregunta semilla, importada o generada entra como `pendiente_revision` o `borrador_ia` y se
  muestra como **experimental** hasta que un administrador la valide.
- Cada pregunta indica fuente, referencia y si la respuesta es inferencia académica.
- Las fuentes no tienen fecha de verificación hasta que una persona la registre.
- El generador de IA descarta preguntas cuya fuente no esté en el contexto recuperado.

## Scripts

| Comando | Uso |
|---|---|
| `npm run dev` | Desarrollo |
| `npm run build && npm start` | Producción |
| `npm test` | Pruebas unitarias |
| `npm run typecheck` | Verificación de tipos |
| `npm run seed:sql` | Regenera `supabase/seed.sql` |
| `npm run build:artifact` | Genera la versión de un solo archivo para Claude |

## Despliegue

Compatible con Vercel u otro hosting de Next.js 14. Configure las mismas variables de entorno del
`.env.example`. La app es una PWA instalable (manifest y service worker que no cachea `/api`).

## Próximos pasos sugeridos

1. Validar las 110 preguntas semilla y el material de estudio contra sus fuentes, y registrar la fecha de verificación de cada fuente.
2. Cargar en Supabase los PDF oficiales (Resolución 076, Decreto Ley 262 de 2000, Diccionario de
   Competencias) con texto extraído para alimentar el RAG.
3. Ampliar el banco por módulo hacia las metas (250 en seguridad, 150 en redes, etc.) con el generador y revisión humana.
4. Ampliar el material de estudio con casos resueltos por tema.
5. Actualizar `PARAMETROS_PRUEBA_OFICIAL` cuando se publique la guía de orientación al aspirante.

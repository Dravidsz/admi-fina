# Histórico de Desarrollo — Sistema de Análisis Financiero

> Este documento registra el avance del proyecto, lo que ya está hecho, lo que falta y en qué etapa nos encontramos.

---

## Información general

- **Fecha de inicio del desarrollo activo:** 23 de noviembre de 2026
- **Stack:** Vite + React + TypeScript + TanStack (Router / Query / Table / Form) + Tailwind CSS + Express + MongoDB (Mongoose)
- **Libro base:** *Fundamentos de Administración Financiera* (14ª ed.) — Block, Hirt y Danielsen
- **Objetivo:** Aplicación web full-stack para calcular estados financieros, flujo de efectivo, 15 razones contables, análisis vertical/horizontal, Du Pont y pronósticos por porcentaje de ventas.

---

## Estado por módulo

### 1. Infraestructura y configuración

| Tarea | Estado | Notas |
|-------|--------|-------|
| Proyecto Vite con React + TypeScript | ✅ Hecho | `web/vite.config.ts`, `web/tsconfig.json` |
| Configuración de Tailwind CSS | ✅ Hecho | `web/tailwind.config.js`, `web/postcss.config.js` |
| Alias de rutas (`@/`, `@server/`, `@shared/`) | ✅ Hecho | Funcionan en cliente y servidor |
| Dependencias instaladas | ✅ Hecho | `node_modules` presente |
| Compilación / typecheck | ✅ Hecho | `npm run typecheck` pasa sin errores |
| Build de producción frontend | ✅ Hecho | `npm run build` genera `web/dist` correctamente |
| Levantamiento local (MongoDB + backend + frontend) | ✅ Probado | `npm run dev:all` funciona correctamente |

### 2. Modelos de datos y base de datos

| Tarea | Estado | Notas |
|-------|--------|-------|
| Conexión a MongoDB con Mongoose | ✅ Hecho | `web/src/server/db.ts` con cache de conexión |
| Modelo `Empresa` | ✅ Hecho | `web/src/server/models/Empresa.ts` |
| Modelo `Periodo` | ✅ Hecho | `web/src/server/models/Periodo.ts` con subdocumentos de ER y BG |
| Índice único empresa + año | ✅ Hecho | `PeriodoSchema.index({ empresaId: 1, anio: 1 }, { unique: true })` |

### 3. Fórmulas financieras compartidas (`web/src/shared/formulas.ts`)

| Tarea | Estado | Notas |
|-------|--------|-------|
| Cálculo de estado de resultados | ✅ Hecho | Incluye utilidad bruta, operativa, neta, EPS |
| Cálculo de balance general | ✅ Hecho | Incluye validación de cuadre |
| Flujo de efectivo (método indirecto) | ✅ Hecho | `calcularFlujoEfectivo` + `completarFlujoEfectivo` |
| Flujo de efectivo libre (Free Cash Flow) | ✅ Hecho | `calcularFlujoEfectivoLibre` |
| 15 razones financieras | ✅ Hecho | Rentabilidad, actividad, liquidez, endeudamiento |
| Análisis vertical | ✅ Hecho | Estado de resultados, activos, pasivo + capital |
| Análisis horizontal | ✅ Hecho | Función base para comparar dos valores |
| Análisis Du Pont | ✅ Hecho | Descompone ROA y ROE |
| Pronóstico porcentaje de ventas (RNF) | ✅ Hecho | Incluye plena capacidad y activos fijos |

### 4. Backend (API REST con Express)

| Tarea | Estado | Notas |
|-------|--------|-------|
| Servidor Express configurado | ✅ Hecho | `web/src/server/index.ts` |
| Middleware CORS y JSON | ✅ Hecho | Configurado |
| Manejo de errores | ✅ Hecho | Middleware básico implementado |
| Rutas de empresas (CRUD) | ✅ Hecho | `web/src/server/routes/empresas.routes.ts` |
| Servicio de empresas | ✅ Hecho | `web/src/server/services/empresa.service.ts` |
| Rutas de periodos (CRUD) | ✅ Hecho | `web/src/server/routes/periodos.routes.ts` |
| Servicio de periodos | ✅ Hecho | Incluye búsqueda de periodo anterior |
| Rutas de cálculos | ✅ Hecho | Estados, razones, flujo, vertical, horizontal, Du Pont, pronóstico |
| Servicio de cálculos | ✅ Hecho | Orquesta las fórmulas para cada reporte |
| Validación con Zod | ✅ Hecho | En rutas de empresas, periodos y pronóstico |

### 5. Frontend — Rutas y navegación

| Tarea | Estado | Notas |
|-------|--------|-------|
| Router con TanStack Router | ✅ Hecho | `web/src/client/router.tsx` |
| Layout raíz con navegación | ✅ Hecho | `web/src/client/routes/__root.tsx` |
| Página de inicio | ✅ Hecho | `web/src/client/routes/index.tsx` |
| Página de empresas (listado + crear) | ✅ Hecho | `web/src/client/routes/empresas.tsx` |
| Página de detalle de empresa (periodos + crear) | ✅ Hecho | `web/src/client/routes/empresas.$id.tsx` |
| Página de periodo con pestañas | ✅ Hecho | `web/src/client/routes/periodo.$id.tsx` |

### 6. Frontend — Funcionalidad por pestaña

| Tarea | Estado | Notas |
|-------|--------|-------|
| Formulario estado de resultados | ✅ Hecho | Todos los campos editables |
| Formulario balance general | ✅ Hecho | Todos los campos editables |
| Visualización de estados calculados | ✅ Hecho | Pestaña "Estados" |
| 15 razones financieras | ✅ Hecho | Pestaña "Razones" con tabla |
| Flujo de efectivo | ✅ Hecho | Pestaña "Flujo de efectivo" + FCF |
| Análisis vertical | ✅ Hecho | Pestaña "Vertical" |
| Análisis horizontal | ✅ Hecho | Pestaña "Horizontal" del balance |
| Análisis Du Pont | ✅ Hecho | Pestaña "Du Pont" |
| Pronóstico porcentaje de ventas | ✅ Hecho | Pestaña "Pronóstico" con formulario |

### 7. Campos y detalles pendientes en UI/UX

| Tarea | Estado | Notas |
|-------|--------|-------|
| Editar `dividendosComunes` en el periodo | ✅ Hecho | Formulario agregado en pestaña "Datos" |
| Editar `arrendamiento` en el periodo | ✅ Hecho | Formulario agregado en pestaña "Datos" |
| Mostrar mensaje cuando no hay periodo anterior | 🔄 Mejorable | Flujo y horizontal requieren año anterior |
| Formateo de moneda en tablas | 🔄 Mejorable | Algunos valores se muestran sin "$" |
| Estados de carga y errores | 🔄 Básico | Funciona, pero puede pulirse |

### 8. Exportación e integraciones

| Tarea | Estado | Notas |
|-------|--------|-------|
| Dependencia ExcelJS instalada | ✅ Hecho | `exceljs` en `package.json` |
| Endpoint de exportación a Excel | ✅ Hecho | `GET /api/export/periodo/:id/excel` con ExcelJS |
| Botón de exportación en la UI | ✅ Hecho | Botón "Exportar Excel" en página del periodo |
| Exportación a PDF | ❌ Pendiente | No implementado |
| Importación desde Excel/CSV | ❌ Pendiente | Fuera del alcance inicial |

### 9. Autenticación y usuarios

| Tarea | Estado | Notas |
|-------|--------|-------|
| Modelo de usuario | ❌ Pendiente | Planeado en `PLAN_SISTEMA.md` |
| Login / registro | ❌ Pendiente | No implementado |
| Protección de rutas | ❌ Pendiente | No implementado |
| Clerk o JWT | ❌ Pendiente | Tecnología a definir |

### 10. Calidad y despliegue

| Tarea | Estado | Notas |
|-------|--------|-------|
| Tests unitarios de fórmulas | ❌ Pendiente | No hay tests |
| Tests de API | ❌ Pendiente | No hay tests |
| Tests E2E | ❌ Pendiente | No hay tests |
| Pipeline de CI/CD | ❌ Pendiente | No configurado |
| Despliegue en producción | ❌ Pendiente | No configurado |
| Variables de entorno documentadas | 🔄 Parcial | `.env` mencionado pero no documentado |

---

## Etapa actual

**Fase 2 de 4: Funcionalidad core completa. Iniciando Fase 3 — Integraciones.**

1. ✅ **Fase 1 — Fundamentos:** configuración, modelos, fórmulas y API base.
2. ✅ **Fase 2 — UI funcional:** todas las pantallas principales operativas. Campos faltantes agregados.
3. 🔄 **Fase 3 — Integraciones:** exportación Excel lista; PDF e importación opcional pendientes.
4. ⏳ **Fase 4 — Producción:** autenticación, tests, despliegue.

---

## Próximas tareas inmediatas

1. **Probar el flujo completo localmente.**
   - Levantar MongoDB, backend y frontend.
   - Crear empresa, periodos, ingresar datos y revisar reportes.
   - Verificar que la exportación a Excel descarga correctamente.

2. **Documentar variables de entorno y arranque.**
   - Crear `.env.example` y actualizar `README_SISTEMA.md`.

3. **Mejorar UX/UI.**
   - Formato de moneda consistente.
   - Estados de carga y mensajes de error más amigables.
   - Indicador visual cuando el balance no cuadra.

4. **Exportación a PDF (opcional, Fase 3).**
   - Evaluar Puppeteer/Playwright para generar PDF de reportes.

5. **Autenticación y autorización (Fase 4).**
   - Decidir tecnología: Clerk vs JWT propio.
   - Modelo de usuario y protección de rutas.

---

## Registro de cambios

### 23 de noviembre de 2026
- Revisión completa del código existente.
- Verificación de compilación: `npm run typecheck` y `npm run build` exitosos.
- Creación de este histórico.
- Inicio oficial de la Fase 2.
- Agregados campos `dividendosComunes` y `arrendamiento` al formulario del periodo (`web/src/client/routes/periodo.$id.tsx`).
  - Impacto: el flujo de efectivo, el FCF y la cobertura de cargos fijos ahora usan valores editables por el usuario.
- Implementada exportación a Excel (`web/src/server/services/export.service.ts`, `web/src/server/routes/export.routes.ts`).
  - Incluye hojas: Estado de Resultados, Balance General, Razones Financieras, Flujo de Efectivo, Análisis Vertical, Análisis Horizontal y Du Pont.
  - Botón "Exportar Excel" agregado en la página del periodo.
- Prueba local exitosa del stack completo:
  - `npm run dev:all` levantó MongoDB, backend (puerto 3001) y frontend (puerto 5173).
  - Se creó una empresa de prueba y dos periodos (2024 y 2025).
  - Se validaron endpoints: health, estados, razones, flujo de efectivo, vertical, horizontal, Du Pont, pronóstico y exportación Excel.
  - Archivo Excel generado correctamente con 7 hojas (~14 KB).


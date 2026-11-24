# Plan de Sistema de Análisis Financiero — Versión TanStack + MongoDB

## 1. Análisis del libro base

**Libro:** *Fundamentos de Administración Financiera* (14ª ed.) — Block, Hirt y Danielsen.

Secciones relevantes identificadas:

| Capítulo | Contenido clave para el sistema |
|----------|---------------------------------|
| 2. Repaso de contabilidad | Estado de resultados, balance general, estado de flujo de efectivo (método indirecto), flujo de efectivo libre, depreciación e impuestos. |
| 3. Análisis financiero | 13 razones financieras en 4 grupos, sistema Du Pont, análisis de tendencias. |
| 4. Pronósticos financieros | Estados financieros proforma, presupuesto de efectivo, método del porcentaje de ventas. |

> **Nota importante:** el libro presenta **13 razones financieras principales**, no 15. El sistema incluirá esas 13 más el margen bruto y el margen operativo para llegar a las **15 razones contables** solicitadas.

> **Nota sobre análisis vertical/horizontal:** el libro no los trata explícitamente con esos nombres, pero son técnicas estándar de análisis financiero que complementan las razones del libro.

---

## 2. Objetivo del sistema

Construir una aplicación web full-stack capaz de:

1. Gestionar múltiples empresas y sus periodos contables en MongoDB.
2. Calcular automáticamente el **estado de resultados**.
3. Calcular y validar el **balance general**.
4. Calcular el **estado de flujo de efectivo** por el método indirecto.
5. Calcular **15 razones financieras** alineadas con el libro.
6. Generar **análisis vertical** y **horizontal**.
7. Calcular **análisis Du Pont**.
8. Realizar **pronósticos** por el método del porcentaje de ventas.
9. Exportar reportes a Excel y PDF.
10. Permitir comparación entre periodos y empresas.

---

## 3. Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Cliente | **Vite + React + TypeScript** |
| Enrutamiento | **TanStack Router** |
| Estado asíncrono | **TanStack Query** |
| Tablas | **TanStack Table** |
| Formularios | **TanStack Form** |
| Estilos | **Tailwind CSS** |
| Servidor | **Express + Node.js** |
| Base de datos | **MongoDB** con Mongoose |
| Lógica de cálculo | TypeScript compartida (shared) |
| Exportación | ExcelJS (Excel), Puppeteer/Playwright (PDF) |
| Autenticación | Clerk o JWT (a definir) |
| Despliegue | Vercel (frontend) + Render/Railway (backend) + MongoDB Atlas |

---

## 4. Arquitectura del proyecto

```
admi-fina/
├── web/                              # Aplicación web TanStack + Express + MongoDB
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── client/                   # Frontend React + TanStack
│   │   │   ├── main.tsx
│   │   │   ├── App.tsx
│   │   │   ├── router.tsx
│   │   │   ├── routes/
│   │   │   │   ├── __root.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   ├── empresas.tsx
│   │   │   │   ├── empresas.$id.tsx
│   │   │   │   └── periodo.$id.tsx
│   │   │   ├── components/
│   │   │   └── api/
│   │   ├── server/                   # Backend Express + MongoDB
│   │   │   ├── index.ts
│   │   │   ├── db.ts
│   │   │   ├── models/
│   │   │   │   ├── Empresa.ts
│   │   │   │   └── Periodo.ts
│   │   │   ├── routes/
│   │   │   │   ├── empresas.routes.ts
│   │   │   │   ├── periodos.routes.ts
│   │   │   │   └── calculos.routes.ts
│   │   │   └── services/
│   │   │       ├── empresa.service.ts
│   │   │       ├── periodo.service.ts
│   │   │       └── calculos.service.ts
│   │   └── shared/                   # Tipos y fórmulas compartidas
│   │       ├── types.ts
│   │       └── formulas.ts
│   └── index.html
├── docs/                             # Subplanes por funcionalidad
│   ├── 01-estado-resultados.md
│   ├── 02-balance-general.md
│   ├── 03-flujo-efectivo.md
│   ├── 04-razones-financieras.md
│   ├── 05-analisis-vertical.md
│   ├── 06-analisis-horizontal.md
│   ├── 07-analisis-dupont.md
│   ├── 08-pronosticos-ventas.md
│   ├── 09-gestion-empresas.md
│   ├── 10-autenticacion.md
│   ├── 11-exportes-reportes.md
│   └── 12-despliegue.md
├── PLAN_SISTEMA.md
└── README_SISTEMA.md
```

---

## 5. Entidades principales en MongoDB

### Empresa
```typescript
{
  _id: ObjectId,
  nombre: string,
  descripcion?: string,
  industria?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Periodo
```typescript
{
  _id: ObjectId,
  empresaId: ObjectId,
  anio: number,
  estadoResultados: EstadoResultadosInput,
  balanceGeneral: BalanceGeneralInput,
  dividendosComunes: number,
  arrendamiento: number,
  createdAt: Date,
  updatedAt: Date
}
```

### Usuario (si aplica autenticación)
```typescript
{
  _id: ObjectId,
  clerkId?: string,
  email: string,
  nombre: string,
  rol: 'admin' | 'usuario',
  createdAt: Date
}
```

---

## 6. Subplanes por funcionalidad

Cada funcionalidad tiene su propio documento de subplan en `docs/`:

1. `01-estado-resultados.md` — Cálculo, almacenamiento y visualización del estado de resultados.
2. `02-balance-general.md` — Validación, cuadre y presentación del balance general.
3. `03-flujo-efectivo.md` — Estado de flujo de efectivo por método indirecto.
4. `04-razones-financieras.md` — Las 15 razones financieras y comparación con benchmarks.
5. `05-analisis-vertical.md` — Análisis vertical de estados financieros.
6. `06-analisis-horizontal.md` — Análisis horizontal entre periodos.
7. `07-analisis-dupont.md` — Descomposición Du Pont de ROA y ROE.
8. `08-pronosticos-ventas.md` — Método del porcentaje de ventas y RNF.
9. `09-gestion-empresas.md` — CRUD de empresas y periodos.
10. `10-autenticacion.md` — Autenticación y autorización.
11. `11-exportes-reportes.md` — Exportación a Excel y PDF.
12. `12-despliegue.md` — Despliegue en producción.

---

## 7. Flujo de trabajo del usuario

1. Iniciar sesión (si aplica autenticación).
2. Crear una empresa.
3. Registrar periodos contables (año actual y anterior).
4. Ingresar el estado de resultados y balance general de cada periodo.
5. Visualizar estados financieros calculados automáticamente.
6. Consultar razones financieras, análisis vertical/horizontal y Du Pont.
7. Realizar pronósticos porcentaje de ventas.
8. Exportar reportes a Excel/PDF.

---

## 8. Estado actual y próximos pasos

### ✅ Implementado
- Aplicación web con Vite + React + TypeScript + TanStack (Router, Query, Table, Form) + Tailwind CSS.
- Backend Express + MongoDB con Mongoose.
- Fórmulas financieras implementadas en TypeScript compartido entre cliente y servidor.
- Exportación a Excel con ExcelJS.

### 🔜 En desarrollo
1. Conexión y modelos de MongoDB con Mongoose.
2. Server functions / rutas API para CRUD y cálculos.
3. Rutas y componentes de UI.
4. Exportación de reportes desde la interfaz.
5. Autenticación.
6. Despliegue.

---

*Plan generado a partir del análisis del libro Fundamentos de Administración Financiera de Block, Hirt y Danielsen.*

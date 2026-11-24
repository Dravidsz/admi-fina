# Sistema de Análisis Financiero

Aplicación web para calcular estados financieros, flujo de efectivo, 15 razones contables, análisis vertical/horizontal y análisis Du Pont, basada en el libro *Fundamentos de Administración Financiera* (14ª ed.) de Block, Hirt y Danielsen.

## Stack tecnológico

- **Frontend:** Vite + React + TypeScript + TanStack Router / Query / Table / Form + Tailwind CSS.
- **Backend:** Express + MongoDB (Mongoose).
- **Cálculos:** TypeScript compartido entre cliente y servidor.
- **Exportación:** ExcelJS (Excel).

## Archivos del proyecto

| Archivo / carpeta | Descripción |
|-------------------|-------------|
| `PLAN_SISTEMA.md` | Plan completo de análisis y diseño del sistema. |
| `docs/` | 12 subplanes, uno por cada funcionalidad del sistema. |
| `web/` | Aplicación web con Vite + React + TanStack + Express + MongoDB. |

## Requisitos

- Node.js 20+ y npm.
- MongoDB local en `mongodb://localhost:27017` (o definir `MONGODB_URI`).

## Instalación y ejecución

```bash
cd web
npm install

# Levantar MongoDB, backend y frontend con un solo comando
npm run dev:all
```

O desde la raíz del proyecto:

```bash
./start.sh
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api
- MongoDB: `mongodb://127.0.0.1:27017/sistema_financiero`

## Scripts útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev:all` | Levanta MongoDB, backend y frontend juntos. |
| `npm run db:start` | Solo MongoDB local. |
| `npm run dev:client` | Solo Vite (frontend). |
| `npm run dev:server` | Solo Express con recarga automática. |
| `npm run server` | Ejecutar solo el backend. |
| `npm run build` | Compilar el frontend para producción. |
| `npm run typecheck` | Verificar tipos de TypeScript. |

## Funcionalidades incluidas

- **Gestión de empresas** y periodos contables en MongoDB.
- **Estado de resultados** con utilidades por acción (EPS).
- **Balance general** con validación de que cuadre.
- **Estado de flujo de efectivo** por el método indirecto.
- **Flujo de efectivo libre** (Free Cash Flow).
- **15 razones financieras**:
  1. Margen de utilidad bruta
  2. Margen de utilidad operativa
  3. Margen de utilidad neta
  4. Rendimiento sobre activos (ROA)
  5. Rendimiento sobre capital contable (ROE)
  6. Rotación de cuentas por cobrar
  7. Periodo promedio de cobranza
  8. Rotación de inventario
  9. Rotación de activos fijos
  10. Rotación de activos totales
  11. Razón circulante
  12. Razón rápida
  13. Deuda total / Activos totales
  14. Rotación del interés ganado
  15. Cobertura de cargos fijos
- **Análisis vertical** del estado de resultados y balance general.
- **Análisis horizontal** del balance general entre dos periodos.
- **Análisis Du Pont** (ROA y ROE descompuestos).
- **Valor en libros por acción** y utilidad por acción.
- **Pronóstico por método del porcentaje de ventas** (RNF).
- **Exportación a Excel** desde la interfaz web con hojas separadas.

## Notas importantes

- El libro presenta **13 razones principales**. Este sistema incluye esas 13 más el margen bruto y el margen operativo para llegar a 15.
- El análisis vertical y horizontal no aparece con esos nombres en el libro, pero son técnicas estándar que complementan el análisis de razones.
- Para calcular el flujo de efectivo se requieren los balances de dos periodos consecutivos.

## Flujo de uso

1. Crear una empresa desde **Empresas**.
2. Dentro de la empresa, crear los periodos contables (año actual y anterior).
3. En la página del periodo, ingresar el **estado de resultados** y el **balance general**.
4. Consultar los reportes calculados: estados, razones, flujo de efectivo, análisis vertical/horizontal, Du Pont y pronósticos.

## Próximas mejoras posibles

- Comparación automática contra benchmarks de industria.
- Gráficos de tendencias.
- Importación desde archivos Excel/CSV.
- Exportación de reportes a PDF.

# Subplan: Estado de Resultados

## Objetivo
Calcular, almacenar y visualizar el estado de resultados de una empresa para un periodo específico, siguiendo la estructura del Capítulo 2 del libro.

## Dependencias
- Gestión de empresas y periodos (`09-gestion-empresas.md`).
- Tipos compartidos en `shared/types/financiero.types.ts`.

## Modelo de datos (MongoDB)

El estado de resultados se almacena como subdocumento dentro de `Periodo`:

```typescript
interface EstadoResultadosInput {
  ventas: number;
  costoVentas: number;
  gastosVentaAdministracion: number;
  gastosDepreciacion: number;
  gastosIntereses: number;
  impuestos?: number;          // Monto fijo
  tasaImpuestos?: number;      // Alternativa: porcentaje
  dividendosPreferentes: number;
  accionesCirculacion: number;
  perdidasExtraordinarias?: number;
}
```

## Campos calculados

| Campo | Fórmula |
|-------|---------|
| Utilidad bruta | Ventas − Costo de ventas |
| Utilidad operativa (EBIT) | Utilidad bruta − Gastos V&A − Depreciación |
| Utilidad antes de impuestos | EBIT − Intereses − Pérdidas extraordinarias |
| Impuestos | `impuestos` si se proporciona, sino EBT × `tasaImpuestos` |
| Utilidad neta | EBT − Impuestos |
| Utilidad disponible accionistas comunes | Utilidad neta − Dividendos preferentes |
| Utilidad por acción (EPS) | Utilidad disponible / Acciones en circulación |
| Margen bruto | Utilidad bruta / Ventas |
| Margen operativo | EBIT / Ventas |
| Margen neto | Utilidad neta / Ventas |

## API / Server functions

- `getEstadoResultados(periodoId)` — Retorna el estado de resultados calculado.
- `guardarEstadoResultados(periodoId, datos)` — Valida y guarda los datos de entrada.
- `validarEstadoResultados(datos)` — Verifica que los valores sean coherentes (ej. costo de ventas ≤ ventas).

## Componentes UI

- `EstadoResultadosForm` — Formulario para ingresar/editar datos (TanStack Form).
- `EstadoResultadosView` — Tabla/visualización del estado de resultados con márgenes.
- `EstadoResultadosChart` — Gráfico de barras/apilado opcional.

## Validaciones

- Todos los campos numéricos deben ser ≥ 0 (excepto pérdidas extraordinarias).
- Acciones en circulación > 0.
- Si se proporciona `impuestos`, no se usa `tasaImpuestos`.

## Relación con otras funcionalidades

- Alimenta el cálculo de **razones financieras**.
- Alimenta el **análisis vertical** (% de ventas).
- Alimenta el **análisis horizontal** (comparación entre periodos).
- Se usa en el **análisis Du Pont** (margen neto).

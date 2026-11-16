# Subplan: Análisis Vertical

## Objetivo
Mostrar cada partida de los estados financieros como porcentaje de una base común (ventas para el estado de resultados, activos totales / pasivo+capital para el balance).

## Dependencias
- Estado de resultados (`01-estado-resultados.md`).
- Balance general (`02-balance-general.md`).

## Cálculos

### Estado de resultados
Cada partida se divide entre `ventas`:
- Costo de ventas / Ventas
- Utilidad bruta / Ventas
- Gastos V&A / Ventas
- EBIT / Ventas
- etc.

### Balance general
#### Activos
Cada activo se divide entre `activos totales`.

#### Pasivos y capital
Cada pasivo/capital se divide entre `pasivo + capital total`.

## API / Server functions

- `getAnalisisVertical(periodoId)` — Retorna análisis vertical completo.

## Componentes UI

- `AnalisisVerticalTabs` — Pestañas para ER, activos, pasivos/capital.
- `VerticalBarChart` — Gráficos de barras apiladas.
- `CommonSizeTable` — Tabla de tamaño común.

## Relación con otras funcionalidades

- Complementa las **razones financieras**.
- Base para identificar cambios estructurales entre periodos.

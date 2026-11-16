# Subplan: Análisis Horizontal

## Objetivo
Comparar los estados financieros de dos periodos consecutivos, mostrando variación absoluta y porcentual.

## Dependencias
- Estado de resultados (`01-estado-resultados.md`).
- Balance general (`02-balance-general.md`).

## Cálculos

Para cada cuenta:
- `variacion = valor_actual − valor_anterior`
- `porcentaje_cambio = (variacion / valor_anterior) × 100`

## API / Server functions

- `getAnalisisHorizontal(periodoId)` — Compara con el periodo anterior.
- `getAnalisisHorizontalEntrePeriodos(periodoId1, periodoId2)` — Comparación personalizada.

## Componentes UI

- `AnalisisHorizontalTable` — Tabla con colores para aumentos (verde) y disminuciones (rojo).
- `VariacionChart` — Gráfico de variaciones porcentuales.

## Validaciones

- Debe existir un periodo anterior.
- Manejar divisiones por cero cuando el valor anterior sea 0.

## Relación con otras funcionalidades

- Complementa el **análisis vertical**.
- Base para **análisis de tendencias**.

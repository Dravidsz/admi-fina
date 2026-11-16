# Subplan: Análisis Du Pont

## Objetivo
Descomponer el rendimiento sobre activos (ROA) y el rendimiento sobre capital contable (ROE) para identificar sus verdaderas fuentes.

## Dependencias
- Razones financieras (`04-razones-financieras.md`).

## Cálculos

### ROA (Du Pont)
```
ROA = Margen de utilidad neta × Rotación de activos totales
```

### ROE (Du Pont)
```
ROE = ROA / (1 − Deuda total / Activos totales)
```

## API / Server functions

- `getAnalisisDuPont(periodoId)` — Retorna descomposición completa.

## Componentes UI

- `DuPontTree` — Visualización en árbol de la descomposición.
- `DuPontComparison` — Comparación entre periodos.

## Relación con otras funcionalidades

- Usa las **razones financieras**.
- Ayuda a interpretar el **ROE** y el **ROA**.

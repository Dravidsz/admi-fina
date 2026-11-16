# Subplan: Razones Financieras (15)

## Objetivo
Calcular y presentar las 15 razones financieras derivadas del estado de resultados y el balance general, permitiendo comparar contra benchmarks de industria.

## Dependencias
- Estado de resultados (`01-estado-resultados.md`).
- Balance general (`02-balance-general.md`).

## Las 15 razones

### Rentabilidad
| # | Razón | Fórmula |
|---|-------|---------|
| 1 | Margen de utilidad bruta | Utilidad bruta / Ventas |
| 2 | Margen de utilidad operativa | EBIT / Ventas |
| 3 | Margen de utilidad neta | Utilidad neta / Ventas |
| 4 | ROA | Utilidad neta / Activos totales |
| 5 | ROE | Utilidad neta / Capital contable |

### Uso de activos
| # | Razón | Fórmula |
|---|-------|---------|
| 6 | Rotación de cuentas por cobrar | Ventas / Cuentas por cobrar neto |
| 7 | Periodo promedio de cobranza | Cuentas por cobrar / (Ventas / 360) |
| 8 | Rotación de inventario | Ventas / Inventario |
| 9 | Rotación de activos fijos | Ventas / Activos fijos netos |
| 10 | Rotación de activos totales | Ventas / Activos totales |

### Liquidez
| # | Razón | Fórmula |
|---|-------|---------|
| 11 | Razón circulante | Activos circulantes / Pasivos circulantes |
| 12 | Razón rápida | (Activos circulantes − Inventario) / Pasivos circulantes |

### Endeudamiento
| # | Razón | Fórmula |
|---|-------|---------|
| 13 | Deuda total / Activos totales | Pasivos totales / Activos totales |
| 14 | Rotación del interés ganado | EBIT / Gastos por intereses |
| 15 | Cobertura de cargos fijos | (EBIT + Arrendamiento) / (Intereses + Arrendamiento) |

## Benchmarks de industria

Se almacenan benchmarks opcionales por empresa o por industria:

```typescript
interface Benchmark {
  industria: string;
  razon: string;
  valor: number;
}
```

## API / Server functions

- `getRazonesFinancieras(periodoId)` — Retorna las 15 razones calculadas.
- `getBenchmarks(industria)` — Retorna benchmarks disponibles.
- `compararConIndustria(periodoId, industria)` — Evalúa cada razón vs. benchmark.

## Componentes UI

- `RazonesFinancierasTable` — Tabla con valor calculado, benchmark y estado.
- `RazonesRadarChart` — Gráfico de radar opcional.

## Validaciones

- Evitar divisiones por cero.
- Indicar claramente cuando un benchmark no está disponible.

## Relación con otras funcionalidades

- Alimenta el **análisis Du Pont**.
- Se usa en **gráficos de tendencias**.

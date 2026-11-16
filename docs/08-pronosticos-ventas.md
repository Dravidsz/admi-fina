# Subplan: Pronósticos por Porcentaje de Ventas

## Objetivo
Aplicar el método del porcentaje de ventas del Capítulo 4 para estimar los requerimientos de fondos nuevos (RNF).

## Dependencias
- Estado de resultados (`01-estado-resultados.md`).
- Balance general (`02-balance-general.md`).

## Fórmula

```
RNF = (A/S)(ΔS) − (L/S)(ΔS) − P(S2)(1 − D)
```

Donde:
- `A/S` = Relación de activos variables con ventas.
- `L/S` = Relación de pasivos variables con ventas.
- `ΔS` = Cambio en ventas.
- `P` = Margen de utilidad neta.
- `S2` = Nuevo nivel de ventas.
- `D` = Razón de pago de dividendos.

## Escenarios

- **Plena capacidad**: se requiere incrementar activos fijos.
- **Subutilización**: solo se requieren activos circulantes adicionales.

## API / Server functions

- `calcularRNF(periodoId, ventasNuevas, plenaCapacidad, ...)` — Retorna RNF descompuesto.

## Componentes UI

- `PronosticoVentasForm` — Formulario con escenarios.
- `RNFTree` — Desglose del requerimiento de fondos.

## Relación con otras funcionalidades

- Usa datos del **estado de resultados** y **balance general**.
- Puede generar un **balance general proforma**.

# Subplan: Estado de Flujo de Efectivo

## Objetivo
Calcular el estado de flujo de efectivo por el método indirecto, comparando el balance general de dos periodos consecutivos y el estado de resultados del periodo actual.

## Dependencias
- Estado de resultados (`01-estado-resultados.md`).
- Balance general de dos periodos (`02-balance-general.md`).

## Entradas

- Estado de resultados del periodo actual.
- Balance general del periodo actual.
- Balance general del periodo anterior.
- Dividendos comunes pagados.

## Cálculos

### Actividades de operación
```
Utilidad neta
+ Depreciación
- Incremento en activos circulantes
+ Decremento en activos circulantes
+ Incremento en pasivos circulantes
- Decremento en pasivos circulantes
= Flujo neto de operación
```

### Actividades de inversión
```
- Incremento en inversiones a largo plazo
- Incremento en planta y equipo (costo)
= Flujo neto de inversión
```

### Actividades de financiamiento
```
+ Incremento en bonos por pagar
- Dividendos preferentes pagados
- Dividendos comunes pagados
= Flujo neto de financiamiento
```

### Cambio neto en efectivo
```
Flujo operación + Flujo inversión + Flujo financiamiento
```

### Flujo de efectivo libre
```
Flujo operación − CAPEX − Dividendos totales
```

## API / Server functions

- `getFlujoEfectivo(periodoId)` — Requiere que exista un periodo anterior.
- `getFlujoEfectivoLibre(periodoId)`.

## Componentes UI

- `FlujoEfectivoView` — Visualización en tres secciones (operación, inversión, financiamiento).
- `ConciliacionEfectivo` — Muestra el cambio calculado vs. el cambio real en el balance.

## Validaciones

- Debe existir un periodo anterior.
- El cambio calculado debe coincidir con la diferencia de efectivo entre los dos balances.

## Relación con otras funcionalidades

- Usa datos de **estado de resultados** y **balance general**.
- El flujo de efectivo libre es un indicador clave para **pronósticos**.

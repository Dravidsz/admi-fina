# Subplan: Balance General

## Objetivo
Permitir el registro, validación y visualización del balance general, asegurando que activos = pasivos + capital contable.

## Dependencias
- Gestión de empresas y periodos (`09-gestion-empresas.md`).
- Tipos compartidos.

## Modelo de datos (MongoDB)

Subdocumento dentro de `Periodo`:

```typescript
interface BalanceGeneralInput {
  // Activos circulantes
  efectivo: number;
  valoresNegociables: number;
  cuentasCobrar: number;
  provisionCuentasMalas: number;
  inventario: number;
  gastosPagadosAdelantado: number;

  // Otros activos
  inversionesLargoPlazo: number;

  // Activos fijos
  plantaEquipoCosto: number;
  depreciacionAcumulada: number;

  // Pasivos circulantes
  cuentasPagar: number;
  documentosPagar: number;
  gastosDevengados: number;

  // Pasivos a largo plazo
  bonosPagar: number;

  // Capital contable
  capitalPreferente: number;
  capitalComun: number;
  capitalPagadoExceso: number;
  utilidadesRetenidas: number;
}
```

## Campos calculados

| Campo | Fórmula |
|-------|---------|
| Cuentas por cobrar neto | Cuentas por cobrar − Provisión |
| Activos circulantes | Suma de activos circulantes |
| Planta y equipo neto | Costo − Depreciación acumulada |
| Activos fijos neto | Planta y equipo neto + Inversiones LP |
| Activos totales | Activos circulantes + Activos fijos neto |
| Pasivos circulantes | Suma de pasivos circulantes |
| Pasivos totales | Pasivos circulantes + Bonos por pagar |
| Capital contable total | Suma del capital contable |
| Total pasivo + capital | Pasivos totales + Capital contable |
| Diferencia de cuadre | Activos totales − Total pasivo + capital |

## API / Server functions

- `getBalanceGeneral(periodoId)` — Retorna el balance calculado.
- `guardarBalanceGeneral(periodoId, datos)` — Valida y guarda.
- `validarCuadre(datos)` — Retorna si el balance cuadra y la diferencia.

## Componentes UI

- `BalanceGeneralForm` — Formulario dividido en secciones (activos, pasivos, capital).
- `BalanceGeneralView` — Vista tipo tabla con totales resaltados.
- `BalanceCuadreAlert` — Alerta visual si no cuadra.

## Validaciones

- Todos los valores ≥ 0.
- El balance debe cuadrar (diferencia < tolerancia, ej. 0.01).
- Provisión para cuentas malas ≤ Cuentas por cobrar.
- Depreciación acumulada ≤ Planta y equipo costo.

## Relación con otras funcionalidades

- Requerido para el **flujo de efectivo** (comparación entre dos periodos).
- Base para **razones financieras** (activos, capital, deuda).
- Base para **análisis vertical** y **horizontal**.
- Se usa en **Du Pont** (activos totales, deuda/activos).

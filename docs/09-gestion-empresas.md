# Subplan: Gestión de Empresas y Periodos

## Objetivo
Permitir el CRUD de empresas y sus periodos contables, que son la base de todas las funcionalidades.

## Modelos MongoDB

### Empresa
```typescript
interface Empresa {
  _id: ObjectId;
  nombre: string;
  descripcion?: string;
  industria?: string;
  usuarioId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Periodo
```typescript
interface Periodo {
  _id: ObjectId;
  empresaId: ObjectId;
  anio: number;
  estadoResultados: EstadoResultadosInput;
  balanceGeneral: BalanceGeneralInput;
  dividendosComunes: number;
  arrendamiento: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## API / Server functions

- `getEmpresas()` — Lista de empresas.
- `getEmpresa(id)` — Detalle de empresa.
- `crearEmpresa(datos)` — Crea empresa.
- `actualizarEmpresa(id, datos)` — Actualiza empresa.
- `eliminarEmpresa(id)` — Elimina empresa y sus periodos.
- `getPeriodos(empresaId)` — Lista de periodos.
- `getPeriodo(id)` — Detalle de periodo.
- `crearPeriodo(empresaId, datos)` — Crea periodo.
- `actualizarPeriodo(id, datos)` — Actualiza periodo.
- `eliminarPeriodo(id)` — Elimina periodo.

## Componentes UI

- `EmpresasList` — Lista de empresas.
- `EmpresaForm` — Formulario de empresa.
- `PeriodosList` — Lista de periodos.
- `PeriodoForm` — Formulario de periodo.

## Validaciones

- El `anio` de un periodo debe ser único por empresa.
- No se puede eliminar una empresa con periodos asociados sin confirmación.

## Relación con otras funcionalidades

- Es el punto de entrada para todas las demás funcionalidades.

# Sistema de Análisis Financiero

Sistema en Python para calcular estados financieros, flujo de efectivo, 15 razones contables, análisis vertical/horizontal y análisis Du Pont, basado en el libro *Fundamentos de Administración Financiera* (14ª ed.) de Block, Hirt y Danielsen.

## Archivos del proyecto

| Archivo / carpeta | Descripción |
|-------------------|-------------|
| `PLAN_SISTEMA.md` | Plan completo de análisis y diseño del sistema. |
| `docs/` | 12 subplanes, uno por cada funcionalidad del sistema. |
| `sistema_financiero.py` | Módulo Python de referencia con todas las fórmulas validadas. |
| `ejemplo_kramer.py` | Ejemplo usando los datos de Kramer Corporation del Capítulo 2. |
| `ejemplo_saxton.py` | Validación de razones usando datos de Saxton Company del Capítulo 3. |
| `reporte_kramer.txt` | Reporte de texto generado automáticamente. |
| `reporte_kramer.xlsx` | Reporte en Excel generado automáticamente. |
| `web/` | Aplicación web con Vite + React + TanStack + Express + MongoDB. |

## Requisitos

- Python 3.8 o superior.
- `pandas` y `openpyxl` (solo si deseas exportar a Excel).

## Instalación

```bash
# Crear entorno virtual
python3 -m venv venv

# Activar entorno virtual
source venv/bin/activate

# Instalar dependencias
pip install pandas openpyxl
```

## Uso rápido

```bash
source venv/bin/activate
python3 ejemplo_kramer.py
```

Esto generará:
- `reporte_kramer.txt` — reporte completo en texto plano.
- `reporte_kramer.xlsx` — reporte con hojas separadas para cada análisis.

## Cómo usar con tus propios datos

1. Crea un script Python nuevo (por ejemplo, `mi_empresa.py`).
2. Define dos objetos `Empresa`: uno para el periodo anterior y otro para el periodo actual.
3. Crea un `CalculadorFinanciero` y genera el reporte.

### Ejemplo mínimo

```python
from sistema_financiero import (
    Empresa, EstadoResultados, BalanceGeneral, CalculadorFinanciero,
    generar_reporte_completo, exportar_a_excel
)

# Periodo anterior (solo se requiere el balance general)
empresa_2009 = Empresa(
    nombre="Mi Empresa",
    periodo="2009",
    estado_resultados=EstadoResultados(ventas=0, costo_ventas=0,
        gastos_venta_administracion=0, gastos_depreciacion=0,
        gastos_intereses=0),
    balance_general=BalanceGeneral(
        efectivo=30_000, cuentas_cobrar=170_000, inventario=160_000,
        gastos_pagados_adelantado=30_000, planta_equipo_costo=1_000_000,
        depreciacion_acumulada=550_000, cuentas_pagar=45_000,
        documentos_pagar=100_000, gastos_devengados=35_000,
        bonos_pagar=40_000, capital_preferente=50_000,
        capital_comun=100_000, capital_pagado_exceso=250_000,
        utilidades_retenidas=250_000
    )
)

# Periodo actual
empresa_2010 = Empresa(
    nombre="Mi Empresa",
    periodo="2010",
    estado_resultados=EstadoResultados(
        ventas=2_000_000,
        costo_ventas=1_500_000,
        gastos_venta_administracion=270_000,
        gastos_depreciacion=50_000,
        gastos_intereses=20_000,
        impuestos=49_500,
        dividendos_preferentes=10_500,
        acciones_circulacion=100_000,
    ),
    balance_general=BalanceGeneral(
        efectivo=40_000, valores_negociables=10_000,
        cuentas_cobrar=220_000, provision_cuentas_malas=20_000,
        inventario=180_000, gastos_pagados_adelantado=20_000,
        inversiones_largo_plazo=50_000, planta_equipo_costo=1_100_000,
        depreciacion_acumulada=600_000, cuentas_pagar=80_000,
        documentos_pagar=100_000, gastos_devengados=30_000,
        bonos_pagar=90_000, capital_preferente=50_000,
        capital_comun=100_000, capital_pagado_exceso=250_000,
        utilidades_retenidas=300_000
    ),
    dividendos_comunes=50_000,
)

# Calcular y exportar
calculador = CalculadorFinanciero(empresa_2010, empresa_2009)
print(generar_reporte_completo(calculador))
exportar_a_excel(calculador, "mi_reporte.xlsx")
```

## Funcionalidades incluidas

- **Estado de resultados** con utilidades por acción (EPS).
- **Estado de utilidades retenidas**.
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
- **Exportación a Excel** con hojas separadas.

## Notas importantes

- El libro presenta **13 razones principales**. Este sistema incluye esas 13 más el margen bruto y el margen operativo para llegar a 15.
- El análisis vertical y horizontal no aparece con esos nombres en el libro, pero son técnicas estándar que complementan el análisis de razones.
- Para calcular el flujo de efectivo se requieren los balances de dos periodos consecutivos.

## Aplicación web (`web/`)

La aplicación web está construida con:

- **Frontend:** Vite + React + TypeScript + TanStack Router / Query / Table / Form + Tailwind CSS.
- **Backend:** Express + MongoDB (Mongoose).
- **Cálculos:** TypeScript compartido entre cliente y servidor, validado contra el prototipo Python.

### Requisitos

- Node.js 20+ y npm.
- MongoDB local en `mongodb://localhost:27017` (o definir `MONGODB_URI`).

### Instalación y ejecución

```bash
cd web
npm install

# Iniciar MongoDB local (ejemplo)
mkdir -p data/db
mongod --dbpath data/db --bind_ip 127.0.0.1 --port 27017

# Ejecutar backend y frontend en modo desarrollo
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api

### Scripts útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev:client` | Solo Vite (frontend). |
| `npm run dev:server` | Solo Express con recarga automática. |
| `npm run server` | Ejecutar solo el backend. |
| `npm run build` | Compilar el frontend para producción. |
| `npm run typecheck` | Verificar tipos de TypeScript. |

### Flujo de uso

1. Crear una empresa desde **Empresas**.
2. Dentro de la empresa, crear los periodos contables (año actual y anterior).
3. En la página del periodo, ingresar el **estado de resultados** y el **balance general**.
4. Consultar los reportes calculados: estados, razones, flujo de efectivo, análisis vertical/horizontal, Du Pont y pronósticos.

## Próximas mejoras posibles

- Comparación automática contra benchmarks de industria.
- Gráficos de tendencias.
- Importación desde archivos Excel/CSV.
- Exportación de reportes desde la interfaz web.

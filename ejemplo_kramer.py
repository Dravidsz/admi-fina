"""
Ejemplo práctico con datos de Kramer Corporation
del Capítulo 2 del libro Fundamentos de Administración Financiera.

Este ejemplo reproduce los estados financieros, el flujo de efectivo,
las razones y los análisis vertical/horizontal presentados en el texto.
"""

from sistema_financiero import (
    Empresa,
    EstadoResultados,
    BalanceGeneral,
    CalculadorFinanciero,
    generar_reporte_completo,
    exportar_a_excel,
)


def main():
    # ------------------------------------------------------------------
    # Datos del año 2009 (periodo anterior) — Tabla 2-6 del libro
    # ------------------------------------------------------------------
    balance_2009 = BalanceGeneral(
        efectivo=30_000,
        valores_negociables=10_000,
        cuentas_cobrar=170_000,
        provision_cuentas_malas=0,
        inventario=160_000,
        gastos_pagados_adelantado=30_000,
        inversiones_largo_plazo=20_000,
        planta_equipo_costo=1_000_000,
        depreciacion_acumulada=550_000,
        cuentas_pagar=45_000,
        documentos_pagar=100_000,
        gastos_devengados=35_000,
        bonos_pagar=40_000,
        capital_preferente=50_000,
        capital_comun=100_000,
        capital_pagado_exceso=250_000,
        utilidades_retenidas=250_000,
    )

    empresa_2009 = Empresa(
        nombre="Kramer Corporation",
        periodo="2009",
        estado_resultados=EstadoResultados(
            ventas=0,
            costo_ventas=0,
            gastos_venta_administracion=0,
            gastos_depreciacion=0,
            gastos_intereses=0,
        ),  # No usado para 2009, solo se requiere el balance
        balance_general=balance_2009,
    )

    # ------------------------------------------------------------------
    # Datos del año 2010 (periodo actual) — Tablas 2-1, 2-2 y 2-4
    # ------------------------------------------------------------------
    estado_resultados_2010 = EstadoResultados(
        ventas=2_000_000,
        costo_ventas=1_500_000,
        gastos_venta_administracion=270_000,
        gastos_depreciacion=50_000,
        gastos_intereses=20_000,
        impuestos=49_500,
        dividendos_preferentes=10_500,
        acciones_circulacion=100_000,
    )

    balance_2010 = BalanceGeneral(
        efectivo=40_000,
        valores_negociables=10_000,
        cuentas_cobrar=220_000,
        provision_cuentas_malas=20_000,
        inventario=180_000,
        gastos_pagados_adelantado=20_000,
        inversiones_largo_plazo=50_000,
        planta_equipo_costo=1_100_000,
        depreciacion_acumulada=600_000,
        cuentas_pagar=80_000,
        documentos_pagar=100_000,
        gastos_devengados=30_000,
        bonos_pagar=90_000,
        capital_preferente=50_000,
        capital_comun=100_000,
        capital_pagado_exceso=250_000,
        utilidades_retenidas=300_000,
    )

    empresa_2010 = Empresa(
        nombre="Kramer Corporation",
        periodo="2010",
        estado_resultados=estado_resultados_2010,
        balance_general=balance_2010,
        dividendos_comunes=50_000,
    )

    # ------------------------------------------------------------------
    # Cálculos
    # ------------------------------------------------------------------
    calculador = CalculadorFinanciero(empresa_2010, empresa_2009)

    # Verificar que el balance cuadre
    print(f"Balance general 2010 cuadra: {balance_2010.cuadra}")
    print(f"Diferencia: ${balance_2010.diferencia_cuadre():,.2f}")
    print()

    # Generar reporte completo
    reporte = generar_reporte_completo(calculador)
    print(reporte)

    # Guardar reporte en archivo de texto
    with open("reporte_kramer.txt", "w", encoding="utf-8") as f:
        f.write(reporte)
    print("\nReporte guardado en: reporte_kramer.txt")

    # Exportar a Excel
    try:
        exportar_a_excel(calculador, "reporte_kramer.xlsx")
        print("Reporte Excel guardado en: reporte_kramer.xlsx")
    except ImportError as e:
        print(f"No se pudo exportar a Excel: {e}")


if __name__ == "__main__":
    main()

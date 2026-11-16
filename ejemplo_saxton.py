"""
Ejemplo con datos de Saxton Company del Capítulo 3.
Permite validar las 15 razones financieras contra los valores del libro.
"""

from sistema_financiero import (
    Empresa,
    EstadoResultados,
    BalanceGeneral,
    CalculadorFinanciero,
    generar_reporte_completo,
)


def main():
    estado_resultados = EstadoResultados(
        ventas=4_000_000,
        costo_ventas=3_000_000,
        gastos_venta_administracion=450_000,
        gastos_depreciacion=0,  # No se reporta por separado en el ejemplo del libro
        gastos_intereses=50_000,
        impuestos=100_000,
        dividendos_preferentes=0,
        acciones_circulacion=1,
        perdidas_extraordinarias=200_000,
    )

    balance = BalanceGeneral(
        efectivo=30_000,
        valores_negociables=50_000,
        cuentas_cobrar=350_000,
        provision_cuentas_malas=0,
        inventario=370_000,
        gastos_pagados_adelantado=0,
        inversiones_largo_plazo=0,
        planta_equipo_costo=800_000,
        depreciacion_acumulada=0,
        cuentas_pagar=50_000,
        documentos_pagar=250_000,
        gastos_devengados=0,
        bonos_pagar=300_000,
        capital_preferente=0,
        capital_comun=400_000,
        capital_pagado_exceso=0,
        utilidades_retenidas=600_000,
    )

    empresa = Empresa(
        nombre="Saxton Company",
        periodo="2010",
        estado_resultados=estado_resultados,
        balance_general=balance,
        dividendos_comunes=0,
        arrendamiento=50_000,
    )

    calculador = CalculadorFinanciero(empresa)
    razones = calculador.calcular_razones()

    print("Validación de razones de Saxton Company")
    print("=" * 50)
    esperados = {
        "margen_utilidad_neta": 0.05,
        "rendimiento_activos_roa": 0.125,
        "rendimiento_capital_contable_roe": 0.20,
        "rotacion_cuentas_cobrar": 11.4,
        "periodo_promedio_cobranza": 31.5,
        "rotacion_inventario": 10.8,
        "rotacion_activos_fijos": 5.0,
        "rotacion_activos_totales": 2.5,
        "razon_circulante": 2.67,
        "razon_rapida": 1.43,
        "deuda_total_activos_totales": 0.375,
        "rotacion_interes_ganado": 11.0,
        "cobertura_cargos_fijos": 6.0,
    }

    for clave, esperado in esperados.items():
        obtenido = razones[clave]
        diferencia = abs(obtenido - esperado)
        estado = "OK" if diferencia < 0.05 else "REVISAR"
        print(f"{clave:35s}: obtenido={obtenido:8.4f}  esperado={esperado:8.4f}  [{estado}]")

    print("\n" + generar_reporte_completo(calculador))


if __name__ == "__main__":
    main()

"""
Sistema de Análisis Financiero
Basado en: Fundamentos de Administración Financiera (14ª ed.)
Autores: Block, Hirt y Danielsen

Este módulo permite:
- Construir estados de resultados y balances generales.
- Calcular el estado de flujo de efectivo por el método indirecto.
- Calcular 15 razones financieras.
- Generar análisis vertical y horizontal.
- Realizar análisis Du Pont.
"""

from dataclasses import dataclass, field
from typing import Dict, Optional, Tuple
import json


# ============================================================================
# ESTRUCTURAS DE DATOS
# ============================================================================

@dataclass
class EstadoResultados:
    """Datos de entrada para el estado de resultados."""
    ventas: float
    costo_ventas: float
    gastos_venta_administracion: float
    gastos_depreciacion: float
    gastos_intereses: float
    tasa_impuestos: float = 0.0
    impuestos: Optional[float] = None
    dividendos_preferentes: float = 0.0
    acciones_circulacion: float = 1.0
    perdidas_extraordinarias: float = 0.0  # Positivo = pérdida, negativo = ganancia


@dataclass
class BalanceGeneral:
    """Representa un balance general en un periodo."""
    # Activos circulantes
    efectivo: float
    valores_negociables: float = 0.0
    cuentas_cobrar: float = 0.0
    provision_cuentas_malas: float = 0.0
    inventario: float = 0.0
    gastos_pagados_adelantado: float = 0.0

    # Otros activos
    inversiones_largo_plazo: float = 0.0

    # Activos fijos
    planta_equipo_costo: float = 0.0
    depreciacion_acumulada: float = 0.0

    # Pasivos circulantes
    cuentas_pagar: float = 0.0
    documentos_pagar: float = 0.0
    gastos_devengados: float = 0.0

    # Pasivos a largo plazo
    bonos_pagar: float = 0.0

    # Capital contable
    capital_preferente: float = 0.0
    capital_comun: float = 0.0
    capital_pagado_exceso: float = 0.0
    utilidades_retenidas: float = 0.0

    @property
    def cuentas_cobrar_neto(self) -> float:
        return self.cuentas_cobrar - self.provision_cuentas_malas

    @property
    def activos_circulantes(self) -> float:
        return (
            self.efectivo
            + self.valores_negociables
            + self.cuentas_cobrar_neto
            + self.inventario
            + self.gastos_pagados_adelantado
        )

    @property
    def planta_equipo_neto(self) -> float:
        return self.planta_equipo_costo - self.depreciacion_acumulada

    @property
    def activos_fijos_neto(self) -> float:
        return self.planta_equipo_neto + self.inversiones_largo_plazo

    @property
    def activos_totales(self) -> float:
        return self.activos_circulantes + self.activos_fijos_neto

    @property
    def pasivos_circulantes(self) -> float:
        return self.cuentas_pagar + self.documentos_pagar + self.gastos_devengados

    @property
    def pasivos_totales(self) -> float:
        return self.pasivos_circulantes + self.bonos_pagar

    @property
    def capital_contable_total(self) -> float:
        return (
            self.capital_preferente
            + self.capital_comun
            + self.capital_pagado_exceso
            + self.utilidades_retenidas
        )

    @property
    def pasivo_capital_total(self) -> float:
        return self.pasivos_totales + self.capital_contable_total

    @property
    def cuadra(self) -> bool:
        """Verifica si Activo = Pasivo + Capital."""
        return abs(self.activos_totales - self.pasivo_capital_total) < 1e-6

    def diferencia_cuadre(self) -> float:
        return self.activos_totales - self.pasivo_capital_total


@dataclass
class Empresa:
    """Contiene los datos de una empresa para un periodo."""
    nombre: str
    periodo: str
    estado_resultados: EstadoResultados
    balance_general: BalanceGeneral
    dividendos_comunes: float = 0.0
    arrendamiento: float = 0.0  # Para cobertura de cargos fijos


# ============================================================================
# CÁLCULO DE ESTADOS FINANCIEROS
# ============================================================================

class CalculadorFinanciero:
    def __init__(self, empresa_actual: Empresa, empresa_anterior: Optional[Empresa] = None):
        self.emp = empresa_actual
        self.emp_ant = empresa_anterior
        self.er = empresa_actual.estado_resultados
        self.bg = empresa_actual.balance_general

    def calcular_estado_resultados(self) -> Dict[str, float]:
        """Calcula el estado de resultados completo."""
        utilidad_bruta = self.er.ventas - self.er.costo_ventas
        utilidad_operativa = (
            utilidad_bruta
            - self.er.gastos_venta_administracion
            - self.er.gastos_depreciacion
        )
        utilidad_antes_impuestos = (
            utilidad_operativa - self.er.gastos_intereses - self.er.perdidas_extraordinarias
        )

        if self.er.impuestos is not None:
            impuestos = self.er.impuestos
        else:
            impuestos = utilidad_antes_impuestos * self.er.tasa_impuestos

        utilidad_despues_impuestos = utilidad_antes_impuestos - impuestos
        utilidad_disponible_accionistas_comunes = (
            utilidad_despues_impuestos - self.er.dividendos_preferentes
        )
        utilidad_por_accion = (
            utilidad_disponible_accionistas_comunes / self.er.acciones_circulacion
        )

        return {
            "ventas": self.er.ventas,
            "costo_ventas": self.er.costo_ventas,
            "utilidad_bruta": utilidad_bruta,
            "margen_bruto": utilidad_bruta / self.er.ventas if self.er.ventas else 0,
            "gastos_venta_administracion": self.er.gastos_venta_administracion,
            "gastos_depreciacion": self.er.gastos_depreciacion,
            "utilidad_operativa": utilidad_operativa,
            "margen_operativo": utilidad_operativa / self.er.ventas if self.er.ventas else 0,
            "gastos_intereses": self.er.gastos_intereses,
            "perdidas_extraordinarias": self.er.perdidas_extraordinarias,
            "utilidad_antes_impuestos": utilidad_antes_impuestos,
            "impuestos": impuestos,
            "utilidad_despues_impuestos": utilidad_despues_impuestos,
            "margen_neto": utilidad_despues_impuestos / self.er.ventas if self.er.ventas else 0,
            "dividendos_preferentes": self.er.dividendos_preferentes,
            "utilidad_disponible_accionistas_comunes": utilidad_disponible_accionistas_comunes,
            "acciones_circulacion": self.er.acciones_circulacion,
            "utilidad_por_accion": utilidad_por_accion,
        }

    def calcular_utilidades_retenidas(self) -> Dict[str, float]:
        """Calcula el movimiento de utilidades retenidas.

        Si existe un periodo anterior, se usa su saldo de utilidades retenidas
        como saldo inicial. Si no, se asume que el saldo en el balance actual
        es el saldo inicial del periodo.
        """
        er = self.calcular_estado_resultados()
        if self.emp_ant is not None:
            saldo_inicial = self.emp_ant.balance_general.utilidades_retenidas
        else:
            saldo_inicial = self.bg.utilidades_retenidas
        utilidades_disponibles = er["utilidad_disponible_accionistas_comunes"]
        dividendos_comunes = self.emp.dividendos_comunes
        saldo_final = saldo_inicial + utilidades_disponibles - dividendos_comunes

        return {
            "saldo_inicial": saldo_inicial,
            "utilidades_disponibles": utilidades_disponibles,
            "dividendos_comunes": dividendos_comunes,
            "saldo_final": saldo_final,
        }

    def calcular_flujo_efectivo(self) -> Optional[Dict[str, float]]:
        """Calcula el estado de flujo de efectivo por el método indirecto."""
        if self.emp_ant is None:
            return None

        er = self.calcular_estado_resultados()
        bg_act = self.emp.balance_general
        bg_ant = self.emp_ant.balance_general

        # Cambios en activos circulantes
        delta_cuentas_cobrar = bg_act.cuentas_cobrar_neto - bg_ant.cuentas_cobrar_neto
        delta_inventario = bg_act.inventario - bg_ant.inventario
        delta_gastos_adelantado = (
            bg_act.gastos_pagados_adelantado - bg_ant.gastos_pagados_adelantado
        )

        # Cambios en pasivos circulantes
        delta_cuentas_pagar = bg_act.cuentas_pagar - bg_ant.cuentas_pagar
        delta_gastos_devengados = bg_act.gastos_devengados - bg_ant.gastos_devengados

        # Operación
        utilidad_neta = er["utilidad_despues_impuestos"]
        total_ajustes_operativos = (
            self.er.gastos_depreciacion
            - delta_cuentas_cobrar
            - delta_inventario
            - delta_gastos_adelantado
            + delta_cuentas_pagar
            + delta_gastos_devengados
        )
        flujo_operacion = utilidad_neta + total_ajustes_operativos

        # Inversión
        delta_inversiones = bg_act.inversiones_largo_plazo - bg_ant.inversiones_largo_plazo
        delta_planta_equipo = bg_act.planta_equipo_costo - bg_ant.planta_equipo_costo
        flujo_inversion = -(delta_inversiones + delta_planta_equipo)

        # Financiamiento
        delta_bonos = bg_act.bonos_pagar - bg_ant.bonos_pagar
        flujo_financiamiento = (
            delta_bonos
            - self.er.dividendos_preferentes
            - self.emp.dividendos_comunes
        )

        cambio_efectivo = flujo_operacion + flujo_inversion + flujo_financiamiento

        return {
            "utilidad_neta": utilidad_neta,
            "depreciacion": self.er.gastos_depreciacion,
            "delta_cuentas_cobrar": delta_cuentas_cobrar,
            "delta_inventario": delta_inventario,
            "delta_gastos_adelantado": delta_gastos_adelantado,
            "delta_cuentas_pagar": delta_cuentas_pagar,
            "delta_gastos_devengados": delta_gastos_devengados,
            "total_ajustes_operativos": total_ajustes_operativos,
            "flujo_operacion": flujo_operacion,
            "delta_inversiones": delta_inversiones,
            "delta_planta_equipo": delta_planta_equipo,
            "flujo_inversion": flujo_inversion,
            "delta_bonos": delta_bonos,
            "dividendos_preferentes": self.er.dividendos_preferentes,
            "dividendos_comunes": self.emp.dividendos_comunes,
            "flujo_financiamiento": flujo_financiamiento,
            "cambio_efectivo": cambio_efectivo,
        }

    def calcular_flujo_efectivo_libre(self) -> Optional[float]:
        """FCF = Flujo operación − CAPEX − dividendos necesarios."""
        flujo = self.calcular_flujo_efectivo()
        if flujo is None:
            return None
        capex = abs(flujo["delta_planta_equipo"])
        dividendos = self.er.dividendos_preferentes + self.emp.dividendos_comunes
        return flujo["flujo_operacion"] - capex - dividendos

    def calcular_razones(self) -> Dict[str, float]:
        """Calcula las 15 razones financieras."""
        er = self.calcular_estado_resultados()
        ventas = self.er.ventas

        utilidad_neta = er["utilidad_despues_impuestos"]
        ebit = er["utilidad_operativa"]
        activos_totales = self.bg.activos_totales
        capital_contable = self.bg.capital_contable_total
        deuda_total = self.bg.pasivos_totales
        intereses = self.er.gastos_intereses
        arrendamiento = self.emp.arrendamiento

        # Evitar divisiones por cero
        def safe_div(a, b):
            return a / b if b != 0 else float("inf")

        razones = {
            # Rentabilidad
            "margen_utilidad_bruta": safe_div(er["utilidad_bruta"], ventas),
            "margen_utilidad_operativa": safe_div(ebit, ventas),
            "margen_utilidad_neta": safe_div(utilidad_neta, ventas),
            "rendimiento_activos_roa": safe_div(utilidad_neta, activos_totales),
            "rendimiento_capital_contable_roe": safe_div(utilidad_neta, capital_contable),

            # Uso de activos
            "rotacion_cuentas_cobrar": safe_div(ventas, self.bg.cuentas_cobrar_neto),
            "periodo_promedio_cobranza": safe_div(
                self.bg.cuentas_cobrar_neto, safe_div(ventas, 360)
            ),
            "rotacion_inventario": safe_div(ventas, self.bg.inventario),
            "rotacion_activos_fijos": safe_div(ventas, self.bg.planta_equipo_neto),
            "rotacion_activos_totales": safe_div(ventas, activos_totales),

            # Liquidez
            "razon_circulante": safe_div(self.bg.activos_circulantes, self.bg.pasivos_circulantes),
            "razon_rapida": safe_div(
                self.bg.activos_circulantes - self.bg.inventario, self.bg.pasivos_circulantes
            ),

            # Endeudamiento
            "deuda_total_activos_totales": safe_div(deuda_total, activos_totales),
            "rotacion_interes_ganado": safe_div(ebit, intereses),
            "cobertura_cargos_fijos": safe_div(
                ebit + arrendamiento, intereses + arrendamiento
            ),
        }
        return razones

    def calcular_analisis_vertical_estado_resultados(self) -> Dict[str, float]:
        """Cada partida del estado de resultados como % de ventas."""
        er = self.calcular_estado_resultados()
        ventas = er["ventas"]
        if ventas == 0:
            return {}
        excluir = {
            "acciones_circulacion",
            "utilidad_por_accion",
            "margen_bruto",
            "margen_operativo",
            "margen_neto",
        }
        return {k: v / ventas for k, v in er.items() if k not in excluir}

    def calcular_analisis_vertical_balance(self) -> Tuple[Dict[str, float], Dict[str, float]]:
        """Retorna (activos %, pasivos_capital %) del balance general."""
        total_activos = self.bg.activos_totales
        total_pasivo_capital = self.bg.pasivo_capital_total

        activos = {
            "efectivo": self.bg.efectivo / total_activos,
            "valores_negociables": self.bg.valores_negociables / total_activos,
            "cuentas_cobrar_neto": self.bg.cuentas_cobrar_neto / total_activos,
            "inventario": self.bg.inventario / total_activos,
            "gastos_pagados_adelantado": self.bg.gastos_pagados_adelantado / total_activos,
            "inversiones_largo_plazo": self.bg.inversiones_largo_plazo / total_activos,
            "planta_equipo_neto": self.bg.planta_equipo_neto / total_activos,
        }

        pasivos_capital = {
            "cuentas_pagar": self.bg.cuentas_pagar / total_pasivo_capital,
            "documentos_pagar": self.bg.documentos_pagar / total_pasivo_capital,
            "gastos_devengados": self.bg.gastos_devengados / total_pasivo_capital,
            "bonos_pagar": self.bg.bonos_pagar / total_pasivo_capital,
            "capital_preferente": self.bg.capital_preferente / total_pasivo_capital,
            "capital_comun": self.bg.capital_comun / total_pasivo_capital,
            "capital_pagado_exceso": self.bg.capital_pagado_exceso / total_pasivo_capital,
            "utilidades_retenidas": self.bg.utilidades_retenidas / total_pasivo_capital,
        }
        return activos, pasivos_capital

    def calcular_analisis_horizontal_estado_resultados(self) -> Optional[Dict[str, Dict[str, float]]]:
        """Comparación del estado de resultados entre dos periodos."""
        if self.emp_ant is None:
            return None

        er_act = self.calcular_estado_resultados()
        er_ant = CalculadorFinanciero(self.emp_ant).calcular_estado_resultados()

        campos = [
            "ventas",
            "costo_ventas",
            "utilidad_bruta",
            "gastos_venta_administracion",
            "gastos_depreciacion",
            "utilidad_operativa",
            "gastos_intereses",
            "perdidas_extraordinarias",
            "utilidad_antes_impuestos",
            "impuestos",
            "utilidad_despues_impuestos",
            "utilidad_disponible_accionistas_comunes",
        ]

        resultado = {}
        for nombre in campos:
            actual = er_act.get(nombre, 0)
            anterior = er_ant.get(nombre, 0)
            variacion = actual - anterior
            porcentaje = (variacion / anterior * 100) if anterior != 0 else float("inf")
            resultado[nombre] = {
                "actual": actual,
                "anterior": anterior,
                "variacion": variacion,
                "porcentaje_cambio": porcentaje,
            }
        return resultado

    def calcular_analisis_horizontal_balance(self) -> Optional[Dict[str, Dict[str, float]]]:
        """Comparación del balance general entre dos periodos."""
        if self.emp_ant is None:
            return None

        bg_act = self.emp.balance_general
        bg_ant = self.emp_ant.balance_general

        campos = [
            ("efectivo", bg_act.efectivo, bg_ant.efectivo),
            ("valores_negociables", bg_act.valores_negociables, bg_ant.valores_negociables),
            ("cuentas_cobrar_neto", bg_act.cuentas_cobrar_neto, bg_ant.cuentas_cobrar_neto),
            ("inventario", bg_act.inventario, bg_ant.inventario),
            ("gastos_pagados_adelantado", bg_act.gastos_pagados_adelantado, bg_ant.gastos_pagados_adelantado),
            ("inversiones_largo_plazo", bg_act.inversiones_largo_plazo, bg_ant.inversiones_largo_plazo),
            ("planta_equipo_neto", bg_act.planta_equipo_neto, bg_ant.planta_equipo_neto),
            ("activos_totales", bg_act.activos_totales, bg_ant.activos_totales),
            ("cuentas_pagar", bg_act.cuentas_pagar, bg_ant.cuentas_pagar),
            ("documentos_pagar", bg_act.documentos_pagar, bg_ant.documentos_pagar),
            ("gastos_devengados", bg_act.gastos_devengados, bg_ant.gastos_devengados),
            ("bonos_pagar", bg_act.bonos_pagar, bg_ant.bonos_pagar),
            ("pasivos_totales", bg_act.pasivos_totales, bg_ant.pasivos_totales),
            ("capital_contable_total", bg_act.capital_contable_total, bg_ant.capital_contable_total),
        ]

        resultado = {}
        for nombre, actual, anterior in campos:
            variacion = actual - anterior
            porcentaje = (variacion / anterior * 100) if anterior != 0 else float("inf")
            resultado[nombre] = {
                "actual": actual,
                "anterior": anterior,
                "variacion": variacion,
                "porcentaje_cambio": porcentaje,
            }
        return resultado

    def calcular_dupont(self) -> Dict[str, float]:
        """Descomposición Du Pont del ROE y ROA."""
        razones = self.calcular_razones()
        roa = razones["rendimiento_activos_roa"]
        margen_neto = razones["margen_utilidad_neta"]
        rotacion_activos = razones["rotacion_activos_totales"]
        deuda_activos = razones["deuda_total_activos_totales"]

        roe = roa / (1 - deuda_activos) if deuda_activos != 1 else float("inf")

        return {
            "margen_utilidad_neta": margen_neto,
            "rotacion_activos_totales": rotacion_activos,
            "roa_dupont": margen_neto * rotacion_activos,
            "deuda_total_activos": deuda_activos,
            "roe_dupont": roe,
            "roa_directo": roa,
            "roe_directo": razones["rendimiento_capital_contable_roe"],
        }

    def calcular_valor_libros_accion(self) -> Dict[str, float]:
        """Valor en libros y valor de mercado por acción."""
        er = self.calcular_estado_resultados()
        capital_comun_total = self.bg.capital_comun + self.bg.capital_pagado_exceso + self.bg.utilidades_retenidas
        valor_libros_accion = (
            capital_comun_total / self.er.acciones_circulacion
            if self.er.acciones_circulacion
            else 0
        )
        return {
            "capital_comun_total": capital_comun_total,
            "valor_libros_por_accion": valor_libros_accion,
            "utilidad_por_accion": er["utilidad_por_accion"],
        }

    def pronostico_porcentaje_ventas(
        self,
        ventas_actuales: float,
        ventas_nuevas: float,
        porcentaje_activos_variables: float,
        porcentaje_pasivos_variables: float,
        margen_utilidad: float,
        ratio_pago_dividendos: float,
        plena_capacidad: bool = True,
        porcentaje_activos_fijos: float = 0.0,
    ) -> Dict[str, float]:
        """
        Método del porcentaje de ventas para calcular requerimientos de fondos nuevos (RNF).
        Fórmula del libro: RNF = (A/S)(ΔS) - (L/S)(ΔS) - P(S2)(1 - D)
        """
        delta_s = ventas_nuevas - ventas_actuales
        a_s = porcentaje_activos_variables + (porcentaje_activos_fijos if plena_capacidad else 0)
        l_s = porcentaje_pasivos_variables
        p = margen_utilidad
        s2 = ventas_nuevas
        d = ratio_pago_dividendos

        rnf = (a_s * delta_s) - (l_s * delta_s) - (p * s2 * (1 - d))
        return {
            "ventas_actuales": ventas_actuales,
            "ventas_nuevas": ventas_nuevas,
            "incremento_ventas": delta_s,
            "requerimiento_activos": a_s * delta_s,
            "financiamiento_espontaneo": l_s * delta_s,
            "utilidades_retenidas_adicionales": p * s2 * (1 - d),
            "requerimiento_fondos_nuevos": rnf,
        }


# ============================================================================
# REPORTES
# ============================================================================

def formatear_dinero(valor: float) -> str:
    if valor == float("inf"):
        return "∞"
    return f"{valor:,.2f}"


def formatear_porcentaje(valor: float) -> str:
    if valor == float("inf"):
        return "∞"
    return f"{valor * 100:.2f}%"


def formatear_razon(clave: str, valor: float) -> str:
    """Formatea una razón financiera según su naturaleza."""
    if valor == float("inf"):
        return "∞"
    porcentuales = {
        "margen_utilidad_bruta",
        "margen_utilidad_operativa",
        "margen_utilidad_neta",
        "rendimiento_activos_roa",
        "rendimiento_capital_contable_roe",
        "deuda_total_activos_totales",
    }
    if clave in porcentuales:
        return f"{valor * 100:.2f}%"
    return f"{valor:,.2f}"


def generar_reporte_completo(calculador: CalculadorFinanciero) -> str:
    """Genera un reporte de texto con todos los cálculos."""
    lineas = []
    emp = calculador.emp
    lineas.append(f"REPORTE FINANCIERO: {emp.nombre} — {emp.periodo}")
    lineas.append("=" * 60)

    # Estado de resultados
    lineas.append("\n--- ESTADO DE RESULTADOS ---")
    er = calculador.calcular_estado_resultados()
    for clave, valor in er.items():
        if "margen" in clave:
            lineas.append(f"{clave:45s}: {formatear_porcentaje(valor)}")
        else:
            lineas.append(f"{clave:45s}: {formatear_dinero(valor)}")

    # Utilidades retenidas
    lineas.append("\n--- ESTADO DE UTILIDADES RETENIDAS ---")
    ur = calculador.calcular_utilidades_retenidas()
    for clave, valor in ur.items():
        lineas.append(f"{clave:45s}: {formatear_dinero(valor)}")

    # Balance general
    lineas.append("\n--- BALANCE GENERAL ---")
    bg = calculador.bg
    lineas.append(f"{'Efectivo':45s}: {formatear_dinero(bg.efectivo)}")
    lineas.append(f"{'Valores negociables':45s}: {formatear_dinero(bg.valores_negociables)}")
    lineas.append(f"{'Cuentas por cobrar (neto)':45s}: {formatear_dinero(bg.cuentas_cobrar_neto)}")
    lineas.append(f"{'Inventario':45s}: {formatear_dinero(bg.inventario)}")
    lineas.append(f"{'Gastos pagados por adelantado':45s}: {formatear_dinero(bg.gastos_pagados_adelantado)}")
    lineas.append(f"{'Total activos circulantes':45s}: {formatear_dinero(bg.activos_circulantes)}")
    lineas.append(f"{'Inversiones (largo plazo)':45s}: {formatear_dinero(bg.inversiones_largo_plazo)}")
    lineas.append(f"{'Planta y equipo neto':45s}: {formatear_dinero(bg.planta_equipo_neto)}")
    lineas.append(f"{'TOTAL ACTIVOS':45s}: {formatear_dinero(bg.activos_totales)}")
    lineas.append("")
    lineas.append(f"{'Cuentas por pagar':45s}: {formatear_dinero(bg.cuentas_pagar)}")
    lineas.append(f"{'Documentos por pagar':45s}: {formatear_dinero(bg.documentos_pagar)}")
    lineas.append(f"{'Gastos devengados':45s}: {formatear_dinero(bg.gastos_devengados)}")
    lineas.append(f"{'Total pasivos circulantes':45s}: {formatear_dinero(bg.pasivos_circulantes)}")
    lineas.append(f"{'Bonos por pagar':45s}: {formatear_dinero(bg.bonos_pagar)}")
    lineas.append(f"{'TOTAL PASIVOS':45s}: {formatear_dinero(bg.pasivos_totales)}")
    lineas.append("")
    lineas.append(f"{'Capital preferente':45s}: {formatear_dinero(bg.capital_preferente)}")
    lineas.append(f"{'Capital común':45s}: {formatear_dinero(bg.capital_comun)}")
    lineas.append(f"{'Capital pagado en exceso':45s}: {formatear_dinero(bg.capital_pagado_exceso)}")
    lineas.append(f"{'Utilidades retenidas':45s}: {formatear_dinero(bg.utilidades_retenidas)}")
    lineas.append(f"{'TOTAL CAPITAL CONTABLE':45s}: {formatear_dinero(bg.capital_contable_total)}")
    lineas.append(f"{'TOTAL PASIVO + CAPITAL':45s}: {formatear_dinero(bg.pasivo_capital_total)}")
    lineas.append(f"{'Balance cuadra':45s}: {'SÍ' if bg.cuadra else 'NO'} (diferencia: {formatear_dinero(bg.diferencia_cuadre())})")

    # Flujo de efectivo
    flujo = calculador.calcular_flujo_efectivo()
    if flujo:
        lineas.append("\n--- ESTADO DE FLUJO DE EFECTIVO (método indirecto) ---")
        lineas.append(f"{'Utilidad neta':45s}: {formatear_dinero(flujo['utilidad_neta'])}")
        lineas.append("Ajustes:")
        lineas.append(f"  {'Depreciación':43s}: {formatear_dinero(flujo['depreciacion'])}")
        lineas.append(f"  {'Incremento en cuentas por cobrar':43s}: {formatear_dinero(-flujo['delta_cuentas_cobrar'])}")
        lineas.append(f"  {'Incremento en inventarios':43s}: {formatear_dinero(-flujo['delta_inventario'])}")
        lineas.append(f"  {'Decremento en gastos pagados por adelantado':43s}: {formatear_dinero(-flujo['delta_gastos_adelantado'])}")
        lineas.append(f"  {'Incremento en cuentas por pagar':43s}: {formatear_dinero(flujo['delta_cuentas_pagar'])}")
        lineas.append(f"  {'Decremento en gastos devengados':43s}: {formatear_dinero(flujo['delta_gastos_devengados'])}")
        lineas.append(f"{'Total ajustes':45s}: {formatear_dinero(flujo['total_ajustes_operativos'])}")
        lineas.append(f"{'Flujo neto de actividades de operación':45s}: {formatear_dinero(flujo['flujo_operacion'])}")
        lineas.append(f"{'Flujo neto de actividades de inversión':45s}: {formatear_dinero(flujo['flujo_inversion'])}")
        lineas.append(f"{'Flujo neto de actividades de financiamiento':45s}: {formatear_dinero(flujo['flujo_financiamiento'])}")
        lineas.append(f"{'Incremento (decremento) neto en efectivo':45s}: {formatear_dinero(flujo['cambio_efectivo'])}")

        fcf = calculador.calcular_flujo_efectivo_libre()
        lineas.append(f"\n{'FLUJO DE EFECTIVO LIBRE':45s}: {formatear_dinero(fcf)}")

    # Razones financieras
    lineas.append("\n--- 15 RAZONES FINANCIERAS ---")
    razones = calculador.calcular_razones()
    nombres_razones = {
        "margen_utilidad_bruta": "1. Margen de utilidad bruta",
        "margen_utilidad_operativa": "2. Margen de utilidad operativa",
        "margen_utilidad_neta": "3. Margen de utilidad neta",
        "rendimiento_activos_roa": "4. Rendimiento sobre activos (ROA)",
        "rendimiento_capital_contable_roe": "5. Rendimiento sobre capital contable (ROE)",
        "rotacion_cuentas_cobrar": "6. Rotación de cuentas por cobrar",
        "periodo_promedio_cobranza": "7. Periodo promedio de cobranza (días)",
        "rotacion_inventario": "8. Rotación de inventario",
        "rotacion_activos_fijos": "9. Rotación de activos fijos",
        "rotacion_activos_totales": "10. Rotación de activos totales",
        "razon_circulante": "11. Razón circulante",
        "razon_rapida": "12. Razón rápida",
        "deuda_total_activos_totales": "13. Deuda total / Activos totales",
        "rotacion_interes_ganado": "14. Rotación del interés ganado",
        "cobertura_cargos_fijos": "15. Cobertura de cargos fijos",
    }
    for clave, nombre in nombres_razones.items():
        valor = razones[clave]
        lineas.append(f"{nombre:45s}: {formatear_razon(clave, valor)}")

    # Análisis vertical
    lineas.append("\n--- ANÁLISIS VERTICAL ---")
    lineas.append("Estado de resultados (% de ventas):")
    av_er = calculador.calcular_analisis_vertical_estado_resultados()
    for clave, valor in av_er.items():
        lineas.append(f"  {clave:43s}: {formatear_porcentaje(valor)}")

    av_act, av_pc = calculador.calcular_analisis_vertical_balance()
    lineas.append("\nBalance general — Activos (% de activos totales):")
    for clave, valor in av_act.items():
        lineas.append(f"  {clave:43s}: {formatear_porcentaje(valor)}")
    lineas.append("\nBalance general — Pasivos y capital (% de pasivo + capital):")
    for clave, valor in av_pc.items():
        lineas.append(f"  {clave:43s}: {formatear_porcentaje(valor)}")

    # Análisis horizontal
    ah_er = calculador.calcular_analisis_horizontal_estado_resultados()
    if ah_er:
        lineas.append("\n--- ANÁLISIS HORIZONTAL DEL ESTADO DE RESULTADOS ---")
        lineas.append(f"{'Cuenta':30s} {'Actual':>15s} {'Anterior':>15s} {'Variación':>15s} {'% Cambio':>12s}")
        for clave, datos in ah_er.items():
            lineas.append(
                f"{clave:30s} {formatear_dinero(datos['actual']):>15s} "
                f"{formatear_dinero(datos['anterior']):>15s} {formatear_dinero(datos['variacion']):>15s} "
                f"{datos['porcentaje_cambio']:>11.2f}%"
            )

    ah = calculador.calcular_analisis_horizontal_balance()
    if ah:
        lineas.append("\n--- ANÁLISIS HORIZONTAL DEL BALANCE GENERAL ---")
        lineas.append(f"{'Cuenta':30s} {'Actual':>15s} {'Anterior':>15s} {'Variación':>15s} {'% Cambio':>12s}")
        for clave, datos in ah.items():
            lineas.append(
                f"{clave:30s} {formatear_dinero(datos['actual']):>15s} "
                f"{formatear_dinero(datos['anterior']):>15s} {formatear_dinero(datos['variacion']):>15s} "
                f"{datos['porcentaje_cambio']:>11.2f}%"
            )

    # Du Pont
    lineas.append("\n--- ANÁLISIS DU PONT ---")
    dupont = calculador.calcular_dupont()
    dupont_porcentuales = {
        "margen_utilidad_neta",
        "roa_dupont",
        "deuda_total_activos",
        "roe_dupont",
        "roa_directo",
        "roe_directo",
    }
    for clave, valor in dupont.items():
        if clave in dupont_porcentuales:
            lineas.append(f"{clave:45s}: {formatear_porcentaje(valor)}")
        else:
            lineas.append(f"{clave:45s}: {formatear_dinero(valor)}")

    # Valor en libros
    lineas.append("\n--- VALOR POR ACCIÓN ---")
    vl = calculador.calcular_valor_libros_accion()
    for clave, valor in vl.items():
        lineas.append(f"{clave:45s}: {formatear_dinero(valor)}")

    return "\n".join(lineas)


# ============================================================================
# EXPORTACIÓN A EXCEL (requiere openpyxl)
# ============================================================================

def exportar_a_excel(calculador: CalculadorFinanciero, ruta: str):
    """Exporta los resultados a un archivo Excel con múltiples hojas."""
    try:
        import pandas as pd
    except ImportError:
        raise ImportError("Se requiere pandas para exportar a Excel. Instálalo con: pip install pandas openpyxl")

    with pd.ExcelWriter(ruta, engine="openpyxl") as writer:
        # Estado de resultados
        er = calculador.calcular_estado_resultados()
        df_er = pd.DataFrame(list(er.items()), columns=["Concepto", "Valor"])
        df_er.to_excel(writer, sheet_name="Estado Resultados", index=False)

        # Balance general
        bg = calculador.bg
        datos_bg = {
            "Concepto": [
                "Efectivo", "Valores negociables", "Cuentas por cobrar (neto)",
                "Inventario", "Gastos pagados por adelantado", "Total activos circulantes",
                "Inversiones (largo plazo)", "Planta y equipo neto", "TOTAL ACTIVOS",
                "Cuentas por pagar", "Documentos por pagar", "Gastos devengados",
                "Total pasivos circulantes", "Bonos por pagar", "TOTAL PASIVOS",
                "Capital preferente", "Capital común", "Capital pagado en exceso",
                "Utilidades retenidas", "TOTAL CAPITAL", "TOTAL PASIVO + CAPITAL"
            ],
            "Valor": [
                bg.efectivo, bg.valores_negociables, bg.cuentas_cobrar_neto,
                bg.inventario, bg.gastos_pagados_adelantado, bg.activos_circulantes,
                bg.inversiones_largo_plazo, bg.planta_equipo_neto, bg.activos_totales,
                bg.cuentas_pagar, bg.documentos_pagar, bg.gastos_devengados,
                bg.pasivos_circulantes, bg.bonos_pagar, bg.pasivos_totales,
                bg.capital_preferente, bg.capital_comun, bg.capital_pagado_exceso,
                bg.utilidades_retenidas, bg.capital_contable_total, bg.pasivo_capital_total
            ]
        }
        pd.DataFrame(datos_bg).to_excel(writer, sheet_name="Balance General", index=False)

        # Flujo de efectivo
        flujo = calculador.calcular_flujo_efectivo()
        if flujo:
            df_flujo = pd.DataFrame(list(flujo.items()), columns=["Concepto", "Valor"])
            df_flujo.to_excel(writer, sheet_name="Flujo Efectivo", index=False)

        # Razones
        razones = calculador.calcular_razones()
        df_razones = pd.DataFrame(list(razones.items()), columns=["Razón", "Valor"])
        df_razones.to_excel(writer, sheet_name="Razones Financieras", index=False)

        # Análisis vertical
        av_er = calculador.calcular_analisis_vertical_estado_resultados()
        df_av_er = pd.DataFrame(list(av_er.items()), columns=["Concepto", "% de Ventas"])
        df_av_er.to_excel(writer, sheet_name="Análisis Vertical ER", index=False)

        av_act, av_pc = calculador.calcular_analisis_vertical_balance()
        df_av_act = pd.DataFrame(list(av_act.items()), columns=["Activo", "% del Total"])
        df_av_act.to_excel(writer, sheet_name="Análisis Vertical Activos", index=False)
        df_av_pc = pd.DataFrame(list(av_pc.items()), columns=["Pasivo/Capital", "% del Total"])
        df_av_pc.to_excel(writer, sheet_name="Análisis Vertical Pas Cap", index=False)

        # Análisis horizontal
        ah_er = calculador.calcular_analisis_horizontal_estado_resultados()
        if ah_er:
            df_ah_er = pd.DataFrame.from_dict(ah_er, orient="index")
            df_ah_er.to_excel(writer, sheet_name="Análisis Horizontal ER")

        ah = calculador.calcular_analisis_horizontal_balance()
        if ah:
            df_ah = pd.DataFrame.from_dict(ah, orient="index")
            df_ah.to_excel(writer, sheet_name="Análisis Horizontal BG")

        # Du Pont
        dupont = calculador.calcular_dupont()
        df_dupont = pd.DataFrame(list(dupont.items()), columns=["Concepto", "Valor"])
        df_dupont.to_excel(writer, sheet_name="Du Pont", index=False)


def guardar_datos_json(empresa: Empresa, ruta: str):
    """Guarda los datos de la empresa en un archivo JSON."""
    datos = {
        "nombre": empresa.nombre,
        "periodo": empresa.periodo,
        "dividendos_comunes": empresa.dividendos_comunes,
        "arrendamiento": empresa.arrendamiento,
        "estado_resultados": empresa.estado_resultados.__dict__,
        "balance_general": empresa.balance_general.__dict__,
    }
    with open(ruta, "w", encoding="utf-8") as f:
        json.dump(datos, f, indent=2, ensure_ascii=False)


def cargar_datos_json(ruta: str) -> Empresa:
    """Carga los datos de una empresa desde un archivo JSON."""
    with open(ruta, "r", encoding="utf-8") as f:
        datos = json.load(f)
    return Empresa(
        nombre=datos["nombre"],
        periodo=datos["periodo"],
        estado_resultados=EstadoResultados(**datos["estado_resultados"]),
        balance_general=BalanceGeneral(**datos["balance_general"]),
        dividendos_comunes=datos.get("dividendos_comunes", 0.0),
        arrendamiento=datos.get("arrendamiento", 0.0),
    )

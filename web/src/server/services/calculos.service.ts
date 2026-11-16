import {
  calcularEstadoResultados,
  calcularBalanceGeneral,
  calcularFlujoEfectivo,
  completarFlujoEfectivo,
  calcularFlujoEfectivoLibre,
  calcularRazonesFinancieras,
  calcularAnalisisVertical,
  calcularAnalisisHorizontalItem,
  calcularAnalisisDuPont,
  calcularPronosticoVentas,
} from "@shared/formulas";
import type {
  Periodo,
  AnalisisDuPont,
  AnalisisVertical,
  FlujoEfectivo,
  PronosticoVentas,
  PronosticoVentasInput,
  RazonesFinancieras,
} from "@shared/types";

export function calcularTodoPeriodo(periodo: Periodo) {
  return {
    estadoResultados: calcularEstadoResultados(periodo.estadoResultados),
    balanceGeneral: calcularBalanceGeneral(periodo.balanceGeneral),
  };
}

export function calcularFlujoEfectivoPeriodo(
  periodoActual: Periodo,
  periodoAnterior: Periodo
): { flujo: FlujoEfectivo; flujoLibre: number } {
  const erActual = calcularEstadoResultados(periodoActual.estadoResultados);
  const bgActual = calcularBalanceGeneral(periodoActual.balanceGeneral);
  const bgAnterior = calcularBalanceGeneral(periodoAnterior.balanceGeneral);

  const flujoBase = calcularFlujoEfectivo(erActual, bgActual, bgAnterior);
  const flujo = completarFlujoEfectivo(flujoBase, periodoActual.dividendosComunes);
  const flujoLibre = calcularFlujoEfectivoLibre(
    flujo,
    periodoActual.dividendosComunes + erActual.dividendosPreferentes
  );

  return { flujo, flujoLibre };
}

export function calcularRazonesPeriodo(periodo: Periodo): RazonesFinancieras {
  const er = calcularEstadoResultados(periodo.estadoResultados);
  const bg = calcularBalanceGeneral(periodo.balanceGeneral);
  return calcularRazonesFinancieras(er, bg, periodo.arrendamiento);
}

export function calcularAnalisisVerticalPeriodo(
  periodo: Periodo
): AnalisisVertical {
  const er = calcularEstadoResultados(periodo.estadoResultados);
  const bg = calcularBalanceGeneral(periodo.balanceGeneral);
  return calcularAnalisisVertical(er, bg);
}

export function calcularAnalisisHorizontalBalance(
  actual: ReturnType<typeof calcularBalanceGeneral>,
  anterior: ReturnType<typeof calcularBalanceGeneral>
) {
  const campos: (keyof typeof actual)[] = [
    "efectivo",
    "valoresNegociables",
    "cuentasCobrarNeto",
    "inventario",
    "gastosPagadosAdelantado",
    "inversionesLargoPlazo",
    "plantaEquipoNeto",
    "activosTotales",
    "cuentasPagar",
    "documentosPagar",
    "gastosDevengados",
    "bonosPagar",
    "pasivosTotales",
    "capitalContableTotal",
  ];

  const resultado: Record<string, { actual: number; anterior: number; variacion: number; porcentajeCambio: number }> = {};
  for (const campo of campos) {
    resultado[campo] = calcularAnalisisHorizontalItem(
      actual[campo] as number,
      anterior[campo] as number
    );
  }
  return resultado;
}

export function calcularAnalisisDuPontPeriodo(periodo: Periodo): AnalisisDuPont {
  const razones = calcularRazonesPeriodo(periodo);
  return calcularAnalisisDuPont(razones);
}

export function calcularPronosticoVentasPeriodo(
  periodo: Periodo,
  input: Omit<PronosticoVentasInput, "ventasActuales" | "margenUtilidad">
): PronosticoVentas {
  const er = calcularEstadoResultados(periodo.estadoResultados);
  return calcularPronosticoVentas({
    ...input,
    ventasActuales: er.ventas,
    margenUtilidad: er.margenNeto,
  });
}

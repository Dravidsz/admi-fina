import type {
  EstadoResultadosInput,
  EstadoResultadosCalculado,
  BalanceGeneralInput,
  BalanceGeneralCalculado,
  FlujoEfectivo,
  RazonesFinancieras,
  AnalisisVertical,
  AnalisisHorizontalItem,
  AnalisisDuPont,
  PronosticoVentasInput,
  PronosticoVentas,
} from "./types";

function safeDiv(a: number, b: number): number {
  return b === 0 ? Infinity : a / b;
}

export function calcularEstadoResultados(
  input: EstadoResultadosInput
): EstadoResultadosCalculado {
  const utilidadBruta = input.ventas - input.costoVentas;
  const utilidadOperativa =
    utilidadBruta - input.gastosVentaAdministracion - input.gastosDepreciacion;
  const utilidadAntesImpuestos =
    utilidadOperativa - input.gastosIntereses - (input.perdidasExtraordinarias || 0);

  let impuestos: number;
  if (input.impuestos !== undefined) {
    impuestos = input.impuestos;
  } else if (input.tasaImpuestos !== undefined) {
    impuestos = utilidadAntesImpuestos * input.tasaImpuestos;
  } else {
    impuestos = 0;
  }

  const utilidadNeta = utilidadAntesImpuestos - impuestos;
  const utilidadDisponibleAccionistasComunes =
    utilidadNeta - input.dividendosPreferentes;
  const utilidadPorAccion = safeDiv(
    utilidadDisponibleAccionistasComunes,
    input.accionesCirculacion
  );

  return {
    ...input,
    utilidadBruta,
    margenBruto: safeDiv(utilidadBruta, input.ventas),
    utilidadOperativa,
    margenOperativo: safeDiv(utilidadOperativa, input.ventas),
    utilidadAntesImpuestos,
    utilidadNeta,
    margenNeto: safeDiv(utilidadNeta, input.ventas),
    utilidadDisponibleAccionistasComunes,
    utilidadPorAccion,
  };
}

export function calcularBalanceGeneral(
  input: BalanceGeneralInput
): BalanceGeneralCalculado {
  const cuentasCobrarNeto = input.cuentasCobrar - input.provisionCuentasMalas;
  const activosCirculantes =
    input.efectivo +
    input.valoresNegociables +
    cuentasCobrarNeto +
    input.inventario +
    input.gastosPagadosAdelantado;
  const plantaEquipoNeto = input.plantaEquipoCosto - input.depreciacionAcumulada;
  const activosFijosNeto = plantaEquipoNeto + input.inversionesLargoPlazo;
  const activosTotales = activosCirculantes + activosFijosNeto;

  const pasivosCirculantes =
    input.cuentasPagar + input.documentosPagar + input.gastosDevengados;
  const pasivosTotales = pasivosCirculantes + input.bonosPagar;
  const capitalContableTotal =
    input.capitalPreferente +
    input.capitalComun +
    input.capitalPagadoExceso +
    input.utilidadesRetenidas;
  const pasivoCapitalTotal = pasivosTotales + capitalContableTotal;
  const diferenciaCuadre = activosTotales - pasivoCapitalTotal;

  return {
    ...input,
    cuentasCobrarNeto,
    activosCirculantes,
    plantaEquipoNeto,
    activosFijosNeto,
    activosTotales,
    pasivosCirculantes,
    pasivosTotales,
    capitalContableTotal,
    pasivoCapitalTotal,
    cuadra: Math.abs(diferenciaCuadre) < 0.01,
    diferenciaCuadre,
  };
}

export function calcularFlujoEfectivo(
  erActual: EstadoResultadosCalculado,
  bgActual: BalanceGeneralCalculado,
  bgAnterior: BalanceGeneralCalculado
): FlujoEfectivo {
  const deltaCuentasCobrar = bgActual.cuentasCobrarNeto - bgAnterior.cuentasCobrarNeto;
  const deltaInventario = bgActual.inventario - bgAnterior.inventario;
  const deltaGastosAdelantado =
    bgActual.gastosPagadosAdelantado - bgAnterior.gastosPagadosAdelantado;
  const deltaCuentasPagar = bgActual.cuentasPagar - bgAnterior.cuentasPagar;
  const deltaGastosDevengados =
    bgActual.gastosDevengados - bgAnterior.gastosDevengados;

  const totalAjustesOperativos =
    erActual.gastosDepreciacion -
    deltaCuentasCobrar -
    deltaInventario -
    deltaGastosAdelantado +
    deltaCuentasPagar +
    deltaGastosDevengados;

  const flujoOperacion = erActual.utilidadNeta + totalAjustesOperativos;

  const deltaInversiones =
    bgActual.inversionesLargoPlazo - bgAnterior.inversionesLargoPlazo;
  const deltaPlantaEquipo =
    bgActual.plantaEquipoCosto - bgAnterior.plantaEquipoCosto;
  const flujoInversion = -(deltaInversiones + deltaPlantaEquipo);

  const deltaBonos = bgActual.bonosPagar - bgAnterior.bonosPagar;

  return {
    utilidadNeta: erActual.utilidadNeta,
    depreciacion: erActual.gastosDepreciacion,
    deltaCuentasCobrar,
    deltaInventario,
    deltaGastosAdelantado,
    deltaCuentasPagar,
    deltaGastosDevengados,
    totalAjustesOperativos,
    flujoOperacion,
    deltaInversiones,
    deltaPlantaEquipo,
    flujoInversion,
    deltaBonos,
    dividendosPreferentes: erActual.dividendosPreferentes,
    dividendosComunes: 0,
    flujoFinanciamiento: 0,
    cambioEfectivo: 0,
  };
}

export function completarFlujoEfectivo(
  flujo: FlujoEfectivo,
  dividendosComunes: number
): FlujoEfectivo {
  const flujoFinanciamiento =
    flujo.deltaBonos - flujo.dividendosPreferentes - dividendosComunes;
  const cambioEfectivo =
    flujo.flujoOperacion + flujo.flujoInversion + flujoFinanciamiento;
  return {
    ...flujo,
    dividendosComunes,
    flujoFinanciamiento,
    cambioEfectivo,
  };
}

export function calcularFlujoEfectivoLibre(
  flujo: FlujoEfectivo,
  dividendosTotales: number
): number {
  const capex = Math.abs(flujo.deltaPlantaEquipo);
  return flujo.flujoOperacion - capex - dividendosTotales;
}

export function calcularRazonesFinancieras(
  er: EstadoResultadosCalculado,
  bg: BalanceGeneralCalculado,
  arrendamiento: number
): RazonesFinancieras {
  return {
    margenUtilidadBruta: safeDiv(er.utilidadBruta, er.ventas),
    margenUtilidadOperativa: safeDiv(er.utilidadOperativa, er.ventas),
    margenUtilidadNeta: safeDiv(er.utilidadNeta, er.ventas),
    rendimientoActivosROA: safeDiv(er.utilidadNeta, bg.activosTotales),
    rendimientoCapitalContableROE: safeDiv(er.utilidadNeta, bg.capitalContableTotal),
    rotacionCuentasCobrar: safeDiv(er.ventas, bg.cuentasCobrarNeto),
    periodoPromedioCobranza: safeDiv(
      bg.cuentasCobrarNeto,
      safeDiv(er.ventas, 360)
    ),
    rotacionInventario: safeDiv(er.ventas, bg.inventario),
    rotacionActivosFijos: safeDiv(er.ventas, bg.plantaEquipoNeto),
    rotacionActivosTotales: safeDiv(er.ventas, bg.activosTotales),
    razonCirculante: safeDiv(bg.activosCirculantes, bg.pasivosCirculantes),
    razonRapida: safeDiv(
      bg.activosCirculantes - bg.inventario,
      bg.pasivosCirculantes
    ),
    deudaTotalActivosTotales: safeDiv(bg.pasivosTotales, bg.activosTotales),
    rotacionInteresGanado: safeDiv(er.utilidadOperativa, er.gastosIntereses),
    coberturaCargosFijos: safeDiv(
      er.utilidadOperativa + arrendamiento,
      er.gastosIntereses + arrendamiento
    ),
  };
}

export function calcularAnalisisVertical(
  er: EstadoResultadosCalculado,
  bg: BalanceGeneralCalculado
): AnalisisVertical {
  const ventas = er.ventas || 1;
  const totalActivos = bg.activosTotales || 1;
  const totalPasivoCapital = bg.pasivoCapitalTotal || 1;

  return {
    estadoResultados: {
      ventas: er.ventas / ventas,
      costoVentas: er.costoVentas / ventas,
      utilidadBruta: er.utilidadBruta / ventas,
      gastosVentaAdministracion: er.gastosVentaAdministracion / ventas,
      gastosDepreciacion: er.gastosDepreciacion / ventas,
      utilidadOperativa: er.utilidadOperativa / ventas,
      gastosIntereses: er.gastosIntereses / ventas,
      perdidasExtraordinarias: (er.perdidasExtraordinarias || 0) / ventas,
      utilidadAntesImpuestos: er.utilidadAntesImpuestos / ventas,
      impuestos: (er.impuestos ?? er.utilidadAntesImpuestos * (er.tasaImpuestos || 0)) / ventas,
      utilidadNeta: er.utilidadNeta / ventas,
      dividendosPreferentes: er.dividendosPreferentes / ventas,
      utilidadDisponibleAccionistasComunes:
        er.utilidadDisponibleAccionistasComunes / ventas,
    },
    activos: {
      efectivo: bg.efectivo / totalActivos,
      valoresNegociables: bg.valoresNegociables / totalActivos,
      cuentasCobrarNeto: bg.cuentasCobrarNeto / totalActivos,
      inventario: bg.inventario / totalActivos,
      gastosPagadosAdelantado: bg.gastosPagadosAdelantado / totalActivos,
      inversionesLargoPlazo: bg.inversionesLargoPlazo / totalActivos,
      plantaEquipoNeto: bg.plantaEquipoNeto / totalActivos,
    },
    pasivosCapital: {
      cuentasPagar: bg.cuentasPagar / totalPasivoCapital,
      documentosPagar: bg.documentosPagar / totalPasivoCapital,
      gastosDevengados: bg.gastosDevengados / totalPasivoCapital,
      bonosPagar: bg.bonosPagar / totalPasivoCapital,
      capitalPreferente: bg.capitalPreferente / totalPasivoCapital,
      capitalComun: bg.capitalComun / totalPasivoCapital,
      capitalPagadoExceso: bg.capitalPagadoExceso / totalPasivoCapital,
      utilidadesRetenidas: bg.utilidadesRetenidas / totalPasivoCapital,
    },
  };
}

export function calcularAnalisisHorizontalItem(
  actual: number,
  anterior: number
): AnalisisHorizontalItem {
  const variacion = actual - anterior;
  const porcentajeCambio = anterior === 0 ? Infinity : (variacion / anterior) * 100;
  return { actual, anterior, variacion, porcentajeCambio };
}

export function calcularAnalisisDuPont(
  razones: RazonesFinancieras
): AnalisisDuPont {
  const roaDuPont = razones.margenUtilidadNeta * razones.rotacionActivosTotales;
  const factorDeuda = 1 - razones.deudaTotalActivosTotales;
  const roeDuPont = factorDeuda === 0 ? Infinity : roaDuPont / factorDeuda;

  return {
    margenUtilidadNeta: razones.margenUtilidadNeta,
    rotacionActivosTotales: razones.rotacionActivosTotales,
    roaDuPont,
    deudaTotalActivos: razones.deudaTotalActivosTotales,
    roeDuPont,
    roaDirecto: razones.rendimientoActivosROA,
    roeDirecto: razones.rendimientoCapitalContableROE,
  };
}

export function calcularPronosticoVentas(
  input: PronosticoVentasInput
): PronosticoVentas {
  const deltaS = input.ventasNuevas - input.ventasActuales;
  const a_s =
    input.porcentajeActivosVariables +
    (input.plenaCapacidad ? input.porcentajeActivosFijos || 0 : 0);
  const l_s = input.porcentajePasivosVariables;
  const p = input.margenUtilidad;
  const s2 = input.ventasNuevas;
  const d = input.ratioPagoDividendos;

  const requerimientoActivos = a_s * deltaS;
  const financiamientoEspontaneo = l_s * deltaS;
  const utilidadesRetenidasAdicionales = p * s2 * (1 - d);
  const requerimientoFondosNuevos =
    requerimientoActivos - financiamientoEspontaneo - utilidadesRetenidasAdicionales;

  return {
    ventasActuales: input.ventasActuales,
    ventasNuevas: input.ventasNuevas,
    incrementoVentas: deltaS,
    requerimientoActivos,
    financiamientoEspontaneo,
    utilidadesRetenidasAdicionales,
    requerimientoFondosNuevos,
  };
}

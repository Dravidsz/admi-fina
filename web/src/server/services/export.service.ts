import ExcelJS from "exceljs";
import type { Periodo, AnalisisHorizontalItem } from "@shared/types";
import {
  calcularEstadoResultados,
  calcularBalanceGeneral,
  calcularRazonesFinancieras,
  calcularFlujoEfectivo,
  completarFlujoEfectivo,
  calcularFlujoEfectivoLibre,
  calcularAnalisisVertical,
  calcularAnalisisHorizontalItem,
  calcularAnalisisDuPont,
} from "@shared/formulas";
import * as periodoService from "@server/services/periodo.service";

function addHeaderRow(ws: ExcelJS.Worksheet, values: (string | number)[]) {
  const row = ws.addRow(values);
  row.font = { bold: true };
  row.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE2E8F0" },
  };
}

function fmtPct(value: number): string {
  if (!isFinite(value)) return "N/A";
  return `${(value * 100).toFixed(2)}%`;
}

function fmtNum(value: number): string {
  if (!isFinite(value)) return "N/A";
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export async function exportarPeriodoExcel(periodoId: string): Promise<Buffer> {
  const periodo = await periodoService.getPeriodoById(periodoId);
  if (!periodo) {
    throw new Error("Periodo no encontrado");
  }

  const er = calcularEstadoResultados(periodo.estadoResultados);
  const bg = calcularBalanceGeneral(periodo.balanceGeneral);
  const razones = calcularRazonesFinancieras(er, bg, periodo.arrendamiento);
  const duPont = calcularAnalisisDuPont(razones);
  const vertical = calcularAnalisisVertical(er, bg);

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Sistema de Análisis Financiero";
  workbook.created = new Date();

  // 1. Estado de resultados
  const wsER = workbook.addWorksheet("Estado de Resultados");
  addHeaderRow(wsER, ["Concepto", "Valor"]);
  wsER.addRows([
    ["Ventas", er.ventas],
    ["Costo de ventas", er.costoVentas],
    ["Utilidad bruta", er.utilidadBruta],
    ["Margen bruto", fmtPct(er.margenBruto)],
    ["Gastos de venta y administración", er.gastosVentaAdministracion],
    ["Depreciación", er.gastosDepreciacion],
    ["Utilidad operativa (EBIT)", er.utilidadOperativa],
    ["Margen operativo", fmtPct(er.margenOperativo)],
    ["Gastos por intereses", er.gastosIntereses],
    ["Pérdidas extraordinarias", er.perdidasExtraordinarias || 0],
    ["Utilidad antes de impuestos", er.utilidadAntesImpuestos],
    ["Impuestos", er.impuestos ?? 0],
    ["Utilidad neta", er.utilidadNeta],
    ["Margen neto", fmtPct(er.margenNeto)],
    ["Dividendos preferentes", er.dividendosPreferentes],
    ["Utilidad disponible accionistas comunes", er.utilidadDisponibleAccionistasComunes],
    ["Acciones en circulación", er.accionesCirculacion],
    ["Utilidad por acción (EPS)", fmtNum(er.utilidadPorAccion)],
  ]);
  wsER.columns = [{ width: 45 }, { width: 20 }];

  // 2. Balance general
  const wsBG = workbook.addWorksheet("Balance General");
  addHeaderRow(wsBG, ["Concepto", "Valor"]);
  wsBG.addRows([
    ["Efectivo", bg.efectivo],
    ["Valores negociables", bg.valoresNegociables],
    ["Cuentas por cobrar", bg.cuentasCobrar],
    ["Provisión cuentas malas", bg.provisionCuentasMalas],
    ["Cuentas por cobrar neto", bg.cuentasCobrarNeto],
    ["Inventario", bg.inventario],
    ["Gastos pagados por anticipado", bg.gastosPagadosAdelantado],
    ["Total activos circulantes", bg.activosCirculantes],
    ["Inversiones a largo plazo", bg.inversionesLargoPlazo],
    ["Planta y equipo (costo)", bg.plantaEquipoCosto],
    ["Depreciación acumulada", bg.depreciacionAcumulada],
    ["Planta y equipo neto", bg.plantaEquipoNeto],
    ["Total activos", bg.activosTotales],
    ["", ""],
    ["Cuentas por pagar", bg.cuentasPagar],
    ["Documentos por pagar", bg.documentosPagar],
    ["Gastos devengados", bg.gastosDevengados],
    ["Total pasivos circulantes", bg.pasivosCirculantes],
    ["Bonos por pagar", bg.bonosPagar],
    ["Total pasivos", bg.pasivosTotales],
    ["Capital preferente", bg.capitalPreferente],
    ["Capital común", bg.capitalComun],
    ["Capital pagado en exceso", bg.capitalPagadoExceso],
    ["Utilidades retenidas", bg.utilidadesRetenidas],
    ["Total capital contable", bg.capitalContableTotal],
    ["Pasivo + capital", bg.pasivoCapitalTotal],
    ["¿Cuadra?", bg.cuadra ? "Sí" : "No"],
    ["Diferencia de cuadre", bg.diferenciaCuadre],
  ]);
  wsBG.columns = [{ width: 45 }, { width: 20 }];

  // 3. Razones financieras
  const wsRazones = workbook.addWorksheet("Razones Financieras");
  addHeaderRow(wsRazones, ["Razón", "Valor"]);
  wsRazones.addRows([
    ["Margen de utilidad bruta", fmtPct(razones.margenUtilidadBruta)],
    ["Margen de utilidad operativa", fmtPct(razones.margenUtilidadOperativa)],
    ["Margen de utilidad neta", fmtPct(razones.margenUtilidadNeta)],
    ["Rendimiento sobre activos (ROA)", fmtPct(razones.rendimientoActivosROA)],
    ["Rendimiento sobre capital contable (ROE)", fmtPct(razones.rendimientoCapitalContableROE)],
    ["Rotación de cuentas por cobrar", fmtNum(razones.rotacionCuentasCobrar)],
    ["Periodo promedio de cobranza (días)", fmtNum(razones.periodoPromedioCobranza)],
    ["Rotación de inventario", fmtNum(razones.rotacionInventario)],
    ["Rotación de activos fijos", fmtNum(razones.rotacionActivosFijos)],
    ["Rotación de activos totales", fmtNum(razones.rotacionActivosTotales)],
    ["Razón circulante", fmtNum(razones.razonCirculante)],
    ["Razón rápida", fmtNum(razones.razonRapida)],
    ["Deuda total / Activos totales", fmtPct(razones.deudaTotalActivosTotales)],
    ["Rotación del interés ganado", fmtNum(razones.rotacionInteresGanado)],
    ["Cobertura de cargos fijos", fmtNum(razones.coberturaCargosFijos)],
  ]);
  wsRazones.columns = [{ width: 50 }, { width: 20 }];

  // 4. Flujo de efectivo
  const wsFlujo = workbook.addWorksheet("Flujo de Efectivo");
  const anterior = await periodoService.getPeriodoAnterior(periodo.empresaId, periodo.anio);
  if (anterior) {
    const bgAnterior = calcularBalanceGeneral(anterior.balanceGeneral);
    const flujoBase = calcularFlujoEfectivo(er, bg, bgAnterior);
    const flujo = completarFlujoEfectivo(flujoBase, periodo.dividendosComunes);
    const flujoLibre = calcularFlujoEfectivoLibre(
      flujo,
      periodo.dividendosComunes + er.dividendosPreferentes
    );

    addHeaderRow(wsFlujo, ["Concepto", "Valor"]);
    wsFlujo.addRows([
      ["Utilidad neta", flujo.utilidadNeta],
      ["Depreciación", flujo.depreciacion],
      ["Δ Cuentas por cobrar", flujo.deltaCuentasCobrar],
      ["Δ Inventario", flujo.deltaInventario],
      ["Δ Gastos anticipados", flujo.deltaGastosAdelantado],
      ["Δ Cuentas por pagar", flujo.deltaCuentasPagar],
      ["Δ Gastos devengados", flujo.deltaGastosDevengados],
      ["Total ajustes operativos", flujo.totalAjustesOperativos],
      ["Flujo de operación", flujo.flujoOperacion],
      ["", ""],
      ["Δ Inversiones a largo plazo", flujo.deltaInversiones],
      ["Δ Planta y equipo", flujo.deltaPlantaEquipo],
      ["Flujo de inversión", flujo.flujoInversion],
      ["", ""],
      ["Δ Bonos", flujo.deltaBonos],
      ["Dividendos preferentes", flujo.dividendosPreferentes],
      ["Dividendos comunes", flujo.dividendosComunes],
      ["Flujo de financiamiento", flujo.flujoFinanciamiento],
      ["", ""],
      ["Cambio en efectivo", flujo.cambioEfectivo],
      ["Flujo de efectivo libre (FCF)", flujoLibre],
    ]);
  } else {
    wsFlujo.addRow([
      "No se encontró un periodo anterior. El flujo de efectivo requiere dos periodos consecutivos.",
    ]);
  }
  wsFlujo.columns = [{ width: 45 }, { width: 20 }];

  // 5. Análisis vertical
  const wsVertical = workbook.addWorksheet("Análisis Vertical");
  addHeaderRow(wsVertical, ["Estado de Resultados", "% de ventas"]);
  Object.entries(vertical.estadoResultados).forEach(([key, value]) => {
    wsVertical.addRow([key, fmtPct(value)]);
  });
  wsVertical.addRow(["", ""]);
  addHeaderRow(wsVertical, ["Activos", "% de activos totales"]);
  Object.entries(vertical.activos).forEach(([key, value]) => {
    wsVertical.addRow([key, fmtPct(value)]);
  });
  wsVertical.addRow(["", ""]);
  addHeaderRow(wsVertical, ["Pasivo + Capital", "% de pasivo + capital"]);
  Object.entries(vertical.pasivosCapital).forEach(([key, value]) => {
    wsVertical.addRow([key, fmtPct(value)]);
  });
  wsVertical.columns = [{ width: 45 }, { width: 20 }];

  // 6. Análisis horizontal
  const wsHorizontal = workbook.addWorksheet("Análisis Horizontal");
  if (anterior) {
    const bgAnterior = calcularBalanceGeneral(anterior.balanceGeneral);
    const campos: (keyof typeof bg)[] = [
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

    addHeaderRow(wsHorizontal, ["Cuenta", "Actual", "Anterior", "Variación", "% Cambio"]);
    campos.forEach((campo) => {
      const item = calcularAnalisisHorizontalItem(
        bg[campo] as number,
        bgAnterior[campo] as number
      );
      wsHorizontal.addRow([
        campo,
        item.actual,
        item.anterior,
        item.variacion,
        fmtNum(item.porcentajeCambio) + "%",
      ]);
    });
    wsHorizontal.columns = [{ width: 35 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 15 }];
  } else {
    wsHorizontal.addRow([
      "No se encontró un periodo anterior. El análisis horizontal requiere dos periodos consecutivos.",
    ]);
  }

  // 7. Du Pont
  const wsDuPont = workbook.addWorksheet("Du Pont");
  addHeaderRow(wsDuPont, ["Concepto", "Valor"]);
  wsDuPont.addRows([
    ["Margen de utilidad neta", fmtPct(duPont.margenUtilidadNeta)],
    ["Rotación de activos totales", fmtNum(duPont.rotacionActivosTotales)],
    ["ROA (Du Pont)", fmtPct(duPont.roaDuPont)],
    ["Deuda total / Activos totales", fmtPct(duPont.deudaTotalActivos)],
    ["Factor de apalancamiento", fmtNum(duPont.deudaTotalActivos === 1 ? Infinity : 1 / (1 - duPont.deudaTotalActivos))],
    ["ROE (Du Pont)", fmtPct(duPont.roeDuPont)],
    ["ROA directo", fmtPct(duPont.roaDirecto)],
    ["ROE directo", fmtPct(duPont.roeDirecto)],
  ]);
  wsDuPont.columns = [{ width: 45 }, { width: 20 }];

  return Buffer.from(await workbook.xlsx.writeBuffer());
}

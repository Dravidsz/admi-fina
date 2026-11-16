/**
 * Tipos compartidos entre cliente y servidor.
 * Basado en Fundamentos de Administración Financiera - Block, Hirt, Danielsen.
 */

export interface EstadoResultadosInput {
  ventas: number;
  costoVentas: number;
  gastosVentaAdministracion: number;
  gastosDepreciacion: number;
  gastosIntereses: number;
  impuestos?: number;
  tasaImpuestos?: number;
  dividendosPreferentes: number;
  accionesCirculacion: number;
  perdidasExtraordinarias?: number;
}

export interface BalanceGeneralInput {
  efectivo: number;
  valoresNegociables: number;
  cuentasCobrar: number;
  provisionCuentasMalas: number;
  inventario: number;
  gastosPagadosAdelantado: number;
  inversionesLargoPlazo: number;
  plantaEquipoCosto: number;
  depreciacionAcumulada: number;
  cuentasPagar: number;
  documentosPagar: number;
  gastosDevengados: number;
  bonosPagar: number;
  capitalPreferente: number;
  capitalComun: number;
  capitalPagadoExceso: number;
  utilidadesRetenidas: number;
}

export interface EstadoResultadosCalculado extends EstadoResultadosInput {
  utilidadBruta: number;
  margenBruto: number;
  utilidadOperativa: number;
  margenOperativo: number;
  utilidadAntesImpuestos: number;
  utilidadNeta: number;
  margenNeto: number;
  utilidadDisponibleAccionistasComunes: number;
  utilidadPorAccion: number;
}

export interface BalanceGeneralCalculado extends BalanceGeneralInput {
  cuentasCobrarNeto: number;
  activosCirculantes: number;
  plantaEquipoNeto: number;
  activosFijosNeto: number;
  activosTotales: number;
  pasivosCirculantes: number;
  pasivosTotales: number;
  capitalContableTotal: number;
  pasivoCapitalTotal: number;
  cuadra: boolean;
  diferenciaCuadre: number;
}

export interface PeriodoInput {
  empresaId: string;
  anio: number;
  estadoResultados: EstadoResultadosInput;
  balanceGeneral: BalanceGeneralInput;
  dividendosComunes: number;
  arrendamiento: number;
}

export interface Periodo extends PeriodoInput {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Empresa {
  _id: string;
  nombre: string;
  descripcion?: string;
  industria?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FlujoEfectivo {
  utilidadNeta: number;
  depreciacion: number;
  deltaCuentasCobrar: number;
  deltaInventario: number;
  deltaGastosAdelantado: number;
  deltaCuentasPagar: number;
  deltaGastosDevengados: number;
  totalAjustesOperativos: number;
  flujoOperacion: number;
  deltaInversiones: number;
  deltaPlantaEquipo: number;
  flujoInversion: number;
  deltaBonos: number;
  dividendosPreferentes: number;
  dividendosComunes: number;
  flujoFinanciamiento: number;
  cambioEfectivo: number;
}

export interface RazonesFinancieras {
  margenUtilidadBruta: number;
  margenUtilidadOperativa: number;
  margenUtilidadNeta: number;
  rendimientoActivosROA: number;
  rendimientoCapitalContableROE: number;
  rotacionCuentasCobrar: number;
  periodoPromedioCobranza: number;
  rotacionInventario: number;
  rotacionActivosFijos: number;
  rotacionActivosTotales: number;
  razonCirculante: number;
  razonRapida: number;
  deudaTotalActivosTotales: number;
  rotacionInteresGanado: number;
  coberturaCargosFijos: number;
}

export interface AnalisisVertical {
  estadoResultados: Record<string, number>;
  activos: Record<string, number>;
  pasivosCapital: Record<string, number>;
}

export interface AnalisisHorizontalItem {
  actual: number;
  anterior: number;
  variacion: number;
  porcentajeCambio: number;
}

export interface AnalisisDuPont {
  margenUtilidadNeta: number;
  rotacionActivosTotales: number;
  roaDuPont: number;
  deudaTotalActivos: number;
  roeDuPont: number;
  roaDirecto: number;
  roeDirecto: number;
}

export interface PronosticoVentasInput {
  ventasActuales: number;
  ventasNuevas: number;
  porcentajeActivosVariables: number;
  porcentajePasivosVariables: number;
  margenUtilidad: number;
  ratioPagoDividendos: number;
  plenaCapacidad: boolean;
  porcentajeActivosFijos?: number;
}

export interface PronosticoVentas {
  ventasActuales: number;
  ventasNuevas: number;
  incrementoVentas: number;
  requerimientoActivos: number;
  financiamientoEspontaneo: number;
  utilidadesRetenidasAdicionales: number;
  requerimientoFondosNuevos: number;
}

import { Schema, model, type Types } from "mongoose";
import type { EstadoResultadosInput, BalanceGeneralInput } from "@shared/types";

export interface IPeriodo {
  _id: Types.ObjectId;
  empresaId: Types.ObjectId;
  anio: number;
  estadoResultados: EstadoResultadosInput;
  balanceGeneral: BalanceGeneralInput;
  dividendosComunes: number;
  arrendamiento: number;
  createdAt: Date;
  updatedAt: Date;
}

const EstadoResultadosSchema = new Schema<EstadoResultadosInput>({
  ventas: { type: Number, required: true },
  costoVentas: { type: Number, required: true },
  gastosVentaAdministracion: { type: Number, required: true },
  gastosDepreciacion: { type: Number, required: true },
  gastosIntereses: { type: Number, required: true },
  impuestos: { type: Number },
  tasaImpuestos: { type: Number },
  dividendosPreferentes: { type: Number, required: true },
  accionesCirculacion: { type: Number, required: true },
  perdidasExtraordinarias: { type: Number, default: 0 },
});

const BalanceGeneralSchema = new Schema<BalanceGeneralInput>({
  efectivo: { type: Number, required: true },
  valoresNegociables: { type: Number, default: 0 },
  cuentasCobrar: { type: Number, default: 0 },
  provisionCuentasMalas: { type: Number, default: 0 },
  inventario: { type: Number, default: 0 },
  gastosPagadosAdelantado: { type: Number, default: 0 },
  inversionesLargoPlazo: { type: Number, default: 0 },
  plantaEquipoCosto: { type: Number, required: true },
  depreciacionAcumulada: { type: Number, default: 0 },
  cuentasPagar: { type: Number, default: 0 },
  documentosPagar: { type: Number, default: 0 },
  gastosDevengados: { type: Number, default: 0 },
  bonosPagar: { type: Number, default: 0 },
  capitalPreferente: { type: Number, default: 0 },
  capitalComun: { type: Number, default: 0 },
  capitalPagadoExceso: { type: Number, default: 0 },
  utilidadesRetenidas: { type: Number, required: true },
});

const PeriodoSchema = new Schema<IPeriodo>(
  {
    empresaId: { type: Schema.Types.ObjectId, ref: "Empresa", required: true },
    anio: { type: Number, required: true },
    estadoResultados: { type: EstadoResultadosSchema, required: true },
    balanceGeneral: { type: BalanceGeneralSchema, required: true },
    dividendosComunes: { type: Number, default: 0 },
    arrendamiento: { type: Number, default: 0 },
  },
  { timestamps: true }
);

PeriodoSchema.index({ empresaId: 1, anio: 1 }, { unique: true });

export const PeriodoModel = model<IPeriodo>("Periodo", PeriodoSchema);

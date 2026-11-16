import { PeriodoModel, type IPeriodo } from "@server/models/Periodo";
import type { Periodo, PeriodoInput } from "@shared/types";

function toPeriodo(doc: IPeriodo | Record<string, unknown>): Periodo {
  const obj = (doc as { toObject?: () => IPeriodo }).toObject
    ? (doc as { toObject: () => IPeriodo }).toObject()
    : (doc as IPeriodo);

  return {
    _id: obj._id.toString(),
    empresaId: obj.empresaId.toString(),
    anio: obj.anio,
    estadoResultados: obj.estadoResultados,
    balanceGeneral: obj.balanceGeneral,
    dividendosComunes: obj.dividendosComunes,
    arrendamiento: obj.arrendamiento,
    createdAt: obj.createdAt.toISOString(),
    updatedAt: obj.updatedAt.toISOString(),
  };
}

export async function getPeriodosByEmpresa(empresaId: string): Promise<Periodo[]> {
  const docs = await PeriodoModel.find({ empresaId })
    .sort({ anio: 1 })
    .lean()
    .exec();
  return docs.map(toPeriodo);
}

export async function getPeriodoById(id: string): Promise<Periodo | null> {
  const doc = await PeriodoModel.findById(id).lean().exec();
  return doc ? toPeriodo(doc as IPeriodo) : null;
}

export async function getPeriodoAnterior(
  empresaId: string,
  anio: number
): Promise<Periodo | null> {
  const doc = await PeriodoModel.findOne({ empresaId, anio: { $lt: anio } })
    .sort({ anio: -1 })
    .lean()
    .exec();
  return doc ? toPeriodo(doc as IPeriodo) : null;
}

export async function crearPeriodo(data: PeriodoInput): Promise<Periodo> {
  const doc = await PeriodoModel.create(data);
  return toPeriodo(doc);
}

export async function actualizarPeriodo(
  id: string,
  data: Partial<PeriodoInput>
): Promise<Periodo | null> {
  const doc = await PeriodoModel.findByIdAndUpdate(id, data, { new: true }).exec();
  return doc ? toPeriodo(doc) : null;
}

export async function eliminarPeriodo(id: string): Promise<boolean> {
  const result = await PeriodoModel.findByIdAndDelete(id).exec();
  return result !== null;
}

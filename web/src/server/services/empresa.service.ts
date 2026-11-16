import { EmpresaModel, type IEmpresa } from "@server/models/Empresa";
import type { Empresa } from "@shared/types";

function toEmpresa(doc: IEmpresa): Empresa {
  return {
    _id: doc._id.toString(),
    nombre: doc.nombre,
    descripcion: doc.descripcion,
    industria: doc.industria,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function getEmpresas(): Promise<Empresa[]> {
  const docs = await EmpresaModel.find().sort({ nombre: 1 }).exec();
  return docs.map(toEmpresa);
}

export async function getEmpresaById(id: string): Promise<Empresa | null> {
  const doc = await EmpresaModel.findById(id).exec();
  return doc ? toEmpresa(doc) : null;
}

export async function crearEmpresa(
  data: Pick<Empresa, "nombre" | "descripcion" | "industria">
): Promise<Empresa> {
  const doc = await EmpresaModel.create(data);
  return toEmpresa(doc);
}

export async function actualizarEmpresa(
  id: string,
  data: Partial<Pick<Empresa, "nombre" | "descripcion" | "industria">>
): Promise<Empresa | null> {
  const doc = await EmpresaModel.findByIdAndUpdate(id, data, { new: true }).exec();
  return doc ? toEmpresa(doc) : null;
}

export async function eliminarEmpresa(id: string): Promise<boolean> {
  const result = await EmpresaModel.findByIdAndDelete(id).exec();
  return result !== null;
}

import { Schema, model, type Types } from "mongoose";

export interface IEmpresa {
  _id: Types.ObjectId;
  nombre: string;
  descripcion?: string;
  industria?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmpresaSchema = new Schema<IEmpresa>(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String },
    industria: { type: String },
  },
  { timestamps: true }
);

export const EmpresaModel = model<IEmpresa>("Empresa", EmpresaSchema);

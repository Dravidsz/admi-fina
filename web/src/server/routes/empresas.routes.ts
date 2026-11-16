import { Router } from "express";
import { z } from "zod";
import * as empresaService from "@server/services/empresa.service";

const router = Router();

const EmpresaSchema = z.object({
  nombre: z.string().min(1),
  descripcion: z.string().optional(),
  industria: z.string().optional(),
});

router.get("/", async (_req, res, next) => {
  try {
    const empresas = await empresaService.getEmpresas();
    res.json(empresas);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const empresa = await empresaService.getEmpresaById(req.params.id);
    if (!empresa) {
      res.status(404).json({ error: "Empresa no encontrada" });
      return;
    }
    res.json(empresa);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const data = EmpresaSchema.parse(req.body);
    const empresa = await empresaService.crearEmpresa(data);
    res.status(201).json(empresa);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const data = EmpresaSchema.partial().parse(req.body);
    const empresa = await empresaService.actualizarEmpresa(req.params.id, data);
    if (!empresa) {
      res.status(404).json({ error: "Empresa no encontrada" });
      return;
    }
    res.json(empresa);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const eliminado = await empresaService.eliminarEmpresa(req.params.id);
    if (!eliminado) {
      res.status(404).json({ error: "Empresa no encontrada" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;

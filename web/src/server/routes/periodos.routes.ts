import { Router } from "express";
import { z } from "zod";
import * as periodoService from "@server/services/periodo.service";

const router = Router({ mergeParams: true });

const EstadoResultadosInputSchema = z.object({
  ventas: z.number().min(0),
  costoVentas: z.number().min(0),
  gastosVentaAdministracion: z.number().min(0),
  gastosDepreciacion: z.number().min(0),
  gastosIntereses: z.number().min(0),
  impuestos: z.number().min(0).optional(),
  tasaImpuestos: z.number().min(0).max(1).optional(),
  dividendosPreferentes: z.number().min(0),
  accionesCirculacion: z.number().min(0),
  perdidasExtraordinarias: z.number().min(0).optional(),
});

const BalanceGeneralInputSchema = z.object({
  efectivo: z.number().min(0),
  valoresNegociables: z.number().min(0).default(0),
  cuentasCobrar: z.number().min(0).default(0),
  provisionCuentasMalas: z.number().min(0).default(0),
  inventario: z.number().min(0).default(0),
  gastosPagadosAdelantado: z.number().min(0).default(0),
  inversionesLargoPlazo: z.number().min(0).default(0),
  plantaEquipoCosto: z.number().min(0),
  depreciacionAcumulada: z.number().min(0).default(0),
  cuentasPagar: z.number().min(0).default(0),
  documentosPagar: z.number().min(0).default(0),
  gastosDevengados: z.number().min(0).default(0),
  bonosPagar: z.number().min(0).default(0),
  capitalPreferente: z.number().min(0).default(0),
  capitalComun: z.number().min(0).default(0),
  capitalPagadoExceso: z.number().min(0).default(0),
  utilidadesRetenidas: z.number().min(0),
});

const PeriodoInputSchema = z.object({
  empresaId: z.string(),
  anio: z.number().int(),
  estadoResultados: EstadoResultadosInputSchema,
  balanceGeneral: BalanceGeneralInputSchema,
  dividendosComunes: z.number().min(0).default(0),
  arrendamiento: z.number().min(0).default(0),
});

router.get("/", async (req, res, next) => {
  try {
    const { empresaId } = req.params as { empresaId: string };
    const periodos = await periodoService.getPeriodosByEmpresa(empresaId);
    res.json(periodos);
  } catch (error) {
    next(error);
  }
});

router.get("/:periodoId", async (req, res, next) => {
  try {
    const periodo = await periodoService.getPeriodoById(req.params.periodoId);
    if (!periodo) {
      res.status(404).json({ error: "Periodo no encontrado" });
      return;
    }
    res.json(periodo);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { empresaId } = req.params as { empresaId: string };
    const data = PeriodoInputSchema.parse({
      ...req.body,
      empresaId,
    });
    const periodo = await periodoService.crearPeriodo(data);
    res.status(201).json(periodo);
  } catch (error) {
    next(error);
  }
});

router.put("/:periodoId", async (req, res, next) => {
  try {
    const data = PeriodoInputSchema.partial().parse(req.body);
    const periodo = await periodoService.actualizarPeriodo(req.params.periodoId, data);
    if (!periodo) {
      res.status(404).json({ error: "Periodo no encontrado" });
      return;
    }
    res.json(periodo);
  } catch (error) {
    next(error);
  }
});

router.delete("/:periodoId", async (req, res, next) => {
  try {
    const eliminado = await periodoService.eliminarPeriodo(req.params.periodoId);
    if (!eliminado) {
      res.status(404).json({ error: "Periodo no encontrado" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;

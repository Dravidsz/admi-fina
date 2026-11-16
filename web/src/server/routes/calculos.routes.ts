import { Router } from "express";
import { z } from "zod";
import * as periodoService from "@server/services/periodo.service";
import * as calculosService from "@server/services/calculos.service";
import { calcularBalanceGeneral } from "@shared/formulas";

const router = Router();

router.get("/estados/:periodoId", async (req, res, next) => {
  try {
    const periodo = await periodoService.getPeriodoById(req.params.periodoId);
    if (!periodo) {
      res.status(404).json({ error: "Periodo no encontrado" });
      return;
    }
    res.json(calculosService.calcularTodoPeriodo(periodo));
  } catch (error) {
    next(error);
  }
});

router.get("/flujo-efectivo/:periodoId", async (req, res, next) => {
  try {
    const periodo = await periodoService.getPeriodoById(req.params.periodoId);
    if (!periodo) {
      res.status(404).json({ error: "Periodo no encontrado" });
      return;
    }
    const anterior = await periodoService.getPeriodoAnterior(
      periodo.empresaId,
      periodo.anio
    );
    if (!anterior) {
      res.status(400).json({ error: "Se requiere un periodo anterior" });
      return;
    }
    res.json(calculosService.calcularFlujoEfectivoPeriodo(periodo, anterior));
  } catch (error) {
    next(error);
  }
});

router.get("/razones/:periodoId", async (req, res, next) => {
  try {
    const periodo = await periodoService.getPeriodoById(req.params.periodoId);
    if (!periodo) {
      res.status(404).json({ error: "Periodo no encontrado" });
      return;
    }
    res.json(calculosService.calcularRazonesPeriodo(periodo));
  } catch (error) {
    next(error);
  }
});

router.get("/analisis-vertical/:periodoId", async (req, res, next) => {
  try {
    const periodo = await periodoService.getPeriodoById(req.params.periodoId);
    if (!periodo) {
      res.status(404).json({ error: "Periodo no encontrado" });
      return;
    }
    res.json(calculosService.calcularAnalisisVerticalPeriodo(periodo));
  } catch (error) {
    next(error);
  }
});

router.get("/analisis-horizontal/:periodoId", async (req, res, next) => {
  try {
    const periodo = await periodoService.getPeriodoById(req.params.periodoId);
    if (!periodo) {
      res.status(404).json({ error: "Periodo no encontrado" });
      return;
    }
    const anterior = await periodoService.getPeriodoAnterior(
      periodo.empresaId,
      periodo.anio
    );
    if (!anterior) {
      res.status(400).json({ error: "Se requiere un periodo anterior" });
      return;
    }
    res.json(
      calculosService.calcularAnalisisHorizontalBalance(
        calcularBalanceGeneral(periodo.balanceGeneral),
        calcularBalanceGeneral(anterior.balanceGeneral)
      )
    );
  } catch (error) {
    next(error);
  }
});

router.get("/dupont/:periodoId", async (req, res, next) => {
  try {
    const periodo = await periodoService.getPeriodoById(req.params.periodoId);
    if (!periodo) {
      res.status(404).json({ error: "Periodo no encontrado" });
      return;
    }
    res.json(calculosService.calcularAnalisisDuPontPeriodo(periodo));
  } catch (error) {
    next(error);
  }
});

const PronosticoInputSchema = z.object({
  ventasNuevas: z.number().min(0),
  porcentajeActivosVariables: z.number().min(0).max(1),
  porcentajePasivosVariables: z.number().min(0).max(1),
  ratioPagoDividendos: z.number().min(0).max(1),
  plenaCapacidad: z.boolean(),
  porcentajeActivosFijos: z.number().min(0).max(1).optional(),
});

router.post("/pronostico-ventas/:periodoId", async (req, res, next) => {
  try {
    const periodo = await periodoService.getPeriodoById(req.params.periodoId);
    if (!periodo) {
      res.status(404).json({ error: "Periodo no encontrado" });
      return;
    }
    const input = PronosticoInputSchema.parse(req.body);
    res.json(calculosService.calcularPronosticoVentasPeriodo(periodo, input));
  } catch (error) {
    next(error);
  }
});

export default router;

import { Router } from "express";
import * as exportService from "@server/services/export.service";

const router = Router();

router.get("/periodo/:periodoId/excel", async (req, res, next) => {
  try {
    const buffer = await exportService.exportarPeriodoExcel(req.params.periodoId);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="reporte-${req.params.periodoId}.xlsx"`
    );
    res.send(buffer);
  } catch (error) {
    next(error);
  }
});

export default router;

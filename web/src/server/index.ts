import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "@server/db";
import empresasRoutes from "@server/routes/empresas.routes";
import periodosRoutes from "@server/routes/periodos.routes";
import calculosRoutes from "@server/routes/calculos.routes";
import exportRoutes from "@server/routes/export.routes";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/empresas", empresasRoutes);
app.use("/api/empresas/:empresaId/periodos", periodosRoutes);
app.use("/api/calculos", calculosRoutes);
app.use("/api/export", exportRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../dist")));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "../../dist/index.html"));
  });
}

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  if (err instanceof SyntaxError) {
    res.status(400).json({ error: "JSON inválido" });
    return;
  }
  res.status(500).json({ error: err.message || "Error interno del servidor" });
});

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("No se pudo iniciar el servidor:", err);
  process.exit(1);
});

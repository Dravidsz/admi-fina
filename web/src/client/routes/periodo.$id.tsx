import { createRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { Route as rootRoute } from "./__root";
import {
  getPeriodo,
  updatePeriodo,
  getEstados,
  getRazones,
  getFlujoEfectivo,
  getAnalisisVertical,
  getAnalisisHorizontal,
  getDuPont,
  calcularPronostico,
  exportarPeriodoExcel,
} from "@/api/api";
import type {
  EstadoResultadosInput,
  BalanceGeneralInput,
  RazonesFinancieras,
  AnalisisVertical,
  FlujoEfectivo,
  AnalisisDuPont,
  PronosticoVentas,
} from "@shared/types";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/periodo/$id",
  component: PeriodoComponent,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ["periodo", params.id],
      queryFn: () => getPeriodo(params.id),
    });
  },
});

type TabKey =
  | "datos"
  | "estados"
  | "razones"
  | "flujo"
  | "vertical"
  | "horizontal"
  | "dupont"
  | "pronostico";

function PeriodoComponent() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<TabKey>("datos");

  const { data: periodo } = useSuspenseQuery({
    queryKey: ["periodo", id],
    queryFn: () => getPeriodo(id),
  });

  const erForm = useForm({
    defaultValues: periodo.estadoResultados as EstadoResultadosInput,
    onSubmit: async ({ value }) => {
      await updatePeriodo(id, { estadoResultados: value });
      await queryClient.invalidateQueries({ queryKey: ["periodo", id] });
      await queryClient.invalidateQueries({ queryKey: ["reportes", id] });
    },
  });

  const bgForm = useForm({
    defaultValues: periodo.balanceGeneral as BalanceGeneralInput,
    onSubmit: async ({ value }) => {
      await updatePeriodo(id, { balanceGeneral: value });
      await queryClient.invalidateQueries({ queryKey: ["periodo", id] });
      await queryClient.invalidateQueries({ queryKey: ["reportes", id] });
    },
  });

  const datosForm = useForm({
    defaultValues: {
      dividendosComunes: periodo.dividendosComunes,
      arrendamiento: periodo.arrendamiento,
    },
    onSubmit: async ({ value }) => {
      await updatePeriodo(id, value);
      await queryClient.invalidateQueries({ queryKey: ["periodo", id] });
      await queryClient.invalidateQueries({ queryKey: ["reportes", id] });
    },
  });

  useEffect(() => {
    erForm.reset(periodo.estadoResultados as EstadoResultadosInput);
    bgForm.reset(periodo.balanceGeneral as BalanceGeneralInput);
    datosForm.reset({
      dividendosComunes: periodo.dividendosComunes,
      arrendamiento: periodo.arrendamiento,
    });
  }, [periodo]);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "datos", label: "Datos" },
    { key: "estados", label: "Estados" },
    { key: "razones", label: "Razones" },
    { key: "flujo", label: "Flujo de efectivo" },
    { key: "vertical", label: "Vertical" },
    { key: "horizontal", label: "Horizontal" },
    { key: "dupont", label: "Du Pont" },
    { key: "pronostico", label: "Pronóstico" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-slate-500">Periodo</p>
          <h1 className="text-3xl font-bold text-blue-900">{periodo.anio}</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => exportarPeriodoExcel(id)}
            className="bg-emerald-700 text-white px-4 py-2 rounded hover:bg-emerald-800 text-sm"
          >
            Exportar Excel
          </button>
          <Link
            to="/empresas/$id"
            params={{ id: periodo.empresaId }}
            className="text-blue-700 hover:underline"
          >
            ← Volver a la empresa
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-t font-medium text-sm ${
              tab === t.key
                ? "bg-white text-blue-900 border-t border-x border-slate-200"
                : "text-slate-600 hover:text-blue-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "datos" && (
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-lg shadow border border-slate-200">
            <h2 className="text-xl font-semibold mb-4">Estado de resultados</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                erForm.handleSubmit();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <NumberField form={erForm} name="ventas" label="Ventas" />
                <NumberField form={erForm} name="costoVentas" label="Costo de ventas" />
                <NumberField
                  form={erForm}
                  name="gastosVentaAdministracion"
                  label="Gastos de venta y administración"
                />
                <NumberField form={erForm} name="gastosDepreciacion" label="Depreciación" />
                <NumberField form={erForm} name="gastosIntereses" label="Intereses" />
                <NumberField form={erForm} name="impuestos" label="Impuestos" />
                <NumberField
                  form={erForm}
                  name="tasaImpuestos"
                  label="Tasa de impuestos"
                />
                <NumberField
                  form={erForm}
                  name="dividendosPreferentes"
                  label="Dividendos preferentes"
                />
                <NumberField
                  form={erForm}
                  name="accionesCirculacion"
                  label="Acciones en circulación"
                />
                <NumberField
                  form={erForm}
                  name="perdidasExtraordinarias"
                  label="Pérdidas extraordinarias"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
              >
                Guardar estado de resultados
              </button>
            </form>
          </section>

          <section className="bg-white p-6 rounded-lg shadow border border-slate-200">
            <h2 className="text-xl font-semibold mb-4">Balance general</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                bgForm.handleSubmit();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <NumberField form={bgForm} name="efectivo" label="Efectivo" />
                <NumberField
                  form={bgForm}
                  name="valoresNegociables"
                  label="Valores negociables"
                />
                <NumberField
                  form={bgForm}
                  name="cuentasCobrar"
                  label="Cuentas por cobrar"
                />
                <NumberField
                  form={bgForm}
                  name="provisionCuentasMalas"
                  label="Provisión cuentas malas"
                />
                <NumberField form={bgForm} name="inventario" label="Inventario" />
                <NumberField
                  form={bgForm}
                  name="gastosPagadosAdelantado"
                  label="Gastos pagados por anticipado"
                />
                <NumberField
                  form={bgForm}
                  name="inversionesLargoPlazo"
                  label="Inversiones a largo plazo"
                />
                <NumberField
                  form={bgForm}
                  name="plantaEquipoCosto"
                  label="Planta y equipo (costo)"
                />
                <NumberField
                  form={bgForm}
                  name="depreciacionAcumulada"
                  label="Depreciación acumulada"
                />
                <NumberField form={bgForm} name="cuentasPagar" label="Cuentas por pagar" />
                <NumberField form={bgForm} name="documentosPagar" label="Documentos por pagar" />
                <NumberField
                  form={bgForm}
                  name="gastosDevengados"
                  label="Gastos devengados"
                />
                <NumberField form={bgForm} name="bonosPagar" label="Bonos por pagar" />
                <NumberField
                  form={bgForm}
                  name="capitalPreferente"
                  label="Capital preferente"
                />
                <NumberField form={bgForm} name="capitalComun" label="Capital común" />
                <NumberField
                  form={bgForm}
                  name="capitalPagadoExceso"
                  label="Capital pagado en exceso"
                />
                <NumberField
                  form={bgForm}
                  name="utilidadesRetenidas"
                  label="Utilidades retenidas"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
              >
                Guardar balance general
              </button>
            </form>
          </section>

          <section className="bg-white p-6 rounded-lg shadow border border-slate-200">
            <h2 className="text-xl font-semibold mb-4">Datos adicionales del periodo</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                datosForm.handleSubmit();
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <NumberField
                  form={datosForm}
                  name="dividendosComunes"
                  label="Dividendos en acciones comunes"
                />
                <NumberField
                  form={datosForm}
                  name="arrendamiento"
                  label="Arrendamiento (cargos fijos)"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
              >
                Guardar datos adicionales
              </button>
            </form>
          </section>
        </div>
      )}

      {tab === "estados" && <EstadosTab periodoId={id} />}
      {tab === "razones" && <RazonesTab periodoId={id} />}
      {tab === "flujo" && <FlujoTab periodoId={id} />}
      {tab === "vertical" && <VerticalTab periodoId={id} />}
      {tab === "horizontal" && <HorizontalTab periodoId={id} />}
      {tab === "dupont" && <DuPontTab periodoId={id} />}
      {tab === "pronostico" && <PronosticoTab periodoId={id} />}
    </div>
  );
}

function NumberField({
  form,
  name,
  label,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  name: string;
  label: string;
}) {
  return (
    <form.Field
      name={name}
      children={(field: { state: { value: number }; handleChange: (v: number) => void }) => (
        <div>
          <label className="block text-sm font-medium text-slate-700">{label}</label>
          <input
            type="number"
            value={field.state.value}
            onChange={(e) => field.handleChange(parseFloat(e.target.value) || 0)}
            className="mt-1 w-full border border-slate-300 rounded px-3 py-2"
          />
        </div>
      )}
    />
  );
}

function formatPct(value: number | null | undefined) {
  if (value === null || value === undefined || !isFinite(value)) return "—";
  return `${(value * 100).toFixed(2)}%`;
}

function formatNum(value: number | null | undefined) {
  if (value === null || value === undefined || !isFinite(value)) return "—";
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function EstadosTab({ periodoId }: { periodoId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["reportes", periodoId, "estados"],
    queryFn: () => getEstados(periodoId),
  });

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return null;

  const er = data.estadoResultados;
  const bg = data.balanceGeneral;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ReportCard title="Estado de resultados">
        <LineItem label="Ventas" value={er.ventas} />
        <LineItem label="Costo de ventas" value={er.costoVentas} />
        <LineItem label="Utilidad bruta" value={er.utilidadBruta} bold />
        <LineItem label="Gastos V&amp;A" value={er.gastosVentaAdministracion} />
        <LineItem label="Depreciación" value={er.gastosDepreciacion} />
        <LineItem label="Utilidad operativa (EBIT)" value={er.utilidadOperativa} bold />
        <LineItem label="Intereses" value={er.gastosIntereses} />
        <LineItem label="Utilidad antes de impuestos" value={er.utilidadAntesImpuestos} />
        <LineItem label="Impuestos" value={er.impuestos ?? 0} />
        <LineItem label="Utilidad neta" value={er.utilidadNeta} bold />
        <LineItem label="Dividendos preferentes" value={er.dividendosPreferentes} />
        <LineItem label="Utilidad por acción" value={er.utilidadPorAccion} />
      </ReportCard>

      <ReportCard title="Balance general">
        <SectionTitle>Activos circulantes</SectionTitle>
        <LineItem label="Efectivo" value={bg.efectivo} />
        <LineItem label="Cuentas por cobrar neto" value={bg.cuentasCobrarNeto} />
        <LineItem label="Inventario" value={bg.inventario} />
        <LineItem label="Total activos circulantes" value={bg.activosCirculantes} bold />
        <SectionTitle>Activos fijos</SectionTitle>
        <LineItem label="Planta y equipo neto" value={bg.plantaEquipoNeto} />
        <LineItem label="Total activos" value={bg.activosTotales} bold />
        <SectionTitle>Pasivos y capital</SectionTitle>
        <LineItem label="Pasivos circulantes" value={bg.pasivosCirculantes} />
        <LineItem label="Pasivos totales" value={bg.pasivosTotales} />
        <LineItem label="Capital contable" value={bg.capitalContableTotal} />
        <LineItem label="Pasivo + capital" value={bg.pasivoCapitalTotal} bold />
        <LineItem
          label="Cuadre"
          value={bg.cuadra ? "Cuadrado" : `Diferencia ${bg.diferenciaCuadre}`}
        />
      </ReportCard>
    </div>
  );
}

function LineItem({
  label,
  value,
  bold,
}: {
  label: string;
  value: string | number;
  bold?: boolean;
}) {
  const display = typeof value === "number" ? formatNum(value) : value;
  return (
    <div className={`flex justify-between py-1 ${bold ? "font-semibold border-t border-slate-200 mt-1 pt-1" : ""}`}>
      <span>{label}</span>
      <span>{display}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold text-slate-500 mt-4 mb-1 uppercase tracking-wide">{children}</h3>;
}

function ReportCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function RazonesTab({ periodoId }: { periodoId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["reportes", periodoId, "razones"],
    queryFn: () => getRazones(periodoId),
  });

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return null;

  const entries = Object.entries(data).map(([key, value]) => ({
    nombre: key,
    valor: value as number,
  }));

  const columns: ColumnDef<{ nombre: string; valor: number }>[] = [
    {
      accessorKey: "nombre",
      header: "Razón",
    },
    {
      accessorKey: "valor",
      header: "Valor",
      cell: ({ getValue }) => formatNum(getValue<number>()),
    },
  ];

  const table = useReactTable({
    data: entries,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <ReportCard title="Razones financieras">
      <table className="w-full text-left">
        <thead className="bg-slate-100">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => (
                <th key={h.id} className="p-3">
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </ReportCard>
  );
}

function FlujoTab({ periodoId }: { periodoId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["reportes", periodoId, "flujo"],
    queryFn: () => getFlujoEfectivo(periodoId),
  });

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return null;

  const f = data.flujo;
  return (
    <ReportCard title="Flujo de efectivo">
      <SectionTitle>Operación</SectionTitle>
      <LineItem label="Utilidad neta" value={f.utilidadNeta} />
      <LineItem label="Depreciación" value={f.depreciacion} />
      <LineItem label="Δ Cuentas por cobrar" value={f.deltaCuentasCobrar} />
      <LineItem label="Δ Inventario" value={f.deltaInventario} />
      <LineItem label="Δ Gastos anticipados" value={f.deltaGastosAdelantado} />
      <LineItem label="Δ Cuentas por pagar" value={f.deltaCuentasPagar} />
      <LineItem label="Δ Gastos devengados" value={f.deltaGastosDevengados} />
      <LineItem label="Flujo de operación" value={f.flujoOperacion} bold />

      <SectionTitle>Inversión</SectionTitle>
      <LineItem label="Δ Inversiones LP" value={f.deltaInversiones} />
      <LineItem label="Δ Planta y equipo" value={f.deltaPlantaEquipo} />
      <LineItem label="Flujo de inversión" value={f.flujoInversion} bold />

      <SectionTitle>Financiamiento</SectionTitle>
      <LineItem label="Δ Bonos" value={f.deltaBonos} />
      <LineItem label="Dividendos preferentes" value={f.dividendosPreferentes} />
      <LineItem label="Dividendos comunes" value={f.dividendosComunes} />
      <LineItem label="Flujo de financiamiento" value={f.flujoFinanciamiento} bold />

      <LineItem label="Cambio en efectivo" value={f.cambioEfectivo} bold />
      <LineItem label="Flujo de efectivo libre" value={data.flujoLibre} bold />
    </ReportCard>
  );
}

function VerticalTab({ periodoId }: { periodoId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["reportes", periodoId, "vertical"],
    queryFn: () => getAnalisisVertical(periodoId),
  });

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <VerticalSection title="Estado de resultados (% de ventas)" data={data.estadoResultados} />
      <VerticalSection title="Activos (% de activos totales)" data={data.activos} />
      <VerticalSection title="Pasivo + capital" data={data.pasivosCapital} />
    </div>
  );
}

function VerticalSection({ title, data }: { title: string; data: Record<string, number> }) {
  return (
    <ReportCard title={title}>
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex justify-between py-1">
          <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
          <span>{formatPct(value)}</span>
        </div>
      ))}
    </ReportCard>
  );
}

function HorizontalTab({ periodoId }: { periodoId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["reportes", periodoId, "horizontal"],
    queryFn: () => getAnalisisHorizontal(periodoId),
  });

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return null;

  const rows = Object.entries(data);

  return (
    <ReportCard title="Análisis horizontal del balance general">
      <table className="w-full text-left">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-3">Cuenta</th>
            <th className="p-3">Actual</th>
            <th className="p-3">Anterior</th>
            <th className="p-3">Variación</th>
            <th className="p-3">% Cambio</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([key, row]) => (
            <tr key={key} className="border-t">
              <td className="p-3 capitalize">{key.replace(/([A-Z])/g, " $1")}</td>
              <td className="p-3">{formatNum(row.actual)}</td>
              <td className="p-3">{formatNum(row.anterior)}</td>
              <td className="p-3">{formatNum(row.variacion)}</td>
              <td className="p-3">{formatNum(row.porcentajeCambio)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ReportCard>
  );
}

function DuPontTab({ periodoId }: { periodoId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["reportes", periodoId, "dupont"],
    queryFn: () => getDuPont(periodoId),
  });

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return null;

  return (
    <ReportCard title="Análisis Du Pont">
      <LineItem label="Margen de utilidad neta" value={formatPct(data.margenUtilidadNeta)} />
      <LineItem label="Rotación de activos totales" value={data.rotacionActivosTotales} />
      <LineItem label="ROA (Du Pont)" value={formatPct(data.roaDuPont)} bold />
      <LineItem label="Deuda total / Activos totales" value={data.deudaTotalActivos} />
      <LineItem label="ROE (Du Pont)" value={formatPct(data.roeDuPont)} bold />
      <LineItem label="ROA directo" value={formatPct(data.roaDirecto)} />
      <LineItem label="ROE directo" value={formatPct(data.roeDirecto)} />
    </ReportCard>
  );
}

function PronosticoTab({ periodoId }: { periodoId: string }) {
  const [resultado, setResultado] = useState<PronosticoVentas | null>(null);

  const form = useForm({
    defaultValues: {
      ventasNuevas: 0,
      porcentajeActivosVariables: 0,
      porcentajePasivosVariables: 0,
      ratioPagoDividendos: 0,
      plenaCapacidad: false,
      porcentajeActivosFijos: 0,
    },
    onSubmit: async ({ value }) => {
      const res = await calcularPronostico(periodoId, value);
      setResultado(res);
    },
  });

  return (
    <div className="space-y-6">
      <section className="bg-white p-6 rounded-lg shadow border border-slate-200">
        <h2 className="text-xl font-semibold mb-4">Pronóstico por porcentaje de ventas</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NumberField form={form} name="ventasNuevas" label="Ventas nuevas" />
            <NumberField
              form={form}
              name="porcentajeActivosVariables"
              label="% activos variables"
            />
            <NumberField
              form={form}
              name="porcentajePasivosVariables"
              label="% pasivos variables"
            />
            <NumberField
              form={form}
              name="ratioPagoDividendos"
              label="Ratio de pago de dividendos"
            />
            <NumberField
              form={form}
              name="porcentajeActivosFijos"
              label="% activos fijos (si plena capacidad)"
            />
            <form.Field
              name="plenaCapacidad"
              children={(field) => (
                <div className="flex items-center gap-2 mt-6">
                  <input
                    type="checkbox"
                    checked={field.state.value as boolean}
                    onChange={(e) => field.handleChange(e.target.checked)}
                  />
                  <label className="text-sm font-medium text-slate-700">
                    Plena capacidad
                  </label>
                </div>
              )}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            Calcular RNF
          </button>
        </form>
      </section>

      {resultado && (
        <ReportCard title="Resultado del pronóstico">
          <LineItem label="Ventas actuales" value={resultado.ventasActuales} />
          <LineItem label="Ventas nuevas" value={resultado.ventasNuevas} />
          <LineItem label="Incremento en ventas" value={resultado.incrementoVentas} />
          <LineItem label="Requerimiento de activos" value={resultado.requerimientoActivos} />
          <LineItem label="Financiamiento espontáneo" value={resultado.financiamientoEspontaneo} />
          <LineItem label="Utilidades retenidas adicionales" value={resultado.utilidadesRetenidasAdicionales} />
          <LineItem label="Requerimiento de fondos nuevos (RNF)" value={resultado.requerimientoFondosNuevos} bold />
        </ReportCard>
      )}
    </div>
  );
}

function ErrorMessage({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : "Error desconocido";
  return <p className="text-red-600">Error: {message}</p>;
}

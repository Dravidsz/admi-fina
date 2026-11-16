import { createRoute, Link, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { Route as rootRoute } from "./__root";
import { createPeriodo, getEmpresa, getPeriodos } from "@/api/api";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/empresas/$id",
  component: EmpresaDetailComponent,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ["empresa", params.id],
      queryFn: () => getEmpresa(params.id),
    });
    await context.queryClient.ensureQueryData({
      queryKey: ["periodos", params.id],
      queryFn: () => getPeriodos(params.id),
    });
  },
});

function EmpresaDetailComponent() {
  const { id } = Route.useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: empresa } = useSuspenseQuery({
    queryKey: ["empresa", id],
    queryFn: () => getEmpresa(id),
  });

  const { data: periodos } = useSuspenseQuery({
    queryKey: ["periodos", id],
    queryFn: () => getPeriodos(id),
  });

  const form = useForm({
    defaultValues: {
      anio: new Date().getFullYear(),
    },
    onSubmit: async ({ value }) => {
      await createPeriodo(id, {
        anio: value.anio,
        estadoResultados: {
          ventas: 0,
          costoVentas: 0,
          gastosVentaAdministracion: 0,
          gastosDepreciacion: 0,
          gastosIntereses: 0,
          dividendosPreferentes: 0,
          accionesCirculacion: 1,
          perdidasExtraordinarias: 0,
        },
        balanceGeneral: {
          efectivo: 0,
          valoresNegociables: 0,
          cuentasCobrar: 0,
          provisionCuentasMalas: 0,
          inventario: 0,
          gastosPagadosAdelantado: 0,
          inversionesLargoPlazo: 0,
          plantaEquipoCosto: 0,
          depreciacionAcumulada: 0,
          cuentasPagar: 0,
          documentosPagar: 0,
          gastosDevengados: 0,
          bonosPagar: 0,
          capitalPreferente: 0,
          capitalComun: 0,
          capitalPagadoExceso: 0,
          utilidadesRetenidas: 0,
        },
        dividendosComunes: 0,
        arrendamiento: 0,
      });
      await queryClient.invalidateQueries({ queryKey: ["periodos", id] });
      form.reset();
      router.invalidate();
    },
  });

  if (!empresa) {
    return <div className="p-4">Empresa no encontrada</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">{empresa.nombre}</h1>
          <p className="text-slate-600">{empresa.industria || "Sin industria"}</p>
          {empresa.descripcion && (
            <p className="text-slate-700 mt-2">{empresa.descripcion}</p>
          )}
        </div>
        <Link to="/empresas" className="text-blue-700 hover:underline">
          ← Volver a empresas
        </Link>
      </div>

      <section className="bg-white p-6 rounded-lg shadow border border-slate-200">
        <h2 className="text-xl font-semibold mb-4">Nuevo periodo</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex gap-4 items-end"
        >
          <form.Field
            name="anio"
            children={(field) => (
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Año
                </label>
                <input
                  type="number"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(parseInt(e.target.value))}
                  className="mt-1 border border-slate-300 rounded px-3 py-2"
                  required
                />
              </div>
            )}
          />
          <button
            type="submit"
            className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            Crear periodo
          </button>
        </form>
      </section>

      <section className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4">Año</th>
              <th className="p-4">Ventas</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {periodos.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-slate-500">
                  No hay periodos registrados.
                </td>
              </tr>
            )}
            {periodos.map((periodo) => (
              <tr key={periodo._id} className="border-t">
                <td className="p-4 font-medium">{periodo.anio}</td>
                <td className="p-4">
                  ${periodo.estadoResultados.ventas.toLocaleString()}
                </td>
                <td className="p-4">
                  <Link
                    to="/periodo/$id"
                    params={{ id: periodo._id }}
                    className="text-blue-700 hover:underline"
                  >
                    Ver periodo
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

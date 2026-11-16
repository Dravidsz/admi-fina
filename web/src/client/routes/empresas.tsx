import { createRoute, Link, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { Route as rootRoute } from "./__root";
import { createEmpresa, getEmpresas } from "@/api/api";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/empresas",
  component: EmpresasComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ["empresas"],
      queryFn: getEmpresas,
    });
  },
});

function EmpresasComponent() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: empresas } = useSuspenseQuery({
    queryKey: ["empresas"],
    queryFn: getEmpresas,
  });

  const form = useForm({
    defaultValues: {
      nombre: "",
      industria: "",
      descripcion: "",
    },
    onSubmit: async ({ value }) => {
      await createEmpresa(value);
      await queryClient.invalidateQueries({ queryKey: ["empresas"] });
      form.reset();
      router.invalidate();
    },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-blue-900">Empresas</h1>

      <section className="bg-white p-6 rounded-lg shadow border border-slate-200">
        <h2 className="text-xl font-semibold mb-4">Nueva empresa</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <form.Field
              name="nombre"
              children={(field) => (
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="mt-1 w-full border border-slate-300 rounded px-3 py-2"
                    required
                  />
                </div>
              )}
            />
            <form.Field
              name="industria"
              children={(field) => (
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Industria
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="mt-1 w-full border border-slate-300 rounded px-3 py-2"
                  />
                </div>
              )}
            />
            <form.Field
              name="descripcion"
              children={(field) => (
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Descripción
                  </label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="mt-1 w-full border border-slate-300 rounded px-3 py-2"
                  />
                </div>
              )}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            Crear empresa
          </button>
        </form>
      </section>

      <section className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4">Nombre</th>
              <th className="p-4">Industria</th>
              <th className="p-4">Descripción</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empresas.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-slate-500">
                  No hay empresas registradas.
                </td>
              </tr>
            )}
            {empresas.map((empresa) => (
              <tr key={empresa._id} className="border-t">
                <td className="p-4 font-medium">{empresa.nombre}</td>
                <td className="p-4">{empresa.industria || "—"}</td>
                <td className="p-4">{empresa.descripcion || "—"}</td>
                <td className="p-4">
                  <Link
                    to="/empresas/$id"
                    params={{ id: empresa._id }}
                    className="text-blue-700 hover:underline"
                  >
                    Ver detalle
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

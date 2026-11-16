import { createRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-4xl font-bold text-blue-900">
          Sistema de Análisis Financiero
        </h1>
        <p className="text-lg text-slate-700">
          Herramienta basada en{" "}
          <em>Fundamentos de Administración Financiera</em> de Block, Hirt y
          Danielsen.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FeatureCard
          title="Gestión de empresas"
          description="Crea empresas y registra sus periodos contables."
          to="/empresas"
        />
        <FeatureCard
          title="Estados financieros"
          description="Estado de resultados, balance general y flujo de efectivo."
        />
        <FeatureCard
          title="15 razones financieras"
          description="Rentabilidad, liquidez, endeudamiento y uso de activos."
        />
        <FeatureCard
          title="Análisis vertical y horizontal"
          description="Identifica cambios estructurales entre periodos."
        />
        <FeatureCard
          title="Análisis Du Pont"
          description="Descompón el ROA y ROE en sus factores."
        />
        <FeatureCard
          title="Pronósticos"
          description="Aplica el método del porcentaje de ventas."
        />
      </section>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  to,
}: {
  title: string;
  description: string;
  to?: string;
}) {
  const card = (
    <div className="bg-white p-6 rounded-lg shadow border border-slate-200 hover:shadow-md transition-shadow h-full">
      <h2 className="text-xl font-semibold text-blue-800 mb-2">{title}</h2>
      <p className="text-slate-600">{description}</p>
    </div>
  );

  return to ? <Link to={to}>{card}</Link> : card;
}

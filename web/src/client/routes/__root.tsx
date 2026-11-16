import { createRootRouteWithContext, Link, Outlet } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-900 text-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center gap-6">
          <Link to="/" className="text-lg font-bold hover:opacity-90">
            Sistema Financiero
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link to="/" className="hover:underline">
              Inicio
            </Link>
            <Link to="/empresas" className="hover:underline">
              Empresas
            </Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 flex-1">
        <Outlet />
      </main>
      <footer className="bg-slate-100 text-slate-600 text-sm py-4">
        <div className="container mx-auto px-4">
          Sistema de Análisis Financiero — Block, Hirt y Danielsen
        </div>
      </footer>
    </div>
  );
}

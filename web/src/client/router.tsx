import { createRouter } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { Route as rootRoute } from "./routes/__root";
import { Route as indexRoute } from "./routes/index";
import { Route as empresasRoute } from "./routes/empresas";
import { Route as empresaDetailRoute } from "./routes/empresas.$id";
import { Route as periodoRoute } from "./routes/periodo.$id";

const routeTree = rootRoute.addChildren([
  indexRoute,
  empresasRoute,
  empresaDetailRoute,
  periodoRoute,
]);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

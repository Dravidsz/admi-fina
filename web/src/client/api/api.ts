import type {
  Empresa,
  Periodo,
  PeriodoInput,
  EstadoResultadosCalculado,
  BalanceGeneralCalculado,
  AnalisisDuPont,
  AnalisisVertical,
  FlujoEfectivo,
  PronosticoVentas,
  RazonesFinancieras,
} from "@shared/types";

const API_BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Error desconocido" }));
    throw new Error(body.error || `Error ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export async function getEmpresas(): Promise<Empresa[]> {
  return request("/empresas");
}

export async function getEmpresa(id: string): Promise<Empresa> {
  return request(`/empresas/${id}`);
}

export async function createEmpresa(
  data: Pick<Empresa, "nombre" | "descripcion" | "industria">
): Promise<Empresa> {
  return request("/empresas", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getPeriodos(empresaId: string): Promise<Periodo[]> {
  return request(`/empresas/${empresaId}/periodos`);
}

export async function getPeriodo(id: string): Promise<Periodo> {
  return request(`/empresas/_/periodos/${id}`);
}

export async function createPeriodo(
  empresaId: string,
  data: Omit<PeriodoInput, "empresaId">
): Promise<Periodo> {
  return request(`/empresas/${empresaId}/periodos`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updatePeriodo(
  id: string,
  data: Partial<Omit<PeriodoInput, "empresaId">>
): Promise<Periodo> {
  return request(`/empresas/_/periodos/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function getEstados(periodoId: string) {
  return request<{
    estadoResultados: EstadoResultadosCalculado;
    balanceGeneral: BalanceGeneralCalculado;
  }>(`/calculos/estados/${periodoId}`);
}

export async function getRazones(periodoId: string): Promise<RazonesFinancieras> {
  return request(`/calculos/razones/${periodoId}`);
}

export async function getFlujoEfectivo(
  periodoId: string
): Promise<{ flujo: FlujoEfectivo; flujoLibre: number }> {
  return request(`/calculos/flujo-efectivo/${periodoId}`);
}

export async function getAnalisisVertical(
  periodoId: string
): Promise<AnalisisVertical> {
  return request(`/calculos/analisis-vertical/${periodoId}`);
}

export async function getAnalisisHorizontal(
  periodoId: string
): Promise<
  Record<string, { actual: number; anterior: number; variacion: number; porcentajeCambio: number }>
> {
  return request(`/calculos/analisis-horizontal/${periodoId}`);
}

export async function getDuPont(periodoId: string): Promise<AnalisisDuPont> {
  return request(`/calculos/dupont/${periodoId}`);
}

export async function calcularPronostico(
  periodoId: string,
  input: {
    ventasNuevas: number;
    porcentajeActivosVariables: number;
    porcentajePasivosVariables: number;
    ratioPagoDividendos: number;
    plenaCapacidad: boolean;
    porcentajeActivosFijos?: number;
  }
): Promise<PronosticoVentas> {
  return request(`/calculos/pronostico-ventas/${periodoId}`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

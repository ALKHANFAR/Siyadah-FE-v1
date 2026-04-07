import { getErrorMessage } from "@/config/error-messages";

const BASE_URL = process.env.ORCHESTRATOR_URL || "";

interface OrchestratorResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<OrchestratorResponse<T>> {
  if (!BASE_URL) {
    return { ok: false, error: getErrorMessage("orchestrator_down") };
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!res.ok) {
      let errorDetail: string;
      try {
        const errorJson = await res.json() as Record<string, unknown>;
        errorDetail = (errorJson.detail || errorJson.message || errorJson.error || JSON.stringify(errorJson)) as string;
      } catch {
        errorDetail = await res.text();
      }
      return {
        ok: false,
        error: errorDetail || getErrorMessage("unexpected"),
      };
    }

    const data = (await res.json()) as T;
    return { ok: true, data };
  } catch {
    return { ok: false, error: getErrorMessage("network_error") };
  }
}

export async function getHealth() {
  return request<{ status: string }>("/health");
}

export async function getConnections() {
  return request<{
    connections: { id: string; externalId: string; pieceName: string; displayName: string; status: string }[];
    count: number;
  }>("/connections");
}

export async function getTemplates() {
  return request<{
    templates: { id: string; name: string; status: string; created: string }[];
    count: number;
  }>("/templates");
}

export async function listFlows() {
  return request<{
    data: { id: string; displayName: string; status: string; created: string; publishedVersionId: string }[];
  }>("/v2/flows");
}

export async function getTemplateById(id: string) {
  return request<Record<string, unknown>>(`/templates/${id}`);
}

export async function getAvailablePieces() {
  return request<{ name: string; displayName: string; logoUrl: string }[]>(
    "/v2/available-pieces"
  );
}

export async function getPieceSchema(pieceName: string) {
  return request<Record<string, unknown>>(
    `/v2/pieces/${encodeURIComponent(pieceName)}/schema`
  );
}

export async function buildAndDeploy(flowConfig: Record<string, unknown>) {
  return request<{
    success: boolean;
    flow?: { id: string; name: string; link: string };
    webhook_url?: string;
    message?: string;
  }>("/v2/build-and-deploy", {
    method: "POST",
    body: JSON.stringify(flowConfig),
  });
}

export const buildDynamic = buildAndDeploy;

export async function buildDynamicFlow(config: {
  display_name: string;
  trigger: Record<string, unknown>;
  actions: Record<string, unknown>[];
  connection_ids: Record<string, string>;
}) {
  return request<{
    success: boolean;
    flow?: { id: string; name: string; link: string };
    webhook_url?: string;
    message?: string;
  }>("/v2/build-dynamic", {
    method: "POST",
    body: JSON.stringify(config),
  });
}

export async function connectService(config: {
  piece_name: string;
  display_name?: string;
  connection_config: Record<string, unknown>;
}) {
  return request<{
    id: string;
    pieceName: string;
    displayName: string;
    status: string;
  }>("/v2/connect", {
    method: "POST",
    body: JSON.stringify(config),
  });
}

export async function testConnection(connectionId: string) {
  return request<{ success: boolean; message?: string }>(
    `/v2/connections/${encodeURIComponent(connectionId)}/test`,
    { method: "POST" }
  );
}

export async function manageFlow(
  flowId: string,
  action: "enable" | "disable" | "delete"
) {
  if (action === "delete") {
    return request(`/flows/${flowId}`, { method: "DELETE" });
  }

  return request(`/v2/flows/${flowId}`, {
    method: "PATCH",
    body: JSON.stringify({ action }),
  });
}

export async function testFlow(flowId: string) {
  return request<{ success: boolean; result?: unknown }>(
    `/test-flow/${flowId}`,
    { method: "POST" }
  );
}

export async function diagnoseFlow(flowId: string) {
  return request<Record<string, unknown>>(`/diagnose/${flowId}`);
}

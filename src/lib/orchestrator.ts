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
      const body = await res.text();
      return {
        ok: false,
        error: body || getErrorMessage("unexpected"),
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

export async function buildDynamic(flowConfig: Record<string, unknown>) {
  const buildResult = await request<{ id: string; name: string }>(
    "/v2/build-dynamic",
    {
      method: "POST",
      body: JSON.stringify(flowConfig),
    }
  );

  if (!buildResult.ok || !buildResult.data) return buildResult;

  const flowId = buildResult.data.id;

  const verifyResult = await request<Record<string, unknown>>(
    `/templates/${flowId}`
  );
  if (!verifyResult.ok) {
    return {
      ok: false,
      error: getErrorMessage("automation_build_failed"),
    };
  }

  return buildResult;
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

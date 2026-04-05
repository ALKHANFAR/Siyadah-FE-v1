import type Anthropic from "@anthropic-ai/sdk";
import * as orchestrator from "./orchestrator";
import { getToolsByDepartment, getToolsSortedByTier } from "@/config/tools-catalog";
import type { Department } from "@/config/tools-catalog";

export const CLAUDE_TOOLS: Anthropic.Tool[] = [
  {
    name: "scan_company",
    description:
      "Scan and analyze a company website. Returns company identity, DNA, health score, gaps, and opportunities.",
    input_schema: {
      type: "object" as const,
      properties: {
        url: {
          type: "string",
          description: "The website URL to scan",
        },
      },
      required: ["url"],
    },
  },
  {
    name: "get_system_status",
    description:
      "Get the current system status including health check and connected channels (Gmail, Sheets, etc.)",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "list_tools",
    description:
      "List available automation tools by department (sales, marketing, operations, support, finance)",
    input_schema: {
      type: "object" as const,
      properties: {
        department: {
          type: "string",
          enum: ["sales", "marketing", "operations", "support", "finance"],
          description: "Department to filter tools by",
        },
      },
      required: [],
    },
  },
  {
    name: "build_automation",
    description:
      "Build a new smart employee (automation). Specify the template type and configuration.",
    input_schema: {
      type: "object" as const,
      properties: {
        template: {
          type: "string",
          description:
            "Template ID: webhook_to_email, webhook_to_sheet, webhook_to_sheet_and_email, support_auto_reply, marketing_welcome, ops_log_report, lead_notify_and_confirm, scheduled_report",
        },
        name: {
          type: "string",
          description: "Name for this automation",
        },
        config: {
          type: "object",
          description: "Template-specific configuration",
        },
      },
      required: ["template", "name"],
    },
  },
  {
    name: "list_automations",
    description:
      "List all current smart employees (automations) with their status",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "manage_automation",
    description:
      "Enable, disable, or delete a smart employee (automation) by its ID",
    input_schema: {
      type: "object" as const,
      properties: {
        flow_id: {
          type: "string",
          description: "The automation flow ID",
        },
        action: {
          type: "string",
          enum: ["enable", "disable", "delete"],
          description: "Action to perform",
        },
      },
      required: ["flow_id", "action"],
    },
  },
  {
    name: "test_automation",
    description: "Test a smart employee (automation) to verify it works",
    input_schema: {
      type: "object" as const,
      properties: {
        flow_id: {
          type: "string",
          description: "The automation flow ID to test",
        },
      },
      required: ["flow_id"],
    },
  },
];

export async function executeTool(
  name: string,
  input: Record<string, unknown>
): Promise<string> {
  switch (name) {
    case "scan_company": {
      const url = input.url as string;
      return JSON.stringify({
        message: `سيتم تحليل الموقع ${url}. استخدم صفحة التحليل للحصول على تقرير كامل.`,
        action: "redirect_to_analysis",
        url,
      });
    }

    case "get_system_status": {
      const [health, connections] = await Promise.all([
        orchestrator.getHealth(),
        orchestrator.getConnections(),
      ]);

      if (!health.ok) {
        return JSON.stringify({
          system: "maintenance",
          message: "النظام يمر بتحديث سريع. الأدوات متاحة بس الربط يحتاج دقائق.",
          connections: [],
          availableTools: getToolsSortedByTier().length,
        });
      }

      const connList = connections.data || [];
      const connectedNames = connList
        .filter((c: any) => c.status === "ACTIVE")
        .map((c: any) => c.displayName || c.pieceName);

      return JSON.stringify({
        system: "online",
        connections: connList,
        connectedChannels: connectedNames,
        availableTools: getToolsSortedByTier().length,
        message: connectedNames.length > 0
          ? `النظام شغال. القنوات المربوطة: ${connectedNames.join("، ")}`
          : "النظام شغال. ما فيه قنوات مربوطة بعد — نحتاج نربط إيميلك أول.",
      });
    }

    case "list_tools": {
      const dept = input.department as Department | undefined;
      const tools = dept
        ? getToolsByDepartment(dept)
        : getToolsSortedByTier();

      const free = tools.filter(t => t.tier === 'free');
      const freemium = tools.filter(t => t.tier === 'freemium');
      const paid = tools.filter(t => t.tier === 'paid');

      return JSON.stringify({
        total: tools.length,
        breakdown: {
          free: free.length,
          freemium: freemium.length,
          paid: paid.length,
        },
        tools: tools.map((t) => ({
          name: t.displayNameAr,
          nameEn: t.displayNameEn,
          tier: t.tier === 'free' ? 'مجاني' : t.tier === 'freemium' ? 'محدود مجاناً' : 'متقدم',
          requiresOAuth: t.requiresOAuth,
          icon: t.icon,
          description: t.descriptionAr,
        })),
        note: dept
          ? `عندك ${tools.length} أداة لقسم ${dept}`
          : `عندك ${tools.length} أداة إجمالاً (${free.length} مجانية)`,
      });
    }

    case "build_automation": {
      const template = input.template as string;
      const flowName = input.name as string;
      const config = (input.config as Record<string, unknown>) || {};

      const healthCheck = await orchestrator.getHealth();
      if (!healthCheck.ok) {
        return JSON.stringify({
          success: false,
          needsSetup: true,
          message: "أحتاج أتأكد من إعدادات النظام أول. خلني أجهّز لك الخطة وأنفذها أول ما يجهز.",
          plan: {
            name: flowName,
            template: template,
            description: `بنبني لك "${flowName}" — كل ما يجهز النظام بننفذه فوراً.`,
          },
        });
      }

      const result = await orchestrator.buildDynamic({
        template,
        name: flowName,
        ...config,
      });

      if (!result.ok) {
        return JSON.stringify({
          success: false,
          error: "ما قدرت أبني الموظف الذكي. خلني أحاول بطريقة ثانية...",
          suggestion: "ممكن نحتاج نربط القنوات المطلوبة أول.",
        });
      }

      return JSON.stringify({
        success: true,
        message: `تم بناء "${flowName}" بنجاح ✅`,
        flowId: result.data?.id,
        nextStep: "تبي أختبره الحين؟",
      });
    }

    case "list_automations": {
      const templates = await orchestrator.getTemplates();
      return JSON.stringify(templates.data || []);
    }

    case "manage_automation": {
      const flowId = input.flow_id as string;
      const action = input.action as "enable" | "disable" | "delete";
      const result = await orchestrator.manageFlow(flowId, action);

      return JSON.stringify({
        success: result.ok,
        message: result.ok
          ? `تم ${action === "enable" ? "تفعيل" : action === "disable" ? "تعطيل" : "حذف"} الموظف الذكي`
          : result.error,
      });
    }

    case "test_automation": {
      const flowId = input.flow_id as string;
      const result = await orchestrator.testFlow(flowId);

      return JSON.stringify({
        success: result.ok,
        message: result.ok
          ? "الاختبار نجح ✅"
          : "الاختبار ما نجح. ممكن فيه مشكلة بالإعدادات.",
      });
    }

    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
}

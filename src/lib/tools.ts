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
      "بناء موظف ذكي (أتمتة) جديد. استخدمها لما العميل يطلب بناء أتمتة أو تنبيه أو نظام تلقائي.",
    input_schema: {
      type: "object" as const,
      properties: {
        template: {
          type: "string",
          enum: [
            "webhook_to_email",
            "webhook_to_sheet",
            "webhook_to_sheet_and_email",
            "support_auto_reply",
            "marketing_welcome",
            "ops_log_report",
            "lead_notify_and_confirm",
            "scheduled_report",
          ],
          description:
            "نوع القالب: webhook_to_email (تنبيه إيميل), webhook_to_sheet (حفظ بيانات), webhook_to_sheet_and_email (حفظ+تنبيه), support_auto_reply (رد تلقائي), marketing_welcome (ترحيب), ops_log_report (تقرير), lead_notify_and_confirm (ليدات كامل), scheduled_report (تقرير يومي)",
        },
        name: {
          type: "string",
          description: "اسم فريد للموظف الذكي بالعربي — يشمل نوع المهمة + اسم الشركة. مثال: 'مراقب طلبات مطعم كبسة' أو 'مجمع تقارير فروع الرياض'. لا تستخدم أسماء القوالب مثل 'حفظ + تنبيه' كاسم.",
        },
        recipient_email: {
          type: "string",
          description: "إيميل المستلم للتنبيهات (إذا مو محدد يُستخدم الافتراضي)",
        },
        spreadsheet_id: {
          type: "string",
          description: "معرف جدول Google Sheets (اختياري — يُنشأ تلقائياً إذا فاضي)",
        },
      },
      required: ["template", "name"],
    },
  },
  {
    name: "list_automations",
    description:
      "اعرض كل الموظفين الأذكياء (الأتمتات) المبنية فعلاً مع حالتها (شغّال/متوقف). استخدمها لما العميل يسأل 'وش عندي؟' أو 'وريني أتمتاتي'.",
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
  {
    name: "extract_facts",
    description:
      "استخدمها تلقائياً لما تسمع معلومة جديدة عن الشركة — مثل عدد الموظفين، نوع المنتجات، التحديات، الأهداف. هذي تحفظ المعلومات عشان تتذكرها في المحادثات القادمة.",
    input_schema: {
      type: "object" as const,
      properties: {
        facts: {
          type: "array",
          items: { type: "string" },
          description:
            "قائمة الحقائق المكتشفة — مثل: 'عندهم 5 موظفين', 'يبيعون أونلاين', 'مشكلتهم الرئيسية التوصيل'",
        },
        sector: {
          type: "string",
          description:
            "القطاع إذا اتضح — مثل: restaurant, clinic, ecommerce, saas",
        },
        companyName: {
          type: "string",
          description: "اسم الشركة إذا ذُكر",
        },
      },
      required: ["facts"],
    },
  },
  {
    name: "suggest_tools",
    description:
      "اقترح أفضل الأدوات والأتمتات حسب قطاع العميل. استخدمها لما العميل يسأل 'وش تقترح؟' أو 'وش أحتاج؟'",
    input_schema: {
      type: "object" as const,
      properties: {
        sector: {
          type: "string",
          description:
            "القطاع — مثل: restaurant, clinic, ecommerce, saas, general",
        },
      },
      required: ["sector"],
    },
  },
  {
    name: "connect_service",
    description:
      "ربط نظام خارجي (مثل Foodics, Shopify, إلخ) بسيادة. استخدمها لما العميل يطلب ربط نظام.",
    input_schema: {
      type: "object" as const,
      properties: {
        piece_name: {
          type: "string",
          description: "اسم النظام — مثل: foodics, shopify, slack",
        },
        display_name: {
          type: "string",
          description: "اسم عرض اختياري للربط",
        },
        connection_config: {
          type: "object" as const,
          description:
            "إعدادات الربط — مثال: {type: 'SECRET_TEXT', value: {secret_text: 'API_KEY'}}",
        },
      },
      required: ["piece_name", "connection_config"],
    },
  },
  {
    name: "test_connection",
    description:
      "اختبر ربط نظام خارجي. استخدمها بعد connect_service للتأكد إن الربط شغّال.",
    input_schema: {
      type: "object" as const,
      properties: {
        connection_id: {
          type: "string",
          description: "معرّف الربط اللي تبي تختبره",
        },
      },
      required: ["connection_id"],
    },
  },
  {
    name: "search_available_systems",
    description:
      "ابحث عن الأنظمة المتاحة للربط (مثل Foodics, Shopify, Slack, إلخ). استخدمها عشان تعرف وش يقدر العميل يربط.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "build_dynamic_flow",
    description:
      "بناء أتمتة ديناميكية مخصصة من أي نظام متاح. هذي تفتح الباب لكل الأنظمة المتاحة مو بس القوالب الجاهزة.",
    input_schema: {
      type: "object" as const,
      properties: {
        display_name: {
          type: "string",
          description: "اسم الأتمتة — اسم فريد يشمل نوع المهمة",
        },
        trigger: {
          type: "object" as const,
          description:
            "المحفّز — مثل: {type: 'webhook'}",
        },
        actions: {
          type: "array" as const,
          items: { type: "object" as const },
          description:
            "قائمة الأفعال — مثل: [{piece: 'gmail', action_name: 'send_email', input: {...}}]",
        },
        connection_ids: {
          type: "object" as const,
          description:
            "معرّفات الربط لكل نظام (اختياري) — مثل: {gmail: 'conn_123'}",
        },
      },
      required: ["display_name", "trigger", "actions"],
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

      const rawConns = connections.ok ? (connections.data?.connections ?? connections.data) : [];
      const connList = Array.isArray(rawConns) ? rawConns : [];
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
      const recipientEmail = (input.recipient_email || input.email || "a@siyadah-ai.com") as string;
      const spreadsheetId = (input.spreadsheet_id || "") as string;

      const healthCheck = await orchestrator.getHealth();
      if (!healthCheck.ok) {
        return JSON.stringify({
          success: false,
          needsSetup: true,
          message: "النظام يحتاج إعداد",
          INSTRUCTION: "النظام غير جاهز. لا تقول 'تم'. قل للعميل: 'النظام يحتاج إعداد بسيط — خلني أجهزه لك وأرجع لك.'",
          plan: {
            name: flowName,
            template,
            description: `بنبني لك "${flowName}" — كل ما يجهز النظام بننفذه فوراً.`,
          },
        });
      }

      const config: Record<string, string> = {};
      if (template.includes("email") || template.includes("notify") || template.includes("report") || template.includes("welcome") || template.includes("support")) {
        config.recipient_email = recipientEmail;
      }
      if (template.includes("sheet") || template.includes("log") || template.includes("lead_notify")) {
        config.spreadsheet_id = spreadsheetId;
      }

      const result = await orchestrator.buildAndDeploy({
        template,
        name: flowName,
        project_id: "ou4jOTA4KMnDrzOVsKWvd",
        connection_ids: {
          gmail: "MKlKHKfL6OwZ7oqt0nt5h",
          "google-sheets": "TtUKW8AMWsMBlY7ayqocf",
          "google-drive": "J0iUwaxY1Hc6vSo3LY6o6",
        },
        config,
      });

      if (!result.ok) {
        return JSON.stringify({
          success: false,
          error: "فشل البناء",
          details: result.error,
          INSTRUCTION: "البناء فشل فعلاً. لا تقول 'تم' أبداً. قل للعميل: 'خلني أجرب طريقة ثانية' أو 'أحتاج إعداد إضافي'. لا تختلق نتائج.",
        });
      }

      const flowId = result.data?.flow_id || result.data?.flow?.id;
      const webhookUrl = result.data?.webhook_url
        || (flowId
          ? `https://activepieces-production-2499.up.railway.app/api/v1/webhooks/${flowId}`
          : null);

      return JSON.stringify({
        success: true,
        message: `تم بناء "${flowName}" بنجاح ✅`,
        flowId,
        link: result.data?.flow?.link,
        webhookUrl,
        nextStep: "قل للعميل: تشيك إيميلك — وصلك تنبيه تجريبي. ثم اقترح الخطوة التالية.",
        INSTRUCTION: `أنت الآن تملك دليل نجاح حقيقي. قل للعميل بالضبط وش اتبنى.${webhookUrl ? ` قل للعميل: "حط هالرابط في نظامك عشان يستقبل البيانات: ${webhookUrl}"` : ""}`,
      });
    }

    case "list_automations": {
      try {
        const flows = await orchestrator.listFlows();

        if (!flows.ok) {
          return JSON.stringify({
            success: false,
            INSTRUCTION: `حصل خطأ من النظام: "${flows.error}". لا تقول 'تم'. قل للعميل: 'واجهنا مشكلة في جلب الأتمتات — خلني أحاول مرة ثانية.'`,
          });
        }

        const rawData = flows.data?.data ?? flows.data;
        const flowList = Array.isArray(rawData) ? rawData : [];

        if (flowList.length === 0) {
          return JSON.stringify({
            success: true,
            automations: [],
            message: "ما فيه موظفين أذكياء مبنيين بعد. تبي أبني لك أول واحد؟",
          });
        }

        return JSON.stringify({
          success: true,
          automations: flowList.map((f: Record<string, unknown>) => ({
            id: f.id,
            name: f.displayName || f.name,
            status: f.status,
            created: f.created,
          })),
          count: flowList.length,
          message: `عندك ${flowList.length} موظف ذكي شغّال`,
        });
      } catch {
        const templates = await orchestrator.getTemplates();
        return JSON.stringify({
          success: true,
          note: "عرض القوالب المتاحة (الأتمتات المبنية غير متاحة حالياً)",
          templates: templates.data?.templates || [],
        });
      }
    }

    case "manage_automation": {
      const flowId = input.flow_id as string;
      const action = input.action as "enable" | "disable" | "delete";
      const result = await orchestrator.manageFlow(flowId, action);

      const actionLabel = action === "enable" ? "تفعيل" : action === "disable" ? "تعطيل" : "حذف";

      if (!result.ok) {
        return JSON.stringify({
          success: false,
          INSTRUCTION: `فشلت عملية ${actionLabel}. الخطأ: "${result.error}". لا تقول 'تم'. قل للعميل: 'ما قدرت أنفذ — ${result.error}'`,
        });
      }

      return JSON.stringify({
        success: true,
        message: `تم ${actionLabel} الموظف الذكي`,
      });
    }

    case "test_automation": {
      const flowId = input.flow_id as string;
      const result = await orchestrator.testFlow(flowId);

      if (!result.ok) {
        return JSON.stringify({
          success: false,
          INSTRUCTION: `الاختبار فشل. الخطأ: "${result.error}". لا تقول 'تم'. قل للعميل: 'الاختبار ما نجح — ممكن فيه مشكلة بالإعدادات.'`,
        });
      }

      return JSON.stringify({
        success: true,
        message: "الاختبار نجح ✅",
      });
    }

    case "extract_facts": {
      const newFacts = input.facts as string[];
      const sector = input.sector as string | undefined;
      const companyName = input.companyName as string | undefined;

      // Dynamic import to avoid circular dependency (claude.ts imports from tools.ts)
      const { updateDNA, getDNA } = await import("@/lib/claude");
      const dna = getDNA();

      const mergedFacts = [...new Set([...dna.facts, ...newFacts])];
      const updates: Record<string, unknown> = { facts: mergedFacts };

      if (sector) updates.sector = sector;
      if (companyName) updates.name = companyName;

      updateDNA(updates);

      return JSON.stringify({
        success: true,
        message: `تم حفظ ${newFacts.length} حقيقة جديدة`,
        totalFacts: mergedFacts.length,
      });
    }

    case "suggest_tools": {
      const sector = (input.sector || "general") as string;
      const { suggestTools } = await import("@/config/tools/tools-selector");
      const suggestions = suggestTools(sector);

      return JSON.stringify({
        sector,
        suggestions: suggestions.map((s) => ({
          template: s.template,
          name: s.name,
          reason: s.reason,
        })),
      });
    }

    case "search_available_systems": {
      const result = await orchestrator.getAvailablePieces();

      if (!result.ok) {
        return JSON.stringify({
          success: false,
          INSTRUCTION: `ما قدرت أجلب الأنظمة المتاحة. الخطأ: "${result.error}". قل للعميل: 'واجهنا مشكلة — خلني أحاول مرة ثانية.'`,
        });
      }

      const pieces = Array.isArray(result.data) ? result.data : [];

      return JSON.stringify({
        success: true,
        count: pieces.length,
        systems: pieces.map((p) => ({
          name: p.name,
          displayName: p.displayName,
          logo: p.logoUrl,
        })),
        INSTRUCTION: `عندنا ${pieces.length} نظام متاح للربط. اعرض للعميل أبرز الأنظمة المناسبة لقطاعه واقترح ربطها.`,
      });
    }

    case "build_dynamic_flow": {
      const displayName = input.display_name as string;
      let trigger = input.trigger as Record<string, unknown>;
      let actions = input.actions as Record<string, unknown>[];
      const connectionIds = input.connection_ids as Record<string, string> | undefined;

      // Safety net: map camelCase → snake_case if Claude ignores description
      if (trigger.pieceName && !trigger.type) {
        trigger = { type: trigger.pieceName };
      }

      actions = actions.map((a) => {
        if (a.pieceName && !a.piece) {
          const { pieceName, actionName, ...rest } = a;
          return {
            ...rest,
            piece: pieceName,
            action_name: typeof actionName === "string" ? actionName.replace(/-/g, "_") : actionName,
          };
        }
        return a;
      });

      const result = await orchestrator.buildDynamicFlow({
        display_name: displayName,
        trigger,
        actions,
        ...(connectionIds && Object.keys(connectionIds).length > 0
          ? { connection_ids: connectionIds }
          : {}),
      });

      if (!result.ok) {
        return JSON.stringify({
          success: false,
          INSTRUCTION: `فشل بناء الأتمتة الديناميكية. الخطأ: "${result.error}". لا تقول 'تم'. قل للعميل: 'واجهنا مشكلة — خلني أجرب طريقة ثانية.'`,
        });
      }

      const dynFlowId = result.data?.flow_id || result.data?.flow?.id;
      const webhookUrl = result.data?.webhook_url
        || (dynFlowId
          ? `https://activepieces-production-2499.up.railway.app/api/v1/webhooks/${dynFlowId}`
          : null);

      return JSON.stringify({
        success: true,
        flowId: dynFlowId,
        webhookUrl,
        status: "deployed",
        INSTRUCTION: `تم بناء "${displayName}" بنجاح ✅${webhookUrl ? ` قل للعميل: "حط هالرابط في نظامك عشان يستقبل البيانات: ${webhookUrl}"` : ""}`,
      });
    }

    case "test_connection": {
      const connectionId = input.connection_id as string;
      const result = await orchestrator.testConnection(connectionId);

      if (!result.ok) {
        return JSON.stringify({
          success: false,
          INSTRUCTION: `الربط فيه مشكلة ❌ الخطأ: "${result.error}". قل للعميل: 'الربط فيه مشكلة — ممكن نحتاج نعيد الربط أو نتحقق من المفتاح.'`,
        });
      }

      return JSON.stringify({
        success: true,
        INSTRUCTION: "الربط شغّال ✅ قل للعميل: 'الربط شغّال وجاهز!'",
      });
    }

    case "connect_service": {
      const pieceName = input.piece_name as string;
      const displayName = input.display_name as string | undefined;
      const connectionConfig = input.connection_config as Record<string, unknown>;

      const result = await orchestrator.connectService({
        piece_name: pieceName,
        display_name: displayName,
        connection_config: connectionConfig,
      });

      if (!result.ok) {
        return JSON.stringify({
          success: false,
          INSTRUCTION: `فشل ربط ${pieceName}. الخطأ: "${result.error}". لا تقول 'تم'. قل للعميل: 'ما قدرت أربط النظام — ${result.error}'`,
        });
      }

      return JSON.stringify({
        success: true,
        connectionId: result.data?.id,
        INSTRUCTION: `تم ربط ${result.data?.displayName || pieceName} ✅ قل للعميل: 'تم ربط ${result.data?.displayName || pieceName} بنجاح!'`,
      });
    }

    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
}

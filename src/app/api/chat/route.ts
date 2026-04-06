import { NextRequest } from "next/server";
import { streamChat, updateDNA, type ChatMessage } from "@/lib/claude";
import { isRateLimited } from "@/lib/rate-limit";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip, 30, 60000)) {
    return new Response(
      JSON.stringify({
        error: "طلبات كثيرة! انتظر شوي وحاول مرة ثانية.",
      }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { messages, companyContext } = await request.json();

    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid messages format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (companyContext) {
      updateDNA(companyContext);
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamChat(
            messages as ChatMessage[]
          )) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`)
            );
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          const msg =
            error instanceof Error
              ? error.message
              : "صار شي غير متوقع. فريقنا بيتابع الموضوع.";
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: msg })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    return new Response(
      JSON.stringify({
        error: "صار شي غير متوقع. فريقنا بيتابع الموضوع.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

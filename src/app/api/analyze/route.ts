import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { ANALYSIS_PROMPT } from "@/config/prompts/analysis-prompt";
import { isRateLimited } from "@/lib/rate-limit";
import { generateId } from "@/lib/utils";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip, 10, 60000)) {
    return NextResponse.json(
      { error: "طلبات كثيرة! انتظر دقيقة وحاول مرة ثانية." },
      { status: 429 }
    );
  }

  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "الرابط مطلوب" },
        { status: 400 }
      );
    }

    const firecrawlKey = process.env.FIRECRAWL_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (!firecrawlKey || !anthropicKey) {
      return NextResponse.json(
        { error: "Missing API configuration" },
        { status: 500 }
      );
    }

    const scrapeResponse = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${firecrawlKey}`,
      },
      body: JSON.stringify({
        url,
        formats: ["markdown"],
        onlyMainContent: true,
      }),
    });

    if (!scrapeResponse.ok) {
      return NextResponse.json(
        {
          error:
            "ما قدرنا نحلل الموقع — ممكن يكون محمي. عطنا وصف بسيط لعملك.",
        },
        { status: 422 }
      );
    }

    const scrapeData = await scrapeResponse.json();
    const siteContent =
      scrapeData.data?.markdown || scrapeData.data?.content || "";

    const anthropic = new Anthropic({ apiKey: anthropicKey });

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `URL: ${url}\n\nمحتوى الموقع:\n${siteContent.slice(0, 15000)}\n\n${ANALYSIS_PROMPT}`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    const rawText = textBlock ? textBlock.text : "";

    let analysis;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      analysis = null;
    }

    if (!analysis) {
      return NextResponse.json(
        { error: "التحليل أخذ وقت أطول من المتوقع. نحاول مرة ثانية؟" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: generateId(),
      url,
      timestamp: new Date().toISOString(),
      ...analysis,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    if (message.includes("timeout") || message.includes("AbortError")) {
      return NextResponse.json(
        { error: "التحليل أخذ وقت أطول من المتوقع. نحاول مرة ثانية؟" },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: "صار شي غير متوقع. فريقنا بيتابع الموضوع." },
      { status: 500 }
    );
  }
}

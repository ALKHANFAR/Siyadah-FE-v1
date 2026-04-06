"use client";

import { useState, useCallback } from "react";
import { AiAssistantChat, type ChatMessage } from "@/components/ui/ai-assistant-chat";
import { toast } from "sonner";
import { generateId } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

const SUGGESTIONS = [
  { label: "حلل موقعي", onClick: () => {} },
  { label: "ابني لي تنبيه للعملاء الجدد", onClick: () => {} },
  { label: "وش الأدوات المتاحة؟", onClick: () => {} },
  { label: "فعّل التنبيهات الذكية", onClick: () => {} },
  { label: "كيف حالة النظام؟", onClick: () => {} },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    async (text?: string) => {
      const content = text || input.trim();
      if (!content || isLoading) return;

      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      trackEvent("chat_message_sent");
      setInput("");
      setIsLoading(true);

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      try {
        const allMessages = [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        let companyContext;
        const keys = Object.keys(sessionStorage);
        const reportKey = keys.find((k) => k.startsWith("report-"));
        if (reportKey) {
          try {
            const report = JSON.parse(sessionStorage.getItem(reportKey) || "");
            if (report.company) {
              companyContext = {
                name: report.company.name,
                sector: report.company.sector,
                country: report.company.country,
                strengths: report.dna?.strengths || [],
                painPoints: report.dna?.painPoints || [],
                opportunities: report.dna?.opportunities || [],
                healthScore: report.healthScore || 0,
              };
            }
          } catch {
            // No valid report data
          }
        }

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: allMessages, companyContext }),
        });

        if (!res.ok) {
          throw new Error("Chat request failed");
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No reader");

        const decoder = new TextDecoder();
        let fullText = "";
        let sseBuffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          sseBuffer += chunk;
          const lines = sseBuffer.split("\n");
          sseBuffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;

              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  fullText += parsed.text;
                  setMessages((prev) => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    if (last && last.role === "assistant") {
                      updated[updated.length - 1] = {
                        ...last,
                        content: fullText,
                      };
                    }
                    return updated;
                  });
                }
                if (parsed.error) {
                  fullText = parsed.error;
                  setMessages((prev) => {
                    const updated = [...prev];
                    const last = updated[updated.length - 1];
                    if (last && last.role === "assistant") {
                      updated[updated.length - 1] = {
                        ...last,
                        content: fullText,
                      };
                    }
                    return updated;
                  });
                }
              } catch (e) {
                console.warn("[SSE] Malformed data, buffering:", data?.substring(0, 50));
              }
            }
          }
        }
      } catch {
        toast.error("انقطع الاتصال — حاول مرة ثانية");
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.role === "assistant") {
            updated[updated.length - 1] = {
              ...last,
              content: "انقطع الاتصال — نحاول نرجعه...",
            };
          }
          return updated;
        });
      }

      setIsLoading(false);
    },
    [input, isLoading, messages]
  );

  const suggestions = SUGGESTIONS.map((s) => ({
    ...s,
    onClick: () => sendMessage(s.label),
  }));

  return (
    <div className="flex h-[calc(100vh-4rem)] lg:h-screen flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3 lg:px-6">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            Chat with Siyadah
          </h1>
          <p className="text-xs text-muted-foreground">
            Your AI business consultant
          </p>
        </div>
      </div>

      <AiAssistantChat
        messages={messages}
        input={input}
        onInputChange={setInput}
        onSend={() => sendMessage()}
        isLoading={isLoading}
        suggestions={suggestions}
        className="flex-1"
      />
    </div>
  );
}

"use client";

import { useRef, useEffect } from "react";
import { Send, Loader2, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Suggestion {
  label: string;
  onClick: () => void;
}

interface AiAssistantChatProps {
  messages: ChatMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  suggestions?: Suggestion[];
  className?: string;
}

export function AiAssistantChat({
  messages,
  input,
  onInputChange,
  onSend,
  isLoading,
  suggestions = [],
  className = "",
}: AiAssistantChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 lg:px-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
              <Bot className="h-8 w-8 text-accent" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground">
                أهلاً! أنا سيادة
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-md">
                مستشارك الذكي لأتمتة أعمالك. اسألني أي شي عن شركتك وأنا أساعدك.
              </p>
            </div>
            {suggestions.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={s.onClick}
                    className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-all hover:border-accent/50 hover:text-foreground hover:bg-accent/5"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                      <Bot className="h-4 w-4 text-accent" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-accent text-white"
                        : "bg-card border border-border text-foreground"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    {msg.role === "assistant" &&
                      isLoading &&
                      msg === messages[messages.length - 1] &&
                      !msg.content && (
                        <div className="flex items-center gap-1">
                          <span className="h-2 w-2 animate-bounce rounded-full bg-accent/60 [animation-delay:0ms]" />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-accent/60 [animation-delay:150ms]" />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-accent/60 [animation-delay:300ms]" />
                        </div>
                      )}
                  </div>
                  {msg.role === "user" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground/10">
                      <User className="h-4 w-4 text-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="border-t border-border p-4 lg:px-6">
        <div className="mx-auto flex max-w-3xl items-end gap-3">
          <textarea
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="اكتب رسالتك..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder-muted-foreground outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/25"
            dir="rtl"
          />
          <button
            onClick={onSend}
            disabled={!input.trim() || isLoading}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-white transition-all hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

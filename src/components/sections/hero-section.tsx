"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { VapourText } from "@/components/ui/vapour-text";
import { PulseBeamsCTA } from "@/components/ui/pulse-beams-cta";
import { CalendarCTA } from "@/components/ui/calendar-cta";
import { isValidUrl, normalizeUrl, generateId } from "@/lib/utils";

const SpiralAnimation = dynamic(
  () =>
    import("@/components/ui/spiral-animation").then((m) => ({
      default: m.SpiralAnimation,
    })),
  { ssr: false }
);

export function HeroSection() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyze() {
    const normalized = normalizeUrl(url.trim());
    if (!isValidUrl(normalized)) {
      setError("Please enter a valid URL (e.g. https://example.com)");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalized }),
      });

      if (!res.ok) throw new Error("Analysis failed");

      const data = await res.json();
      const reportId = data.id || generateId();

      sessionStorage.setItem(`report-${reportId}`, JSON.stringify(data));
      router.push(`/report/${reportId}`);
    } catch {
      setError("Could not analyze this website. Please try again.");
      setLoading(false);
    }
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-16">
      <SpiralAnimation />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm text-accent"
        >
          <Sparkles size={14} />
          AI-Powered Company OS
        </motion.div>

        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          <VapourText text="Your Company," className="text-foreground" />
          <br />
          <VapourText
            text="On Autopilot"
            className="text-accent"
            delay={0.3}
          />
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
        >
          Paste your website URL and watch Siyadah analyze your business,
          find gaps, and build automations — in under 60 seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mx-auto mt-10 max-w-xl"
        >
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-card/80 p-2 backdrop-blur-sm focus-within:border-accent/50 transition-colors">
            <Search size={20} className="ml-3 shrink-0 text-muted-foreground" />
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              placeholder="Paste your website URL..."
              className="flex-1 bg-transparent px-2 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none"
              disabled={loading}
            />
            <PulseBeamsCTA
              onClick={handleAnalyze}
              loading={loading}
              disabled={!url.trim()}
              className="!px-6 !py-3 !text-sm"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </PulseBeamsCTA>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-sm text-error"
            >
              {error}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="mt-6 flex items-center justify-center gap-4"
        >
          <CalendarCTA label="Book a Demo" href="#" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mt-12 flex items-center justify-center gap-8 text-xs text-muted-foreground"
        >
          <span>No sign-up required</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground" />
          <span>Free analysis</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground" />
          <span>Results in 60 seconds</span>
        </motion.div>
      </div>
    </section>
  );
}

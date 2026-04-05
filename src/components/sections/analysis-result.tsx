"use client";

import { motion } from "framer-motion";
import { AlertTriangle, TrendingUp, Lightbulb, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SpotlightCard } from "@/components/ui/spotlight-card";

export interface AnalysisData {
  company: {
    name: string;
    sector: string;
    country: string;
    city: string;
    currency: string;
    languages: string[];
  };
  dna: {
    strengths: string[];
    painPoints: string[];
    opportunities: string[];
  };
  healthScore: number;
  healthBreakdown: {
    digitalPresence: number;
    customerComm: number;
    automation: number;
    marketing: number;
    sales: number;
  };
  gaps: {
    title: string;
    description: string;
    severity: "high" | "medium" | "low";
    solution: string;
  }[];
  urgentActions: string[];
}

interface AnalysisResultProps {
  data: AnalysisData;
}

const SEVERITY_STYLES = {
  high: "border-error/30 bg-error/5 text-error",
  medium: "border-warning/30 bg-warning/5 text-warning",
  low: "border-accent/30 bg-accent/5 text-accent",
};

function HealthScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 60;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 70 ? "var(--success)" : score >= 40 ? "var(--warning)" : "var(--error)";

  return (
    <div className="relative flex h-40 w-40 items-center justify-center">
      <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 140 140">
        <circle
          cx="70"
          cy="70"
          r="60"
          fill="none"
          stroke="var(--border)"
          strokeWidth="8"
        />
        <motion.circle
          cx="70"
          cy="70"
          r="60"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="text-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-3xl font-bold text-foreground"
        >
          {score}
        </motion.span>
        <span className="block text-xs text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

export function AnalysisResult({ data }: AnalysisResultProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <SpotlightCard className="lg:col-span-2 p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <HealthScoreRing score={data.healthScore} />
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {data.company.name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {data.company.sector} &middot; {data.company.city},{" "}
                {data.company.country}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {data.dna.strengths.slice(0, 3).map((s, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-success/20 bg-success/5 px-3 py-1 text-xs text-success"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Health Breakdown
          </h3>
          <div className="mt-4 space-y-3">
            {Object.entries(data.healthBreakdown).map(([key, val]) => (
              <div key={key}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span className="text-foreground">{val}%</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${val}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SpotlightCard>
      </div>

      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <AlertTriangle size={20} className="text-warning" />
          Gaps Found
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {data.gaps.map((gap, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-xl border p-4 ${SEVERITY_STYLES[gap.severity]}`}
            >
              <h4 className="font-medium">{gap.title}</h4>
              <p className="mt-1 text-xs opacity-80">{gap.description}</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-medium">
                <Lightbulb size={12} />
                {gap.solution}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <TrendingUp size={20} className="text-success" />
          Opportunities
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.dna.opportunities.map((opp, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card/50 p-4 text-sm text-muted-foreground"
            >
              {opp}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3 text-sm font-medium text-white transition-all hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/25"
        >
          Go to Dashboard
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

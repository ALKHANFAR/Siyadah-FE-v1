"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Bot,
  Zap,
  DollarSign,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { CursorWanderCard } from "@/components/ui/cursor-wander-card";
import { StatusBadge } from "@/components/ui/item-overflow-badge";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { EmptyState } from "@/components/ui/empty-state";
import { SkeletonCard } from "@/components/ui/skeleton";
import { getDashboardProducts } from "@/config/products-catalog";

interface AgentInfo {
  id: string;
  name: string;
  status: "active" | "inactive" | "error";
  type: string;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [hasAnalysis, setHasAnalysis] = useState(false);

  useEffect(() => {
    const keys = Object.keys(sessionStorage);
    const reportKeys = keys.filter((k) => k.startsWith("report-"));
    setHasAnalysis(reportKeys.length > 0);

    async function fetchAgents() {
      try {
        const orchestratorUrl = process.env.NEXT_PUBLIC_ORCHESTRATOR_URL;
        if (!orchestratorUrl) {
          setLoading(false);
          return;
        }
        const res = await fetch(`${orchestratorUrl}/templates`);
        if (res.ok) {
          const data = await res.json();
          const mapped = (data.flows || data || []).map(
            (f: { id: string; name: string; status: string }) => ({
              id: f.id,
              name: f.name || "Unnamed Agent",
              status: f.status === "ENABLED" ? "active" : "inactive",
              type: "automation",
            })
          );
          setAgents(mapped);
        }
      } catch {
        // Orchestrator not available — show empty state
      }
      setLoading(false);
    }

    fetchAgents();
  }, []);

  const products = getDashboardProducts();
  const activeCount = agents.filter((a) => a.status === "active").length;

  if (!hasAnalysis && !loading) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[calc(100vh-4rem)]">
        <EmptyState
          title="Welcome to Siyadah AI"
          description="Start by analyzing your website to unlock your personalized dashboard with KPIs, AI employees, and automation insights."
          action={{
            label: "Analyze Your Website",
            onClick: () => (window.location.href = "/"),
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your business at a glance
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <CursorWanderCard
              title="Improvement"
              value="+23%"
              change="Since last month"
              changeType="positive"
              icon={<TrendingUp size={20} />}
            />
            <CursorWanderCard
              title="AI Employees"
              value={`${activeCount}/${agents.length || 6}`}
              change={`${activeCount} active`}
              changeType="positive"
              icon={<Bot size={20} />}
            />
            <CursorWanderCard
              title="Tasks Executed"
              value="147"
              change="+12 today"
              changeType="positive"
              icon={<Zap size={20} />}
            />
            <CursorWanderCard
              title="Cost Savings"
              value="~12,000 SAR"
              change="Estimated monthly"
              changeType="neutral"
              icon={<DollarSign size={20} />}
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SpotlightCard className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              AI Employees
            </h2>
            <Link
              href="/dashboard/chat"
              className="flex items-center gap-1 text-sm text-accent hover:underline"
            >
              Build new <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
                    <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                  </div>
                  <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
                </div>
              ))}
            </div>
          ) : agents.length > 0 ? (
            <div className="space-y-2">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between rounded-xl border border-border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <Bot size={16} />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {agent.name}
                    </span>
                  </div>
                  <StatusBadge
                    status={agent.status}
                    label={agent.status === "active" ? "Active" : "Inactive"}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No AI employees yet. Start chatting with Siyadah to build your
              first one.
            </div>
          )}
        </SpotlightCard>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/dashboard/chat"
              className="flex items-center gap-3 rounded-2xl border border-accent/20 bg-accent/5 p-4 transition-all hover:bg-accent/10 hover:border-accent/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white">
                <MessageSquare size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Chat with Siyadah
                </h3>
                <p className="text-xs text-muted-foreground">
                  Build automations, get insights
                </p>
              </div>
              <ArrowRight size={16} className="ml-auto text-accent" />
            </Link>
          </motion.div>

          {products.length > 0 && (
            <div className="rounded-2xl border border-border bg-card/50 p-4">
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                Available Products
              </h3>
              <div className="space-y-2">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 rounded-xl p-2 text-sm transition-colors hover:bg-muted/50"
                  >
                    <span className="text-lg">{product.icon}</span>
                    <div>
                      <p className="font-medium text-foreground">
                        {product.nameEn}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.taglineAr}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import {
  Scan,
  Brain,
  Zap,
  BarChart3,
  Shield,
  Rocket,
} from "lucide-react";
import { RadialTimeline, type TimelineItem } from "@/components/ui/radial-timeline";

const FEATURES: TimelineItem[] = [
  {
    title: "Instant Analysis",
    description:
      "Paste your URL and get a complete business health report in under 60 seconds. We scan your website, identify gaps, and map your customer journey.",
    icon: <Scan size={24} />,
  },
  {
    title: "AI Business Consultant",
    description:
      "Chat with Siyadah in Arabic — your AI consultant that understands your industry, speaks your language, and suggests real solutions.",
    icon: <Brain size={24} />,
  },
  {
    title: "One-Click Automations",
    description:
      "Build smart employees that work 24/7. Email alerts, lead tracking, auto-replies — activated with a single click.",
    icon: <Zap size={24} />,
  },
  {
    title: "Real-Time KPIs",
    description:
      "Track improvement percentage, active AI employees, executed tasks, and estimated cost savings — all in one dashboard.",
    icon: <BarChart3 size={24} />,
  },
  {
    title: "600+ Integrations",
    description:
      "Connect Gmail, Google Sheets, Telegram, WhatsApp, and 600+ other tools. Free tools first — 76% of our catalog is free.",
    icon: <Shield size={24} />,
  },
  {
    title: "Progressive Intelligence",
    description:
      "Siyadah gets smarter over time. It learns your business, anticipates your needs, and proactively suggests improvements.",
    icon: <Rocket size={24} />,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything Your Business Needs
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            From analysis to automation — Siyadah handles it all so you can
            focus on growing your business.
          </p>
        </motion.div>

        <RadialTimeline items={FEATURES} className="mt-16" />
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import {
  AnimatedPricing,
  type PricingPlan,
} from "@/components/ui/animated-pricing";

const PLANS: PricingPlan[] = [
  {
    name: "Explore",
    price: "Free",
    period: "",
    description: "Try Siyadah with a free business analysis",
    features: [
      "1 website analysis",
      "Health score report",
      "Gap identification",
      "Basic recommendations",
    ],
    cta: "Start Free",
  },
  {
    name: "Basic",
    price: "199 SAR",
    period: "mo",
    description: "Essential automations for small businesses",
    features: [
      "Everything in Explore",
      "3 AI employees",
      "Email alerts",
      "Lead tracking",
      "Chat with Siyadah",
    ],
    cta: "Get Started",
  },
  {
    name: "Growth",
    price: "499 SAR",
    period: "mo",
    description: "Scale your operations with smart automation",
    features: [
      "Everything in Basic",
      "10 AI employees",
      "Competitor radar",
      "Review guardian",
      "Weekly reports",
      "Priority support",
    ],
    highlighted: true,
    cta: "Start Growing",
  },
  {
    name: "Professional",
    price: "999 SAR",
    period: "mo",
    description: "Full AI-powered business operations",
    features: [
      "Everything in Growth",
      "Unlimited AI employees",
      "Supplier finder",
      "Advanced analytics",
      "Custom integrations",
      "Dedicated consultant",
    ],
    cta: "Go Pro",
  },
  {
    name: "Enterprise",
    price: "2,500+ SAR",
    period: "mo",
    description: "Custom solutions for large organizations",
    features: [
      "Everything in Professional",
      "Multi-branch support",
      "Custom AI training",
      "SLA guarantee",
      "On-premise option",
      "White-label available",
    ],
    cta: "Contact Sales",
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Start free, upgrade when you&apos;re ready. No hidden fees, no
            long-term contracts.
          </p>
        </motion.div>

        <div className="mt-16">
          <AnimatedPricing plans={PLANS} />
        </div>
      </div>
    </section>
  );
}

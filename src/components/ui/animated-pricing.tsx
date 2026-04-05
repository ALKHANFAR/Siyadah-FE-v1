"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

interface AnimatedPricingProps {
  plans: PricingPlan[];
}

export function AnimatedPricing({ plans }: AnimatedPricingProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {plans.map((plan, i) => (
        <motion.div
          key={plan.name}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          className={`relative flex flex-col rounded-2xl border p-6 backdrop-blur-sm transition-all hover:border-accent/50 ${
            plan.highlighted
              ? "border-accent bg-accent/5 shadow-lg shadow-accent/10"
              : "border-border bg-card/50"
          }`}
        >
          {plan.highlighted && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-medium text-white">
              Most Popular
            </div>
          )}

          <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>

          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-foreground">{plan.price}</span>
            {plan.period && (
              <span className="text-sm text-muted-foreground">/{plan.period}</span>
            )}
          </div>

          <ul className="mt-6 flex-1 space-y-3">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <Check size={16} className="mt-0.5 shrink-0 text-success" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            className={`mt-6 w-full rounded-lg py-2.5 text-sm font-medium transition-all ${
              plan.highlighted
                ? "bg-accent text-white hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/25"
                : "bg-card text-foreground border border-border hover:border-accent/50 hover:bg-accent/5"
            }`}
          >
            {plan.cta}
          </button>
        </motion.div>
      ))}
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

export interface TimelineItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface RadialTimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function RadialTimeline({ items, className = "" }: RadialTimelineProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/20 to-transparent" />

      <div className="space-y-8 lg:space-y-16">
        {items.map((item, i) => {
          const isLeft = i % 2 === 0;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative flex flex-col lg:flex-row items-center gap-6 ${
                isLeft ? "lg:flex-row" : "lg:flex-row-reverse"
              }`}
            >
              <div
                className={`flex-1 ${isLeft ? "lg:text-right" : "lg:text-left"}`}
              >
                <h3 className="text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-accent">
                {item.icon}
              </div>

              <div className="flex-1 lg:block hidden" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

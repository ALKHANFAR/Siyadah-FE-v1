"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface StickyScrollItem {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface StickyScrollProps {
  items: StickyScrollItem[];
}

export function StickyScroll({ items }: StickyScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="relative">
      {items.map((item, i) => {
        const progress = useTransform(
          scrollYProgress,
          [i / items.length, (i + 1) / items.length],
          [0, 1]
        );
        const opacity = useTransform(progress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
        const y = useTransform(progress, [0, 0.3, 0.7, 1], [60, 0, 0, -60]);

        return (
          <motion.div
            key={i}
            style={{ opacity, y }}
            className="sticky top-1/3 flex flex-col items-center py-20 text-center"
          >
            {item.icon && (
              <div className="mb-4 text-accent">{item.icon}</div>
            )}
            <h3 className="text-2xl font-bold text-foreground">{item.title}</h3>
            <p className="mt-3 max-w-md text-muted-foreground">
              {item.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

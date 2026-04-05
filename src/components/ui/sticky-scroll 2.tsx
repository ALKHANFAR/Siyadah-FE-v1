"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export interface ScrollSection {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
}

interface StickyScrollProps {
  sections: ScrollSection[];
  className?: string;
}

export function StickyScroll({ sections, className = "" }: StickyScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {sections.map((section, i) => {
        const start = i / sections.length;
        const end = (i + 1) / sections.length;

        return (
          <StickySection
            key={section.id}
            section={section}
            progress={scrollYProgress}
            start={start}
            end={end}
          />
        );
      })}
    </div>
  );
}

function StickySection({
  section,
  progress,
  start,
  end,
}: {
  section: ScrollSection;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  start: number;
  end: number;
}) {
  const opacity = useTransform(progress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0]);

  return (
    <motion.div
      style={{ opacity }}
      className="sticky top-0 flex min-h-screen items-center justify-center px-4"
    >
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
        <div>
          <h3 className="text-2xl font-bold text-foreground">{section.title}</h3>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {section.description}
          </p>
        </div>
        <div>{section.content}</div>
      </div>
    </motion.div>
  );
}

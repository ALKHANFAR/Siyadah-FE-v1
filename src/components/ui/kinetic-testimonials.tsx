"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar?: string;
}

interface KineticTestimonialsProps {
  testimonials: Testimonial[];
  className?: string;
}

export function KineticTestimonials({
  testimonials,
  className = "",
}: KineticTestimonialsProps) {
  return (
    <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {testimonials.map((t, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          whileHover={{ y: -4 }}
          className="relative flex flex-col rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm"
        >
          <Quote size={24} className="mb-4 text-accent/30" />
          <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
            &ldquo;{t.content}&rdquo;
          </p>
          <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
              {t.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground">
                {t.role}, {t.company}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

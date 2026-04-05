"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AnnouncementBannerProps {
  message: string;
  link?: { label: string; href: string };
}

export function AnnouncementBanner({ message, link }: AnnouncementBannerProps) {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="relative overflow-hidden bg-accent/10 border-b border-accent/20"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2.5 text-sm">
            <span className="text-muted-foreground">{message}</span>
            {link && (
              <a
                href={link.href}
                className="font-medium text-accent transition-colors hover:text-accent/80"
              >
                {link.label} &rarr;
              </a>
            )}
            <button
              onClick={() => setVisible(false)}
              className="absolute right-4 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

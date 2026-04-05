"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, AlertTriangle, Info } from "lucide-react";

type StatusType = "success" | "error" | "warning" | "info";

interface HudStatusProps {
  type: StatusType;
  message: string;
  detail?: string;
  className?: string;
}

const STATUS_CONFIG: Record<StatusType, { icon: typeof CheckCircle2; color: string; bg: string; border: string }> = {
  success: {
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success/5",
    border: "border-success/20",
  },
  error: {
    icon: AlertCircle,
    color: "text-error",
    bg: "bg-error/5",
    border: "border-error/20",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning/5",
    border: "border-warning/20",
  },
  info: {
    icon: Info,
    color: "text-accent",
    bg: "bg-accent/5",
    border: "border-accent/20",
  },
};

export function HudStatus({ type, message, detail, className = "" }: HudStatusProps) {
  const config = STATUS_CONFIG[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 rounded-xl border ${config.border} ${config.bg} p-4 ${className}`}
    >
      <Icon size={18} className={`mt-0.5 shrink-0 ${config.color}`} />
      <div>
        <p className={`text-sm font-medium ${config.color}`}>{message}</p>
        {detail && (
          <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
        )}
      </div>
    </motion.div>
  );
}

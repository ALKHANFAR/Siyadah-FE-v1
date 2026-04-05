"use client";

interface BadgeProps {
  status: "active" | "inactive" | "pending" | "error";
  label: string;
  className?: string;
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  inactive: "bg-muted text-muted-foreground border-border",
  pending: "bg-warning/10 text-warning border-warning/20",
  error: "bg-error/10 text-error border-error/20",
};

export function StatusBadge({ status, label, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]} ${className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "active"
            ? "bg-success animate-pulse"
            : status === "error"
              ? "bg-error"
              : status === "pending"
                ? "bg-warning"
                : "bg-muted-foreground"
        }`}
      />
      {label}
    </span>
  );
}

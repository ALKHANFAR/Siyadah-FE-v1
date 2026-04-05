"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { Building2 } from "lucide-react";

export default function DepartmentPage() {
  return (
    <div className="flex items-center justify-center p-8 min-h-[calc(100vh-4rem)]">
      <EmptyState
        icon={<Building2 size={28} className="text-muted-foreground" />}
        title="Departments — Coming in Sprint 2"
        description="Department-specific views with tailored KPIs, tools, and automations for each part of your business."
      />
    </div>
  );
}

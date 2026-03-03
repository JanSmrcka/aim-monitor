"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  company: "border-sky-300/30 bg-sky-300/10 text-sky-100",
  person: "border-teal-300/30 bg-teal-300/10 text-teal-100",
  topic: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
  product: "border-amber-300/30 bg-amber-300/10 text-amber-100",
  ticker: "border-orange-300/30 bg-orange-300/10 text-orange-100",
};

interface EntityBadgeProps {
  type: string;
  name: string;
}

export function EntityBadge({ type, name }: EntityBadgeProps) {
  return (
    <Badge
      data-testid="entity-badge"
      variant="outline"
      className={cn(
        "max-w-full gap-1 border text-xs whitespace-normal break-words overflow-visible",
        colorMap[type] ?? ""
      )}
    >
      <span className="shrink-0 text-[9px] uppercase tracking-[0.14em] opacity-70">{type}</span>
      <span className="min-w-0 break-words">{name}</span>
    </Badge>
  );
}

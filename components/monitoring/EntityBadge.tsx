"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  company: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  person: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  topic: "bg-green-500/20 text-green-400 border-green-500/30",
  product: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  ticker: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
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
      className={cn("gap-1", colorMap[type] ?? "")}
    >
      <span className="text-[10px] opacity-70">{type}</span>
      {name}
    </Badge>
  );
}

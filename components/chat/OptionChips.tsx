"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Activity,
  BarChart3,
  BookOpen,
  Building2,
  Check,
  Coins,
  FileText,
  Globe,
  Newspaper,
  Rss,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

interface Option {
  label: string;
  value: string;
  description?: string;
  icon?: string;
}

interface OptionChipsProps {
  question: string;
  options: Option[];
  onSelect: (value: string) => void;
  disabled: boolean;
  allowMultiple?: boolean;
  isAgentBusy?: boolean;
}

const optionIconMap = {
  activity: Activity,
  ai: Activity,
  barchart: BarChart3,
  barchart3: BarChart3,
  chart: BarChart3,
  chartline: BarChart3,
  code: FileText,
  company: Building2,
  defi: Coins,
  exchange: Building2,
  gas: Activity,
  globe: Globe,
  news: Newspaper,
  papers: BookOpen,
  person: Users,
  price: TrendingUp,
  research: BookOpen,
  rss: Rss,
  security: ShieldCheck,
  settings: Settings,
  social: Users,
  staking: Coins,
  ticker: TrendingUp,
  topic: Globe,
  trend: TrendingUp,
  trendingup: TrendingUp,
  volatility: Activity,
  web: Globe,
} as const;

function normalizeIconToken(value: string): string {
  return value.toLowerCase().trim().replace(/[:_\-\s]+/g, "");
}

function renderOptionIcon(icon?: string) {
  if (!icon) return null;
  const raw = icon.trim();
  if (!raw) return null;

  const Icon = optionIconMap[normalizeIconToken(raw) as keyof typeof optionIconMap];
  if (Icon) {
    return <Icon className="h-3.5 w-3.5 opacity-90" />;
  }

  if (/^[a-z0-9:_\-\s]+$/i.test(raw)) {
    return null;
  }

  return <span className="text-sm leading-none opacity-90">{raw}</span>;
}

export function OptionChips({
  question,
  options,
  onSelect,
  disabled,
  allowMultiple,
  isAgentBusy = false,
}: OptionChipsProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const handleClick = (value: string) => {
    if (disabled) return;
    if (allowMultiple) {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(value)) next.delete(value);
        else next.add(value);
        return next;
      });
    } else {
      onSelect(value);
    }
  };

  const handleConfirm = () => {
    if (disabled) return;
    onSelect(Array.from(selected).join(", "));
  };

  return (
    <div className="space-y-2.5 rounded-xl border border-zinc-700/70 bg-zinc-900/60 p-2.5">
      <p className="text-sm font-medium text-zinc-200">{question}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selected.has(opt.value);

          return (
            <Button
              key={opt.value}
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => handleClick(opt.value)}
              title={opt.description}
              aria-pressed={isSelected}
              className={
                isSelected
                  ? "h-auto rounded-xl border-amber-300 bg-amber-300/28 px-3 py-2 text-amber-50 shadow-[inset_0_0_0_1px_rgba(251,191,36,0.35),0_0_0_1px_rgba(251,191,36,0.2)] hover:bg-amber-300/35"
                  : "h-auto rounded-xl border-zinc-600 bg-zinc-900/85 px-3 py-2 text-zinc-200 hover:border-amber-300/35 hover:bg-zinc-800"
              }
            >
              <span className="inline-flex items-center gap-1.5 text-sm">
                {renderOptionIcon(opt.icon)}
                {opt.label}
              </span>
              {isSelected ? <Check className="h-3.5 w-3.5 text-amber-100" /> : null}
            </Button>
          );
        })}
      </div>
      {isAgentBusy ? (
        <p className="text-xs text-zinc-400">Wait for response to finish before choosing.</p>
      ) : null}
      {allowMultiple && selected.size > 0 && (
        <Button
          size="sm"
          onClick={handleConfirm}
          disabled={disabled}
          className="rounded-lg bg-amber-300 text-zinc-950 hover:bg-amber-200"
        >
          Confirm selection ({selected.size})
        </Button>
      )}
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

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
        {options.map((opt) => (
          <Button
            key={opt.value}
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => handleClick(opt.value)}
            title={opt.description}
            className={
              selected.has(opt.value)
                ? "h-auto rounded-xl border-amber-300/55 bg-amber-300/18 px-3 py-2 text-zinc-50 hover:bg-amber-300/24"
                : "h-auto rounded-xl border-zinc-600 bg-zinc-900/85 px-3 py-2 text-zinc-200 hover:border-amber-300/35 hover:bg-zinc-800"
            }
          >
            <span className="inline-flex items-center gap-1.5 text-sm">
              {opt.icon ? <span className="text-sm leading-none opacity-90">{opt.icon}</span> : null}
              {opt.label}
            </span>
          </Button>
        ))}
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

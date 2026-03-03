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
}

export function OptionChips({
  question,
  options,
  onSelect,
  disabled,
  allowMultiple,
}: OptionChipsProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const handleClick = (value: string) => {
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
    onSelect(Array.from(selected).join(", "));
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">{question}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <Button
            key={opt.value}
            variant={selected.has(opt.value) ? "default" : "outline"}
            size="sm"
            disabled={disabled}
            onClick={() => handleClick(opt.value)}
            title={opt.description}
          >
            {opt.label}
          </Button>
        ))}
      </div>
      {allowMultiple && selected.size > 0 && (
        <Button size="sm" onClick={handleConfirm} disabled={disabled}>
          Confirm
        </Button>
      )}
    </div>
  );
}

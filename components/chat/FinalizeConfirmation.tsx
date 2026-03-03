"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";

const SUMMARY_LABELS = [
  "Title",
  "Scope",
  "Entities tracked",
  "Sources",
  "Frequency",
  "Keywords",
  "Filters",
] as const;

type SummarySection = {
  label: string;
  value: string;
};

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseSummarySections(summary: string): SummarySection[] {
  const compact = summary.replace(/\s+/g, " ").trim();
  if (!compact) return [];

  const labelPattern = SUMMARY_LABELS.map(escapeRegex).join("|");
  const regex = new RegExp(`(${labelPattern})\\s*:`, "gi");
  const matches = Array.from(compact.matchAll(regex));

  if (matches.length === 0) {
    return [{ label: "Summary", value: compact }];
  }

  const sections: SummarySection[] = [];
  for (let i = 0; i < matches.length; i += 1) {
    const match = matches[i];
    const next = matches[i + 1];
    const label = match[1];
    const valueStart = (match.index ?? 0) + match[0].length;
    const valueEnd = next?.index ?? compact.length;
    const value = compact.slice(valueStart, valueEnd).trim();
    if (!value) continue;
    sections.push({ label, value });
  }

  return sections.length > 0 ? sections : [{ label: "Summary", value: compact }];
}

function parseSectionItems(label: string, value: string): string[] {
  if (label === "Entities tracked") {
    return value
      .split(/\s+-\s+/)
      .map((item) => item.trim().replace(/^-+\s*/, ""))
      .filter((item) => item.length > 0);
  }

  if (label === "Keywords" || label === "Sources") {
    return value
      .split(/\s*,\s*/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  if (label === "Filters") {
    return value
      .split(/\s*;\s*/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  return [];
}

interface FinalizeConfirmationProps {
  summary: string;
  onConfirm: () => void;
  onDismiss: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function FinalizeConfirmation({
  summary,
  onConfirm,
  onDismiss,
  isLoading,
  disabled = false,
}: FinalizeConfirmationProps) {
  const actionsDisabled = isLoading || disabled;
  const sections = parseSummarySections(summary);

  return (
    <div className="rounded-xl border border-amber-300/35 bg-gradient-to-br from-amber-300/10 to-zinc-900/70 p-3">
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-amber-300/40 bg-amber-300/20">
          <CheckCircle className="h-4 w-4 text-amber-200" />
        </span>
        <div>
          <p className="text-sm font-semibold text-amber-100">Ready to create</p>
          <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-400">Final review</p>
        </div>
      </div>

      <div className="space-y-2 rounded-lg border border-zinc-700/70 bg-zinc-900/75 px-2.5 py-2">
        {sections.map((section) => {
          const items = parseSectionItems(section.label, section.value);
          const showPills =
            (section.label === "Keywords" || section.label === "Sources" || section.label === "Filters") &&
            items.length > 0;
          const showBullets = section.label === "Entities tracked" && items.length > 0;

          return (
            <div key={`${section.label}-${section.value.slice(0, 16)}`}>
              <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">{section.label}</p>

              {showPills ? (
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-zinc-600/90 bg-zinc-800/65 px-2 py-0.5 text-xs text-zinc-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : showBullets ? (
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm text-zinc-200">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-200">{section.value}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          onClick={onConfirm}
          disabled={actionsDisabled}
          size="sm"
          className="rounded-lg bg-amber-300 text-zinc-950 hover:bg-amber-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Create Monitor"
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          disabled={actionsDisabled}
          className="rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
        >
          Keep editing
        </Button>
      </div>
    </div>
  );
}

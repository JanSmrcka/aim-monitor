"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";

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

      <p className="rounded-lg border border-zinc-700/70 bg-zinc-900/75 px-2.5 py-2 text-sm text-zinc-200">
        {summary}
      </p>

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

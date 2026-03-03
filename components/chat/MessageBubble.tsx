"use client";

import type { UIMessage } from "ai";
import { isToolUIPart, getToolName } from "ai";
import { cn } from "@/lib/utils";
import { OptionChips } from "@/components/chat/OptionChips";
import { FinalizeConfirmation } from "@/components/chat/FinalizeConfirmation";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { MonitoringTask } from "@/lib/types";

interface MessageBubbleProps {
  message: UIMessage;
  append: (text: string) => void;
  isLatest?: boolean;
  task?: MonitoringTask;
  interactionLocked?: boolean;
}

type PresentOption = { label: string; value: string; description?: string; icon?: string };
type PresentOptionsPayload = {
  question: string;
  options: PresentOption[];
  allowMultiple?: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object";
}

function parsePresentOptionsPayload(part: { input?: unknown; output?: unknown }): PresentOptionsPayload | null {
  const candidate = isRecord(part.input) ? part.input : isRecord(part.output) ? part.output : null;
  if (!candidate) return null;

  const question = candidate.question;
  const options = candidate.options;
  if (typeof question !== "string" || !Array.isArray(options)) return null;

  const normalized: PresentOption[] = [];
  for (const option of options) {
    if (!isRecord(option)) continue;
    const label = option.label;
    const value = option.value;
    if (typeof label !== "string" || typeof value !== "string") continue;
    normalized.push({
      label,
      value,
      description: typeof option.description === "string" ? option.description : undefined,
      icon: typeof option.icon === "string" ? option.icon : undefined,
    });
  }

  if (normalized.length === 0) return null;

  return {
    question,
    options: normalized,
    allowMultiple: typeof candidate.allowMultiple === "boolean" ? candidate.allowMultiple : undefined,
  };
}

function isPresentOptionsPending(part: { state?: unknown }): boolean {
  return (
    part.state === "input-streaming" ||
    part.state === "input-available" ||
    part.state === "approval-requested" ||
    part.state === "approval-responded"
  );
}

function parseFinalizeSummary(part: { input?: unknown; output?: unknown }): string | null {
  const candidate = isRecord(part.input) ? part.input : isRecord(part.output) ? part.output : null;
  return typeof candidate?.summary === "string" && candidate.summary ? candidate.summary : null;
}

export function MessageBubble({
  message,
  append,
  isLatest,
  task,
  interactionLocked = false,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [chipsDisabled, setChipsDisabled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: task?.title ?? "Untitled Monitor", config: task }),
      });
      if (!res.ok) throw new Error("Failed to save");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Monitor created!");
    },
    onError: () => {
      toast.error("Failed to create monitor");
    },
  });

  // Skip rendering if message only has hidden tool invocations
  const hasVisibleContent = message.parts.some((p) => {
    if (p.type === "text") return true;
    if (isToolUIPart(p)) {
      const name = getToolName(p);
      if (name === "present_options") {
        return !!parsePresentOptionsPayload(p) || isPresentOptionsPending(p);
      }
      if (name === "finalize_task") {
        return !!parseFinalizeSummary(p) && !dismissed;
      }
    }
    return false;
  });

  if (!hasVisibleContent) return null;

  const handleChipSelect = (value: string) => {
    setChipsDisabled(true);
    append(value);
  };

  return (
    <div
      data-role={message.role}
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[85%] space-y-2.5 rounded-2xl border px-3.5 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.24)]",
          isUser
            ? "border-amber-300/35 bg-gradient-to-br from-amber-300 to-amber-400 text-zinc-950"
            : "border-zinc-700/80 bg-zinc-900/90 text-zinc-100"
        )}
      >
        {message.parts.map((part, i) => {
          if (part.type === "text") {
            return (
              <p key={i} className="whitespace-pre-wrap text-sm leading-relaxed">
                {part.text}
              </p>
            );
          }
          if (isToolUIPart(part)) {
            const name = getToolName(part);
            if (name === "present_options") {
              const payload = parsePresentOptionsPayload(part);
              if (!payload) {
                if (isPresentOptionsPending(part)) {
                  return (
                    <p key={i} className="text-sm text-zinc-400">
                      Preparing options...
                    </p>
                  );
                }
                return null;
              }
              return (
                <OptionChips
                  key={i}
                  question={payload.question}
                  options={payload.options}
                  onSelect={handleChipSelect}
                  disabled={chipsDisabled || !isLatest! || interactionLocked}
                  allowMultiple={payload.allowMultiple}
                  isAgentBusy={interactionLocked}
                />
              );
            }
            if (name === "finalize_task" && !dismissed) {
              const summary = parseFinalizeSummary(part);
              if (!summary) return null;
              return (
                <FinalizeConfirmation
                  key={i}
                  summary={summary}
                  onConfirm={() => saveMutation.mutate()}
                  onDismiss={() => setDismissed(true)}
                  isLoading={saveMutation.isPending}
                  disabled={interactionLocked}
                />
              );
            }
            return null;
          }
          return null;
        })}
      </div>
    </div>
  );
}

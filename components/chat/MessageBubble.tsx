"use client";

import type { UIMessage } from "ai";
import { cn } from "@/lib/utils";
import { OptionChips } from "@/components/chat/OptionChips";
import { useState } from "react";

interface MessageBubbleProps {
  message: UIMessage;
  append: (message: { role: "user"; content: string }) => Promise<string | null | undefined>;
  isLatest?: boolean;
}

export function MessageBubble({ message, append, isLatest }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [chipsDisabled, setChipsDisabled] = useState(false);

  const handleChipSelect = (value: string) => {
    setChipsDisabled(true);
    append({ role: "user", content: value });
  };

  return (
    <div
      data-role={message.role}
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[80%] space-y-2 rounded-lg px-4 py-2",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        {message.parts && message.parts.length > 0
          ? message.parts.map((part, i) => {
              if (part.type === "text") {
                return (
                  <p key={i} className="whitespace-pre-wrap text-sm">
                    {part.text}
                  </p>
                );
              }
              if (part.type === "tool-invocation") {
                if (part.toolName === "present_options") {
                  const args = part.args as {
                    question: string;
                    options: { label: string; value: string; description?: string }[];
                    allowMultiple?: boolean;
                  };
                  return (
                    <OptionChips
                      key={i}
                      question={args.question}
                      options={args.options}
                      onSelect={handleChipSelect}
                      disabled={chipsDisabled || !isLatest!}
                      allowMultiple={args.allowMultiple}
                    />
                  );
                }
                return null;
              }
              return null;
            })
          : message.content && (
              <p className="whitespace-pre-wrap text-sm">{message.content}</p>
            )}
      </div>
    </div>
  );
}

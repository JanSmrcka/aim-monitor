"use client";

import type { UIMessage } from "ai";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: UIMessage;
  append: (message: { role: "user"; content: string }) => Promise<string | null | undefined>;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      data-role={message.role}
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        {message.parts.map((part, i) => {
          if (part.type === "text") {
            return (
              <p key={i} className="whitespace-pre-wrap text-sm">
                {part.text}
              </p>
            );
          }
          // tool invocations handled in Phase 3
          return null;
        })}
      </div>
    </div>
  );
}

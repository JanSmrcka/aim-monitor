"use client";

import type { UIMessage } from "ai";
import type { MonitoringTask } from "@/lib/types";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";

interface MessageListProps {
  messages: UIMessage[];
  append: (text: string) => void;
  task?: MonitoringTask;
}

export function MessageList({ messages, append, task }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView?.({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1">
      <div data-testid="message-list" className="space-y-4 p-4">
        {messages.map((msg, idx) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            append={append}
            isLatest={idx === messages.length - 1}
            task={task}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}

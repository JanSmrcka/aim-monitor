"use client";

import type { UIMessage } from "ai";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";

interface MessageListProps {
  messages: UIMessage[];
  append: (message: { role: "user"; content: string }) => Promise<string | null | undefined>;
}

export function MessageList({ messages, append }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView?.({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1">
      <div data-testid="message-list" className="space-y-4 p-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} append={append} />
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}

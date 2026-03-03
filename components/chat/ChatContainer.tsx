"use client";

import { useChat } from "@ai-sdk/react";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/chat/ChatInput";
import { ThinkingIndicator } from "@/components/chat/ThinkingIndicator";

export function ChatContainer() {
  const { messages, input, setInput, handleSubmit, status, append } = useChat({
    api: "/api/chat",
    maxSteps: 10,
  });

  const isLoading = status === "streaming" || status === "submitted";

  const onSubmit = () => {
    if (!input.trim()) return;
    handleSubmit();
  };

  return (
    <div className="flex h-full flex-col">
      <MessageList messages={messages} append={append} />
      {isLoading && <ThinkingIndicator />}
      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}

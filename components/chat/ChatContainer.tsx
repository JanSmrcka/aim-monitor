"use client";

import { useChat } from "@ai-sdk/react";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/chat/ChatInput";
import { ThinkingIndicator } from "@/components/chat/ThinkingIndicator";
import { MonitoringPreview } from "@/components/monitoring/MonitoringPreview";
import { deriveMonitoringTask } from "@/lib/monitoring-utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PanelRight } from "lucide-react";

export function ChatContainer() {
  const { messages, input, handleInputChange, handleSubmit, status, append } = useChat({
    api: "/api/chat",
    maxSteps: 10,
  });

  const isLoading = status === "streaming" || status === "submitted";
  const task = deriveMonitoringTask(messages);

  const onSubmit = () => {
    if (!input?.trim()) return;
    handleSubmit();
  };

  const preview = <MonitoringPreview task={task} />;

  return (
    <div className="flex h-full">
      {/* Chat area */}
      <div className="flex flex-1 flex-col">
        <MessageList messages={messages} append={append} />
        {isLoading && <ThinkingIndicator />}
        <ChatInput
          value={input}
          onChange={handleInputChange}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </div>

      {/* Desktop preview */}
      <div className="hidden w-[360px] border-l lg:block">
        {preview}
      </div>

      {/* Mobile preview */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-50"
            >
              <PanelRight className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[360px] p-0">
            {preview}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

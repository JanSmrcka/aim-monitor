"use client";

import { useChat } from "@ai-sdk/react";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/chat/ChatInput";
import { ThinkingIndicator } from "@/components/chat/ThinkingIndicator";
import { MonitoringPreview } from "@/components/monitoring/MonitoringPreview";
import { deriveMonitoringTask } from "@/lib/monitoring-utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PanelRight, MessageSquareText } from "lucide-react";
import { useChatContext } from "@/lib/chat-context";
import { useEffect, useState } from "react";

export function ChatContainer() {
  const { messages, sendMessage, setMessages, status } = useChat({
    api: "/api/chat",
  } as Parameters<typeof useChat>[0]);
  const { registerReset } = useChatContext();
  const [localInput, setLocalInput] = useState("");

  useEffect(() => {
    registerReset(() => {
      setMessages([]);
      setLocalInput("");
    });
  }, [registerReset, setMessages]);

  const isLoading = status === "streaming" || status === "submitted";
  const task = deriveMonitoringTask(messages);

  const onSubmit = () => {
    if (!localInput.trim()) return;
    const text = localInput;
    setLocalInput("");
    sendMessage({ text });
  };

  const handleAppend = async (text: string) => {
    sendMessage({ text });
  };

  const preview = <MonitoringPreview task={task} />;

  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-2 xl:grid-cols-[minmax(0,1fr)_344px]">
      <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/65 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="flex items-center justify-between border-b border-zinc-800/80 px-3 py-2">
          <div className="flex items-center gap-2">
            <MessageSquareText className="h-4 w-4 text-amber-300" />
            <p className="font-heading text-sm font-semibold text-zinc-100">Conversation</p>
          </div>

          <div className="xl:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-100"
                >
                  <PanelRight className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[352px] border-zinc-800 bg-zinc-950 p-0">
                {preview}
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <MessageList
            messages={messages}
            append={handleAppend}
            task={task}
            interactionLocked={isLoading}
          />
          {isLoading && <ThinkingIndicator />}
          <ChatInput
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        </div>
      </section>

      <div className="hidden min-h-0 overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/65 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] xl:flex">
        {preview}
      </div>
    </div>
  );
}

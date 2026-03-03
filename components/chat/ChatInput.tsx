"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { type ChangeEvent, type KeyboardEvent } from "react";

interface ChatInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function ChatInput({ value, onChange, onSubmit, isLoading }: ChatInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="bg-zinc-950/90 px-2 pb-2 pt-2 md:px-3 md:pb-3 md:pt-2.5">
      <div className="flex items-end gap-2 rounded-lg bg-zinc-900/78 p-1.5 ring-1 ring-zinc-800/70">
        <Textarea
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder="Describe what you want to monitor..."
          disabled={isLoading}
          className="min-h-[40px] max-h-[180px] resize-none rounded-md border-none bg-transparent px-2 py-2 text-sm text-zinc-100 shadow-none focus-visible:ring-0 dark:bg-transparent"
          rows={1}
        />
        <Button
          onClick={onSubmit}
          disabled={isLoading || !value?.trim()}
          size="icon"
          className="shrink-0 rounded-md bg-amber-300 text-zinc-950 hover:bg-amber-200"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

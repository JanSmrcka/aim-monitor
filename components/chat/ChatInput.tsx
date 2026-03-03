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
    <div className="border-t border-zinc-800/80 bg-zinc-950/90 p-2 md:p-3">
      <div className="flex items-end gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 p-2">
      <Textarea
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder="Describe what you want to monitor..."
        disabled={isLoading}
        className="min-h-[40px] max-h-[180px] resize-none border-none bg-transparent text-sm text-zinc-100 shadow-none focus-visible:ring-0"
        rows={1}
      />
      <Button
        onClick={onSubmit}
        disabled={isLoading || !value?.trim()}
        size="icon"
        className="shrink-0 bg-amber-300 text-zinc-950 hover:bg-amber-200"
      >
        <Send className="h-4 w-4" />
      </Button>
      </div>
    </div>
  );
}

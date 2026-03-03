"use client";

export function ThinkingIndicator() {
  return (
    <div
      data-testid="thinking-indicator"
      className="flex items-center gap-1 border-t border-zinc-800/70 px-3 py-1.5 text-zinc-400"
    >
      <span className="text-xs">Thinking</span>
      <span className="flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-300"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </span>
    </div>
  );
}

"use client";

export function ThinkingIndicator() {
  return (
    <div data-testid="thinking-indicator" className="flex items-center gap-1 px-4 py-2">
      <span className="text-sm text-muted-foreground">Thinking</span>
      <span className="flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </span>
    </div>
  );
}

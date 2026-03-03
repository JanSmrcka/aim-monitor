import { ScrollReveal } from "./ScrollReveal";

export function DemoPreview() {
  return (
    <section className="px-6 pb-16 pt-0 sm:pb-24">
      <ScrollReveal className="mx-auto max-w-5xl">
        <div className="sm:[perspective:1200px]">
          <div className="overflow-hidden rounded-xl border border-landing-border bg-landing-surface shadow-2xl shadow-landing-accent/10 sm:[transform:rotateX(2deg)]">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-landing-border px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-landing-border" />
                <span className="h-3 w-3 rounded-full bg-landing-border" />
                <span className="h-3 w-3 rounded-full bg-landing-border" />
              </div>
              <div className="mx-auto flex-1">
                <div className="mx-auto max-w-xs rounded-md bg-landing-bg/80 px-3 py-1 text-center font-[family-name:var(--font-code)] text-[11px] text-landing-muted/60">
                  app.aimmonitor.com
                </div>
              </div>
              <div className="w-[54px]" />
            </div>

            {/* App content placeholder */}
            <div className="grid sm:grid-cols-2">
              {/* Chat pane */}
              <div className="border-r border-landing-border p-6">
                <div className="space-y-4">
                  {/* AI message */}
                  <div className="flex gap-3">
                    <div className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-landing-accent/20" />
                    <div className="space-y-2">
                      <div className="h-3 w-48 rounded bg-landing-border/80" />
                      <div className="h-3 w-36 rounded bg-landing-border/60" />
                    </div>
                  </div>
                  {/* User message */}
                  <div className="flex justify-end">
                    <div className="space-y-2 rounded-lg bg-landing-accent/10 px-4 py-3">
                      <div className="h-3 w-32 rounded bg-landing-accent/30" />
                    </div>
                  </div>
                  {/* AI message */}
                  <div className="flex gap-3">
                    <div className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-landing-accent/20" />
                    <div className="space-y-2">
                      <div className="h-3 w-52 rounded bg-landing-border/80" />
                      <div className="h-3 w-40 rounded bg-landing-border/60" />
                      <div className="h-3 w-28 rounded bg-landing-border/40" />
                    </div>
                  </div>
                  {/* Option chips */}
                  <div className="flex flex-wrap gap-2 pl-9">
                    <div className="h-7 w-20 rounded-full border border-landing-accent/30 bg-landing-accent/5" />
                    <div className="h-7 w-24 rounded-full border border-landing-accent/20 bg-landing-surface" />
                    <div className="h-7 w-16 rounded-full border border-landing-accent/20 bg-landing-surface" />
                  </div>
                </div>
              </div>

              {/* Preview pane */}
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-landing-success" />
                    <div className="h-3 w-20 rounded bg-landing-border/80" />
                  </div>
                  {/* Task preview card */}
                  <div className="space-y-3 rounded-lg border border-landing-border/60 p-4">
                    <div className="h-3 w-28 rounded bg-landing-border/80" />
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-14 rounded bg-landing-accent/15 font-[family-name:var(--font-code)] text-[9px] leading-5 text-landing-accent/60" />
                        <div className="h-3 w-16 rounded bg-landing-border/50" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-14 rounded bg-landing-accent/15" />
                        <div className="h-3 w-20 rounded bg-landing-border/50" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-14 rounded bg-landing-accent/15" />
                        <div className="h-3 w-12 rounded bg-landing-border/50" />
                      </div>
                    </div>
                  </div>
                  {/* Sources */}
                  <div className="flex flex-wrap gap-1.5">
                    {["News", "SEC", "Twitter", "Reddit"].map((s) => (
                      <span
                        key={s}
                        className="rounded border border-landing-border px-2 py-0.5 font-[family-name:var(--font-code)] text-[10px] text-landing-muted/60"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

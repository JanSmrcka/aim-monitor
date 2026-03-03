import { ScrollReveal } from "./ScrollReveal";
import Image from "next/image";

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

            <div className="relative">
              <Image
                src="/landing/monitor-ops-screen.webp"
                alt="Monitor Ops dashboard screenshot"
                width={2559}
                height={1317}
                loading="lazy"
                className="block h-auto w-full"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-landing-bg/10 via-transparent to-transparent" />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-landing-accent/12" />
              <div className="pointer-events-none absolute -inset-x-10 -bottom-16 h-32 bg-[radial-gradient(50%_60%_at_50%_50%,rgba(217,119,6,0.24),transparent)]" />
              </div>
            </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

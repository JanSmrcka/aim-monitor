import { ScrollReveal } from "./ScrollReveal";

const features = [
  {
    icon: "◇",
    title: "AI-Powered Setup",
    description: "Conversational task builder. No forms, no friction.",
  },
  {
    icon: "◈",
    title: "Live Preview",
    description: "See your monitoring task take shape as you chat.",
  },
  {
    icon: "▣",
    title: "Smart Sources",
    description: "Websites, social feeds, SEC filings, repos, RSS — auto-suggested.",
  },
  {
    icon: "⬡",
    title: "Instant Deploy",
    description: "From idea to active monitor in under a minute.",
  },
];

export function Features() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p className="font-[family-name:var(--font-code)] text-xs uppercase tracking-[0.2em] text-landing-muted">
            Features
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 100}>
              <div className="group rounded-xl border border-landing-border bg-landing-surface/50 p-6 transition-all duration-300 hover:border-landing-muted/30">
                <span className="text-lg text-landing-accent">{feature.icon}</span>
                <h3 className="mt-3 font-[family-name:var(--font-body)] text-sm font-medium text-landing-text">
                  {feature.title}
                </h3>
                <p className="mt-1 font-[family-name:var(--font-body)] text-sm text-landing-muted">
                  {feature.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import { ScrollReveal } from "./ScrollReveal";

const cases = [
  {
    icon: "⚔",
    title: "Competitive Intelligence",
    description:
      "Track competitors' moves, pricing changes, and product launches before they hit the news.",
    example: '"Tesla" → News, SEC, Twitter, Reddit',
  },
  {
    icon: "📈",
    title: "Investment Signals",
    description:
      "Surface early indicators from filings, social sentiment, and market chatter.",
    example: '"NVDA earnings" → SEC, Reddit, Bloomberg',
  },
  {
    icon: "🔬",
    title: "Research Tracking",
    description:
      "Follow papers, patents, and breakthroughs in your field without the noise.",
    example: '"CRISPR trials" → PubMed, arXiv, News',
  },
];

export function UseCases() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p className="font-[family-name:var(--font-code)] text-xs uppercase tracking-[0.2em] text-landing-muted">
            Use cases
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {cases.map((c, i) => (
            <ScrollReveal key={c.title} delay={i * 120}>
              <div className="group flex h-full flex-col rounded-xl border border-landing-border bg-landing-surface/50 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-landing-accent/40 hover:shadow-[0_0_24px_rgba(59,130,246,0.08)]">
                <span className="text-2xl">{c.icon}</span>
                <h3 className="mt-4 font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.02em] text-landing-text">
                  {c.title}
                </h3>
                <p className="mt-2 flex-1 font-[family-name:var(--font-body)] text-sm leading-relaxed text-landing-muted">
                  {c.description}
                </p>
                <p className="mt-4 font-[family-name:var(--font-code)] text-xs text-landing-muted/50">
                  {c.example}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

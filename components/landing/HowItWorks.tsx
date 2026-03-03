import { ScrollReveal } from "./ScrollReveal";

const steps = [
  {
    number: "01",
    title: "Describe",
    description:
      "Tell the AI what you want to monitor. People, companies, trends — anything.",
  },
  {
    number: "02",
    title: "Refine",
    description:
      "Answer follow-ups by clicking options. The AI narrows your scope and picks sources.",
  },
  {
    number: "03",
    title: "Monitor",
    description:
      "Your task is live. We track changes and surface what matters.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p className="font-[family-name:var(--font-code)] text-xs uppercase tracking-[0.2em] text-landing-muted">
            How it works
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-0 sm:grid-cols-3">
          {steps.map((step, i) => (
            <ScrollReveal key={step.number} delay={i * 120}>
              <div
                className={`py-8 sm:px-8 sm:py-0 ${
                  i < steps.length - 1
                    ? "border-b border-landing-border sm:border-b-0 sm:border-r"
                    : ""
                } ${i === 0 ? "sm:pl-0" : ""} ${i === steps.length - 1 ? "sm:pr-0" : ""}`}
              >
                <span className="font-[family-name:var(--font-code)] text-xs text-landing-accent">
                  {step.number}
                </span>
                <h3 className="mt-3 font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-[-0.02em] text-landing-text">
                  {step.title}
                </h3>
                <p className="mt-2 font-[family-name:var(--font-body)] text-sm leading-relaxed text-landing-muted">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

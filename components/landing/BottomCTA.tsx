import { signIn } from "@/lib/auth";

export function BottomCTA() {
  return (
    <section className="px-6 pb-32 pt-16">
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-landing-border bg-landing-surface p-12 text-center sm:p-16">
        {/* Accent glow on border */}
        <div className="absolute -top-px left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-landing-accent to-transparent" />

        <h2 className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-[-0.02em] text-landing-text sm:text-4xl">
          Start monitoring in 60 seconds.
        </h2>

        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/dashboard" });
          }}
          className="mt-8"
        >
          <button
            type="submit"
            className="rounded-xl bg-landing-accent px-10 py-4 font-[family-name:var(--font-body)] text-sm font-medium text-white transition-all duration-200 hover:bg-landing-accent-hover hover:shadow-[0_0_32px_rgba(245,158,11,0.34)]"
          >
            Sign in with GitHub
          </button>
        </form>

        <p className="mt-4 font-[family-name:var(--font-body)] text-sm text-landing-muted">
          No credit card. No setup. Just start.
        </p>
      </div>
    </section>
  );
}

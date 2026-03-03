import { signIn } from "@/lib/auth";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20">
      {/* Dot grid background */}
      <div className="dot-grid absolute inset-0 opacity-30" />

      {/* Gradient orb */}
      <div className="absolute left-1/2 top-1/3 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-landing-accent/20 blur-[132px]" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h1 className="animate-fade-up font-[family-name:var(--font-heading)] text-5xl font-semibold leading-[1.08] tracking-[-0.03em] text-landing-text sm:text-6xl md:text-7xl lg:text-8xl">
          Monitor what matters.
          <br />
          <span className="bg-gradient-to-r from-landing-accent to-landing-accent-hover bg-clip-text text-transparent">Before it matters.</span>
        </h1>

        <p className="animate-fade-up delay-200 mx-auto mt-6 max-w-xl font-[family-name:var(--font-body)] text-lg text-landing-muted sm:text-xl">
          Tell an AI what you care about. It builds your monitoring task in seconds.
        </p>

        <div className="animate-fade-up delay-400 mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/dashboard" });
            }}
          >
            <button
              type="submit"
              className="group relative rounded-xl bg-landing-accent px-8 py-3.5 font-[family-name:var(--font-body)] text-sm font-medium text-white transition-all duration-200 hover:bg-landing-accent-hover hover:shadow-[0_0_32px_rgba(245,158,11,0.34)]"
            >
              Get Started — it&apos;s free
            </button>
          </form>
          <a
            href="#how-it-works"
            className="font-[family-name:var(--font-body)] text-sm text-landing-muted transition-colors duration-200 hover:text-landing-text"
          >
            See how it works →
          </a>
        </div>
      </div>
    </section>
  );
}

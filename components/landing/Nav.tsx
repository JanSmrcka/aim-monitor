import { signIn } from "@/lib/auth";

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export function Nav() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-transparent bg-landing-bg/55 backdrop-blur-md transition-colors duration-300 [border-image:linear-gradient(to_right,transparent,var(--color-landing-border)_20%,var(--color-landing-border)_80%,transparent)_1]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="font-[family-name:var(--font-heading)] text-xl font-semibold text-landing-text tracking-tight">
          aim
        </span>
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/dashboard" });
          }}
        >
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg border border-landing-border bg-landing-surface/50 px-4 py-2 text-sm font-medium text-landing-muted transition-all duration-200 hover:border-landing-accent/40 hover:bg-landing-surface hover:text-landing-text"
          >
            <GitHubIcon className="h-4 w-4" />
            Sign in
          </button>
        </form>
      </div>
    </nav>
  );
}

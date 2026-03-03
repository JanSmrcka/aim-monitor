import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { QueryProvider } from "@/lib/query-provider";
import { AppShell } from "@/components/dashboard/AppShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/");

  return (
    <QueryProvider>
      <AppShell user={session.user}>{children}</AppShell>
    </QueryProvider>
  );
}

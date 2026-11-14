import { Suspense } from "react";
import { redirect } from "next/navigation";
import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { WorkspaceSkeleton } from "@/components/layout/workspace-skeleton";
import { getServerUser } from "@/lib/auth/session";

async function WorkspaceAuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();

  if (!user) {
    redirect("/login?expired=1");
  }

  return <WorkspaceShell user={user}>{children}</WorkspaceShell>;
}

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<WorkspaceSkeleton />}>
      <WorkspaceAuthGate>{children}</WorkspaceAuthGate>
    </Suspense>
  );
}

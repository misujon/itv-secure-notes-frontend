import { Suspense } from "react";
import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { WorkspaceSkeleton } from "@/components/layout/workspace-skeleton";
import { getServerUser } from "@/lib/auth/session";

async function PublicWorkspaceShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();
  return <WorkspaceShell user={user}>{children}</WorkspaceShell>;
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<WorkspaceSkeleton />}>
      <PublicWorkspaceShell>{children}</PublicWorkspaceShell>
    </Suspense>
  );
}

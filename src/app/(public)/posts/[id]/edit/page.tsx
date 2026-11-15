import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { EditPostView } from "@/features/posts/components/edit-post-view";
import { getServerUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Edit Post",
};

async function AuthenticatedEditPost({ id }: { id: string }) {
  const user = await getServerUser();
  if (!user) {
    redirect(`/login?next=/posts/${id}/edit`);
  }
  return <EditPostView id={id} />;
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <Skeleton className="h-96 w-full max-w-3xl mx-auto rounded-xl" />
      }
    >
      <AuthenticatedEditPost id={id} />
    </Suspense>
  );
}

import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { CreatePostView } from "@/features/posts/components/create-post-view";
import { getServerUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "New Post",
};

async function AuthenticatedNewPost() {
  const user = await getServerUser();
  if (!user) {
    redirect("/login?next=/posts/new");
  }
  return <CreatePostView />;
}

export default function NewPostPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full max-w-3xl mx-auto rounded-xl" />}>
      <AuthenticatedNewPost />
    </Suspense>
  );
}

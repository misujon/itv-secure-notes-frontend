"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PostForm } from "@/features/posts/components/post-form";
import { extractApiError } from "@/lib/utils/api-error";
import type { PostFormValues } from "@/lib/validations/post";
import { useGetMeQuery } from "@/store/api/authApi";
import { useGetPostQuery, useUpdatePostMutation } from "@/store/api/postsApi";

export function EditPostView({ id }: { id: string }) {
  const router = useRouter();
  const { data: currentUser } = useGetMeQuery();
  const { data: post, isLoading, isError, error, refetch } = useGetPostQuery(id);
  const [updatePost, { isLoading: isSaving }] = useUpdatePostMutation();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Link
          href="/posts"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
          Back to Public Posts
        </Link>
        <ErrorState
          title="Unable to load post"
          message={
            error
              ? extractApiError(error).message
              : "This post could not be found."
          }
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const canEdit =
    currentUser &&
    (currentUser.role === "admin" || currentUser.id === post.user_id);

  if (currentUser && !canEdit) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Link
          href={`/posts/${post.id}`}
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
          Back to Post
        </Link>
        <ErrorState
          title="Forbidden"
          message="You do not have permission to edit this post."
        />
      </div>
    );
  }

  const handleUpdate = async (values: PostFormValues) => {
    await updatePost({ id: post.id, ...values }).unwrap();
    toast.success("Post updated.");
    router.push(`/posts/${post.id}`);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Edit Post"
        description={`Updating "${post.title}"`}
        breadcrumbs={[
          { label: "Public Posts", href: "/posts" },
          { label: post.title, href: `/posts/${post.id}` },
          { label: "Edit" },
        ]}
      />

      <PostForm
        defaultValues={{
          title: post.title,
          content: post.content,
        }}
        submitLabel="Save Changes"
        cancelHref={`/posts/${post.id}`}
        isSubmitting={isSaving}
        onSubmitValues={handleUpdate}
      />
    </div>
  );
}

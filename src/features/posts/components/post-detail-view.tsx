"use client";

import Link from "next/link";
import { ArrowLeft, CalendarDays, Pencil, UserRound } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { RichTextContent } from "@/components/shared/rich-text-content";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { extractApiError } from "@/lib/utils/api-error";
import { formatDateTime } from "@/lib/utils/date";
import { useGetMeQuery } from "@/store/api/authApi";
import { useGetPostQuery } from "@/store/api/postsApi";

export function PostDetailView({ id }: { id: string }) {
  const { data: currentUser } = useGetMeQuery();
  const { data: post, isLoading, isError, error, refetch } = useGetPostQuery(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-64 w-full rounded-xl" />
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

  const canEdit = Boolean(
    currentUser &&
      (currentUser.role === "admin" || currentUser.id === post.user_id),
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title={post.title}
        breadcrumbs={[
          { label: "Public Posts", href: "/posts" },
          { label: "Post Details" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/posts"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <ArrowLeft className="mr-1.5 size-4" aria-hidden="true" />
              Back to Posts
            </Link>
            {canEdit ? (
              <Link
                href={`/posts/${post.id}/edit`}
                className={buttonVariants({ size: "sm" })}
              >
                <Pencil className="mr-1.5 size-4" aria-hidden="true" />
                Edit Post
              </Link>
            ) : null}
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        {post.user ? (
          <Link
            href={`/posts/user/${post.user.id}`}
            className="inline-flex items-center gap-1.5 font-medium text-foreground hover:text-primary transition-colors"
          >
            <UserRound className="size-3.5" aria-hidden="true" />
            {post.user.name}
          </Link>
        ) : null}
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="size-3.5" aria-hidden="true" />
          Published {formatDateTime(post.created_at)}
        </span>
      </div>

      <Card className="border-border shadow-xs">
        <CardContent className="pt-6">
          <RichTextContent content={post.content} />
        </CardContent>
      </Card>
    </div>
  );
}

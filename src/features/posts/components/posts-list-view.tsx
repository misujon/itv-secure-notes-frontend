"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Plus, UserRound } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { extractApiError } from "@/lib/utils/api-error";
import { formatDisplayDate } from "@/lib/utils/date";
import { stripHtml } from "@/lib/utils/html";
import { useGetMeQuery } from "@/store/api/authApi";
import { useGetPostsQuery } from "@/store/api/postsApi";

export function PostsListView() {
  const [page, setPage] = useState(1);
  const { data: currentUser } = useGetMeQuery();
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetPostsQuery({ page, per_page: 12 });

  const posts = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Public Posts"
        description="Read posts shared across the community."
        actions={
          currentUser ? (
            <Link href="/posts/new" className={buttonVariants()}>
              <Plus className="mr-2 size-4" aria-hidden="true" />
              New Post
            </Link>
          ) : (
            <Link
              href="/login?next=/posts/new"
              className={buttonVariants({ variant: "outline" })}
            >
              Sign in to publish
            </Link>
          )
        }
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          message={extractApiError(error).message}
          onRetry={() => refetch()}
        />
      ) : posts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No public posts yet"
          description="There are no posts published yet. Be the first to share one."
          action={
            currentUser ? (
              <Link href="/posts/new" className={buttonVariants()}>
                <Plus className="mr-2 size-4" aria-hidden="true" />
                Create Post
              </Link>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="flex flex-col justify-between border-border shadow-xs hover:border-primary/40 transition-colors"
              >
                <div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold line-clamp-1">
                      <Link
                        href={`/posts/${post.id}`}
                        className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline"
                      >
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-xs flex items-center gap-1.5">
                      <span>{formatDisplayDate(post.created_at)}</span>
                      {post.user ? (
                        <>
                          <span>·</span>
                          <Link
                            href={`/posts/user/${post.user.id}`}
                            className="inline-flex items-center gap-1 font-medium text-foreground hover:text-primary transition-colors truncate"
                          >
                            <UserRound className="size-3 shrink-0" aria-hidden="true" />
                            <span className="truncate">{post.user.name}</span>
                          </Link>
                        </>
                      ) : null}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 break-words">
                      {stripHtml(post.content)}
                    </p>
                  </CardContent>
                </div>

                <CardFooter className="border-t border-border/60 pt-3">
                  <Link
                    href={`/posts/${post.id}`}
                    className="text-xs font-medium text-primary hover:underline underline-offset-4"
                  >
                    Read post
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {meta ? (
            <PaginationControls
              meta={meta}
              onPageChange={setPage}
              isFetching={isFetching}
            />
          ) : null}
        </>
      )}
    </div>
  );
}

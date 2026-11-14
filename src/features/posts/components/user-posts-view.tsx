"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { Badge } from "@/components/ui/badge";
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
import { useGetUserPostsQuery } from "@/store/api/postsApi";

export function UserPostsView({ userId }: { userId: string }) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetUserPostsQuery({ userId, page, per_page: 12 });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-1/2" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className="h-44 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-4">
        <Link
          href="/posts"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
          Back to Public Posts
        </Link>
        <ErrorState
          title="Unable to load author posts"
          message={
            error
              ? extractApiError(error).message
              : "Author posts could not be found."
          }
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const { user, posts } = data.data;
  const meta = data.meta;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Posts by ${user.name}`}
        description={user.email}
        breadcrumbs={[
          { label: "Public Posts", href: "/posts" },
          { label: user.name },
        ]}
        actions={
          <Link
            href="/posts"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <ArrowLeft className="mr-1.5 size-4" aria-hidden="true" />
            All Posts
          </Link>
        }
      />

      {user.interests && user.interests.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Interests:
          </span>
          {user.interests.map((interest) => (
            <Badge key={interest} variant="secondary">
              {interest}
            </Badge>
          ))}
        </div>
      ) : null}

      {posts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No posts yet"
          description={`${user.name} has not published any public posts yet.`}
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
                        className="hover:text-primary transition-colors"
                      >
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Published {formatDisplayDate(post.created_at)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-line break-words">
                      {post.content}
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

          <PaginationControls
            meta={meta}
            onPageChange={setPage}
            isFetching={isFetching}
          />
        </>
      )}
    </div>
  );
}

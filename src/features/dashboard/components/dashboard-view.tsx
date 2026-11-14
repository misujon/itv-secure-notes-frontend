"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  FileText,
  NotebookPen,
  Plus,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { extractApiError } from "@/lib/utils/api-error";
import { formatDisplayDate, formatRelativeDate } from "@/lib/utils/date";
import { useGetMeQuery } from "@/store/api/authApi";
import { useGetNotesQuery } from "@/store/api/notesApi";
import { useGetPostsQuery } from "@/store/api/postsApi";

export function DashboardView() {
  const { data: user, isLoading: isUserLoading } = useGetMeQuery();
  const {
    data: notesData,
    isLoading: isNotesLoading,
    isError: isNotesError,
    error: notesError,
    refetch: refetchNotes,
  } = useGetNotesQuery({ page: 1, per_page: 6 });

  const { data: postsData, isLoading: isPostsLoading } = useGetPostsQuery({
    page: 1,
    per_page: 3,
  });

  const welcomeTitle = isUserLoading
    ? "Welcome back"
    : `Welcome back, ${user?.name ?? "there"}`;

  const notes = notesData?.data ?? [];
  const totalNotes = notesData?.meta.total ?? 0;
  const latestNote = notes[0];
  const totalPosts = postsData?.meta.total ?? 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title={welcomeTitle}
        description="Your notes and ideas, organized in one place."
        actions={
          <Link href="/notes/new" className={buttonVariants()}>
            <Plus className="mr-2 size-4" aria-hidden="true" />
            Create Note
          </Link>
        }
      />

      {/* Summary Cards */}
      <section aria-label="Workspace overview" className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Personal Notes
            </CardTitle>
            <NotebookPen className="size-4 text-primary" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            {isNotesLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-bold text-foreground">{totalNotes}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              Private to your account
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Last Note Activity
            </CardTitle>
            <CalendarDays className="size-4 text-primary" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            {isNotesLoading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <p className="text-2xl font-bold text-foreground truncate">
                {latestNote
                  ? formatRelativeDate(latestNote.updated_at ?? latestNote.created_at)
                  : "No activity yet"}
              </p>
            )}
            <p className="mt-1 text-xs text-muted-foreground truncate">
              {latestNote ? latestNote.title : "Create your first note to begin"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Community Posts
            </CardTitle>
            <FileText className="size-4 text-primary" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            {isPostsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-bold text-foreground">{totalPosts}</p>
            )}
            <Link
              href="/posts"
              className="mt-1 inline-flex items-center text-xs font-medium text-primary hover:underline underline-offset-4"
            >
              Browse public posts
              <ArrowRight className="ml-1 size-3" aria-hidden="true" />
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Recent Notes */}
      <section aria-label="Recent notes" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Recent Notes
            </h2>
            <p className="text-sm text-muted-foreground">
              Your latest personal notes, ordered by most recent.
            </p>
          </div>
          {notes.length > 0 ? (
            <Link
              href="/notes"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              View all notes
              <ArrowRight className="ml-1.5 size-4" aria-hidden="true" />
            </Link>
          ) : null}
        </div>

        {isNotesLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-40 w-full rounded-xl" />
            ))}
          </div>
        ) : isNotesError ? (
          <ErrorState
            message={extractApiError(notesError).message}
            onRetry={() => refetchNotes()}
          />
        ) : notes.length === 0 ? (
          <EmptyState
            icon={NotebookPen}
            title="No notes yet"
            description="Capture your thoughts, meeting notes, or ideas in a private note."
            action={
              <Link href="/notes/new" className={buttonVariants()}>
                <Plus className="mr-2 size-4" aria-hidden="true" />
                Create your first note
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Card className="h-full border-border shadow-xs transition-colors group-hover:border-primary/40">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                      {note.title}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Updated {formatDisplayDate(note.updated_at ?? note.created_at)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-line">
                      {note.content}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

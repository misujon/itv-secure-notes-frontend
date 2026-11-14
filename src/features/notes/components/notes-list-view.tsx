"use client";

import { useState } from "react";
import Link from "next/link";
import { NotebookPen, Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteNoteDialog } from "@/features/notes/components/delete-note-dialog";
import { extractApiError } from "@/lib/utils/api-error";
import { formatDisplayDate } from "@/lib/utils/date";
import { useGetNotesQuery } from "@/store/api/notesApi";
import type { Note } from "@/types/api";

export function NotesListView() {
  const [page, setPage] = useState(1);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetNotesQuery({ page, per_page: 12 });

  const notes = data?.data ?? [];
  const meta = data?.meta;

  const handleDeleted = () => {
    if (notes.length === 1 && page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Notes"
        description="Create, organize, and manage your private notes."
        actions={
          <Link href="/notes/new" className={buttonVariants()}>
            <Plus className="mr-2 size-4" aria-hidden="true" />
            New Note
          </Link>
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
      ) : notes.length === 0 ? (
        <EmptyState
          icon={NotebookPen}
          title="No notes found"
          description="You haven't created any notes yet. Start by writing your first note."
          action={
            <Link href="/notes/new" className={buttonVariants()}>
              <Plus className="mr-2 size-4" aria-hidden="true" />
              Create Note
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <Card
                key={note.id}
                className="flex flex-col justify-between border-border shadow-xs hover:border-primary/40 transition-colors"
              >
                <div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold line-clamp-1">
                      <Link
                        href={`/notes/${note.id}`}
                        className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline"
                      >
                        {note.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Created {formatDisplayDate(note.created_at)}
                      {note.updated_at && note.updated_at !== note.created_at
                        ? ` · Updated ${formatDisplayDate(note.updated_at)}`
                        : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-line break-words">
                      {note.content}
                    </p>
                  </CardContent>
                </div>

                <CardFooter className="flex items-center justify-between gap-2 border-t border-border/60 pt-3">
                  <Link
                    href={`/notes/${note.id}`}
                    className="text-xs font-medium text-primary hover:underline underline-offset-4"
                  >
                    Read note
                  </Link>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/notes/${note.id}/edit`}
                      className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                      aria-label={`Edit ${note.title}`}
                      title="Edit note"
                    >
                      <Pencil className="size-3.5" aria-hidden="true" />
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setNoteToDelete(note)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      aria-label={`Delete ${note.title}`}
                      title="Delete note"
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                    </Button>
                  </div>
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

      <DeleteNoteDialog
        noteId={noteToDelete?.id ?? null}
        noteTitle={noteToDelete?.title}
        open={Boolean(noteToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setNoteToDelete(null);
          }
        }}
        onDeleted={handleDeleted}
      />
    </div>
  );
}

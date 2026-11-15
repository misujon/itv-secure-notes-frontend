"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { RichTextContent } from "@/components/shared/rich-text-content";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteNoteDialog } from "@/features/notes/components/delete-note-dialog";
import { extractApiError } from "@/lib/utils/api-error";
import { formatDateTime } from "@/lib/utils/date";
import { useGetNoteQuery } from "@/store/api/notesApi";

export function NoteDetailView({ id }: { id: string }) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: note, isLoading, isError, error, refetch } = useGetNoteQuery(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !note) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Link
          href="/notes"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
          Back to My Notes
        </Link>
        <ErrorState
          title="Unable to load note"
          message={
            error
              ? extractApiError(error).message
              : "This note could not be found."
          }
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title={note.title}
        breadcrumbs={[
          { label: "My Notes", href: "/notes" },
          { label: "Note Details" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/notes"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <ArrowLeft className="mr-1.5 size-4" aria-hidden="true" />
              Back
            </Link>
            <Link
              href={`/notes/${note.id}/edit`}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <Pencil className="mr-1.5 size-4" aria-hidden="true" />
              Edit
            </Link>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="mr-1.5 size-4" aria-hidden="true" />
              Delete
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="size-3.5" aria-hidden="true" />
          Created {formatDateTime(note.created_at)}
        </span>
        {note.updated_at ? (
          <span>Last updated {formatDateTime(note.updated_at)}</span>
        ) : null}
      </div>

      <Card className="border-border shadow-xs">
        <CardContent className="pt-6">
          <RichTextContent content={note.content} />
        </CardContent>
      </Card>

      <DeleteNoteDialog
        noteId={note.id}
        noteTitle={note.title}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={() => router.replace("/notes")}
      />
    </div>
  );
}

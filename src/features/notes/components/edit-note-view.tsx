"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NoteForm } from "@/features/notes/components/note-form";
import { extractApiError } from "@/lib/utils/api-error";
import type { NoteFormValues } from "@/lib/validations/note";
import { useGetNoteQuery, useUpdateNoteMutation } from "@/store/api/notesApi";

export function EditNoteView({ id }: { id: string }) {
  const router = useRouter();
  const { data: note, isLoading, isError, error, refetch } = useGetNoteQuery(id);
  const [updateNote, { isLoading: isSaving }] = useUpdateNoteMutation();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-96 w-full rounded-xl" />
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

  const handleUpdate = async (values: NoteFormValues) => {
    await updateNote({ id: note.id, ...values }).unwrap();
    toast.success("Note updated.");
    router.push(`/notes/${note.id}`);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Edit Note"
        description={`Updating "${note.title}"`}
        breadcrumbs={[
          { label: "My Notes", href: "/notes" },
          { label: note.title, href: `/notes/${note.id}` },
          { label: "Edit" },
        ]}
      />

      <NoteForm
        defaultValues={{
          title: note.title,
          content: note.content,
        }}
        submitLabel="Save Changes"
        cancelHref={`/notes/${note.id}`}
        isSubmitting={isSaving}
        onSubmitValues={handleUpdate}
      />
    </div>
  );
}

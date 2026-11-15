"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { NoteForm } from "@/features/notes/components/note-form";
import type { NoteFormValues } from "@/lib/validations/note";
import { useCreateNoteMutation } from "@/store/api/notesApi";

export function CreateNoteView() {
  const router = useRouter();
  const [createNote, { isLoading }] = useCreateNoteMutation();

  const handleCreate = async (values: NoteFormValues) => {
    const created = await createNote(values).unwrap();
    toast.success("Note created.");
    router.push(`/notes/${created.id}`);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Create Note"
        description="Write a new private note in your workspace."
        breadcrumbs={[
          { label: "My Notes", href: "/notes" },
          { label: "New Note" },
        ]}
      />

      <NoteForm
        submitLabel="Save Note"
        cancelHref="/notes"
        isSubmitting={isLoading}
        resetOnSuccess
        onSubmitValues={handleCreate}
      />
    </div>
  );
}

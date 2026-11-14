import type { Metadata } from "next";
import { EditNoteView } from "@/features/notes/components/edit-note-view";

export const metadata: Metadata = {
  title: "Edit Note",
};

export default async function EditNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditNoteView id={id} />;
}

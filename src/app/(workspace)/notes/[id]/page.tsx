import type { Metadata } from "next";
import { NoteDetailView } from "@/features/notes/components/note-detail-view";

export const metadata: Metadata = {
  title: "Note Details",
};

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <NoteDetailView id={id} />;
}

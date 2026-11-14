import type { Metadata } from "next";
import { CreateNoteView } from "@/features/notes/components/create-note-view";

export const metadata: Metadata = {
  title: "New Note",
};

export default function NewNotePage() {
  return <CreateNoteView />;
}

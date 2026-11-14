import type { Metadata } from "next";
import { NotesListView } from "@/features/notes/components/notes-list-view";

export const metadata: Metadata = {
  title: "My Notes",
};

export default function NotesPage() {
  return <NotesListView />;
}

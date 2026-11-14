"use client";

import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { extractApiError } from "@/lib/utils/api-error";
import { useDeleteNoteMutation } from "@/store/api/notesApi";

interface DeleteNoteDialogProps {
  noteId: string | null;
  noteTitle?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}

export function DeleteNoteDialog({
  noteId,
  noteTitle,
  open,
  onOpenChange,
  onDeleted,
}: DeleteNoteDialogProps) {
  const [deleteNote, { isLoading }] = useDeleteNoteMutation();

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!noteId) {
      return;
    }

    try {
      await deleteNote(noteId).unwrap();
      toast.success("Note deleted.");
      onOpenChange(false);
      onDeleted?.();
    } catch (error) {
      toast.error(extractApiError(error).message);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this note?</AlertDialogTitle>
          <AlertDialogDescription>
            {noteTitle
              ? `This will permanently delete "${noteTitle}". This action cannot be undone.`
              : "This will permanently delete this note. This action cannot be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoaderCircle
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
                Deleting...
              </>
            ) : (
              "Delete note"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

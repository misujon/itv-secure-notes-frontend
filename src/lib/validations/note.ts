import { z } from "zod";

export const noteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(200, "Title must not exceed 200 characters."),
  content: z
    .string()
    .trim()
    .min(1, "Content is required.")
    .max(50000, "Content must not exceed 50,000 characters."),
});

export type NoteFormValues = z.infer<typeof noteSchema>;

import { z } from "zod";
import { stripHtml } from "@/lib/utils/html";

export const postSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(200, "Title must not exceed 200 characters."),
  content: z
    .string()
    .max(50000, "Content must not exceed 50,000 characters.")
    .refine((val) => stripHtml(val).length > 0, {
      message: "Content is required.",
    }),
});

export type PostFormValues = z.infer<typeof postSchema>;

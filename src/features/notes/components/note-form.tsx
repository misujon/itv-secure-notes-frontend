"use client";

import { useState } from "react";
import Link from "next/link";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, LoaderCircle, Save } from "lucide-react";
import { RichTextEditor } from "@/components/shared/rich-text-editor";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { applyServerValidationErrors } from "@/lib/utils/api-error";
import { stripHtml } from "@/lib/utils/html";
import { noteSchema, type NoteFormValues } from "@/lib/validations/note";

interface NoteFormProps {
  defaultValues?: NoteFormValues;
  submitLabel: string;
  cancelHref: string;
  isSubmitting: boolean;
  onSubmitValues: (values: NoteFormValues) => Promise<void>;
}

export function NoteForm({
  defaultValues = { title: "", content: "" },
  submitLabel,
  cancelHref,
  isSubmitting,
  onSubmitValues,
}: NoteFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues,
  });

  const titleValue = useWatch({ control, name: "title" }) ?? "";
  const contentValue = useWatch({ control, name: "content" }) ?? "";

  const handleFormSubmit = async (values: NoteFormValues) => {
    setServerError(null);
    try {
      await onSubmitValues(values);
    } catch (error) {
      const message = applyServerValidationErrors(error, setError, [
        "title",
        "content",
      ]);
      setServerError(message);
    }
  };

  return (
    <Card className="border-border shadow-xs">
      <CardContent className="pt-6">
        {serverError ? (
          <div
            role="alert"
            className="mb-5 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
          >
            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{serverError}</span>
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-5"
          noValidate
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="note-title">Title</Label>
              <span className="text-xs text-muted-foreground">
                {titleValue.length}/200
              </span>
            </div>
            <Input
              id="note-title"
              type="text"
              placeholder="Give your note a clear title"
              maxLength={200}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "note-title-error" : undefined}
              disabled={isSubmitting}
              {...register("title")}
            />
            {errors.title ? (
              <p id="note-title-error" className="text-xs text-destructive">
                {errors.title.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="note-content">Content</Label>
              <span className="text-xs text-muted-foreground">
                {stripHtml(contentValue).length.toLocaleString()} chars
              </span>
            </div>
            <Controller
              control={control}
              name="content"
              render={({ field }) => (
                <RichTextEditor
                  id="note-content"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Write your note here..."
                  disabled={isSubmitting}
                  invalid={Boolean(errors.content)}
                  describedBy={
                    errors.content ? "note-content-error" : undefined
                  }
                />
              )}
            />
            {errors.content ? (
              <p id="note-content-error" className="text-xs text-destructive">
                {errors.content.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-border">
            <Link
              href={cancelHref}
              className={buttonVariants({ variant: "outline" })}
            >
              Cancel
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircle
                    className="mr-2 size-4 animate-spin"
                    aria-hidden="true"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 size-4" aria-hidden="true" />
                  {submitLabel}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

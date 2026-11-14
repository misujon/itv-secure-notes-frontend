"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, LoaderCircle, Save } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { applyServerValidationErrors } from "@/lib/utils/api-error";
import { postSchema, type PostFormValues } from "@/lib/validations/post";
import { useCreatePostMutation } from "@/store/api/postsApi";

export function CreatePostView() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [createPost, { isLoading }] = useCreatePostMutation();

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: "", content: "" },
  });

  const titleValue = useWatch({ control, name: "title" }) ?? "";
  const contentValue = useWatch({ control, name: "content" }) ?? "";

  const onSubmit = async (values: PostFormValues) => {
    setServerError(null);
    try {
      const post = await createPost(values).unwrap();
      toast.success("Post published.");
      router.push(`/posts/${post.id}`);
    } catch (error) {
      const message = applyServerValidationErrors(error, setError, [
        "title",
        "content",
      ]);
      setServerError(message);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Publish Post"
        description="Share a public post visible to everyone."
        breadcrumbs={[
          { label: "Public Posts", href: "/posts" },
          { label: "New Post" },
        ]}
      />

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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="post-title">Title</Label>
                <span className="text-xs text-muted-foreground">
                  {titleValue.length}/200
                </span>
              </div>
              <Input
                id="post-title"
                type="text"
                placeholder="Give your post a clear title"
                maxLength={200}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "post-title-error" : undefined}
                disabled={isLoading}
                {...register("title")}
              />
              {errors.title ? (
                <p id="post-title-error" className="text-xs text-destructive">
                  {errors.title.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="post-content">Content</Label>
                <span className="text-xs text-muted-foreground">
                  {contentValue.length.toLocaleString()}/50,000
                </span>
              </div>
              <Textarea
                id="post-content"
                rows={10}
                placeholder="Write your public post..."
                maxLength={50000}
                className="min-h-[220px] resize-y leading-relaxed"
                aria-invalid={Boolean(errors.content)}
                aria-describedby={
                  errors.content ? "post-content-error" : undefined
                }
                disabled={isLoading}
                {...register("content")}
              />
              {errors.content ? (
                <p id="post-content-error" className="text-xs text-destructive">
                  {errors.content.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-border">
              <Link
                href="/posts"
                className={buttonVariants({ variant: "outline" })}
              >
                Cancel
              </Link>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <LoaderCircle
                      className="mr-2 size-4 animate-spin"
                      aria-hidden="true"
                    />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 size-4" aria-hidden="true" />
                    Publish Post
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

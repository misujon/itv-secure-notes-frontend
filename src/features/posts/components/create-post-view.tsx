"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { PostForm } from "@/features/posts/components/post-form";
import type { PostFormValues } from "@/lib/validations/post";
import { useCreatePostMutation } from "@/store/api/postsApi";

export function CreatePostView() {
  const router = useRouter();
  const [createPost, { isLoading }] = useCreatePostMutation();

  const handleCreate = async (values: PostFormValues) => {
    const post = await createPost(values).unwrap();
    toast.success("Post published.");
    router.push(`/posts/${post.id}`);
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

      <PostForm
        submitLabel="Publish Post"
        cancelHref="/posts"
        isSubmitting={isLoading}
        onSubmitValues={handleCreate}
      />
    </div>
  );
}

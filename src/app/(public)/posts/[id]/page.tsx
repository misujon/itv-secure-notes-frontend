import type { Metadata } from "next";
import { PostDetailView } from "@/features/posts/components/post-detail-view";

export const metadata: Metadata = {
  title: "Post Details",
};

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PostDetailView id={id} />;
}

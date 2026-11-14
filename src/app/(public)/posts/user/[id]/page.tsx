import type { Metadata } from "next";
import { UserPostsView } from "@/features/posts/components/user-posts-view";

export const metadata: Metadata = {
  title: "Author Posts",
};

export default async function UserPostsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <UserPostsView userId={id} />;
}

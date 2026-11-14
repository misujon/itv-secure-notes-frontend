import type { Metadata } from "next";
import { PostsListView } from "@/features/posts/components/posts-list-view";

export const metadata: Metadata = {
  title: "Public Posts",
};

export default function PostsPage() {
  return <PostsListView />;
}

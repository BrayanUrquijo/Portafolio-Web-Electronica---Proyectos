import { Suspense } from "react";
import { getStorage } from "@/lib/data";
import { FeedContent } from "@/components/posts/FeedContent";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const storage = getStorage();
  const posts = await storage.getPosts();
  const publishedPosts = posts
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <Suspense>
      <FeedContent posts={publishedPosts} />
    </Suspense>
  );
}

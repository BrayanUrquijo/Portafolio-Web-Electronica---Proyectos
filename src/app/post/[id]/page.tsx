import { notFound } from "next/navigation";
import { getStorage } from "@/lib/data";
import { PostDetail } from "@/components/posts/PostDetail";

export const dynamic = "force-dynamic";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const storage = getStorage();
  const post = await storage.getPostById(id);

  if (!post || !post.published) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <PostDetail post={post} />
    </div>
  );
}

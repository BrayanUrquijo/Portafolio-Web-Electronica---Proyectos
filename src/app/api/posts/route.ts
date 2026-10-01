import { NextRequest, NextResponse } from "next/server";
import { getStorage } from "@/lib/data";
import { v4 as uuid } from "uuid";
import { slugify } from "@/lib/utils";
import type { Post, PostCategory, PostMedia } from "@/lib/data/types";

export const dynamic = "force-dynamic";

function extractCoverFromContent(content: string): PostMedia | undefined {
  const match = content.match(/<img[^>]+src="([^"]+)"[^>]*>/);
  if (!match) return undefined;
  return { type: "image", url: match[1], publicId: "", alt: "" };
}

export async function GET(request: NextRequest) {
  const storage = getStorage();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") as PostCategory | null;
  const semester = searchParams.get("semester");
  const all = searchParams.get("all");

  let posts = await storage.getPosts();

  if (!all) {
    posts = posts.filter((p) => p.published);
  }
  if (category) posts = posts.filter((p) => p.category === category);
  if (semester) posts = posts.filter((p) => p.semester === parseInt(semester));

  posts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json({ success: true, data: posts });
}

export async function POST(request: NextRequest) {
  const storage = getStorage();
  const body = await request.json();

  const post: Post = {
    id: uuid(),
    title: body.title,
    slug: slugify(body.title),
    excerpt: body.excerpt || "",
    content: body.content || "",
    category: body.category || "otro",
    semester: body.semester || 1,
    media: body.media || [],
    coverImage: body.coverImage || extractCoverFromContent(body.content || ""),
    tags: body.tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: body.published ?? false,
  };

  const created = await storage.createPost(post);
  return NextResponse.json({ success: true, data: created }, { status: 201 });
}

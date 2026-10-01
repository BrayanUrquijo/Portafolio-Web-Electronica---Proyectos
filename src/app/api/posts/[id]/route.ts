import { NextRequest, NextResponse } from "next/server";
import { getStorage } from "@/lib/data";
import type { PostMedia } from "@/lib/data/types";

function extractCoverFromContent(content: string): PostMedia | undefined {
  const match = content.match(/<img[^>]+src="([^"]+)"[^>]*>/);
  if (!match) return undefined;
  return { type: "image", url: match[1], publicId: "", alt: "" };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const storage = getStorage();
  const post = await storage.getPostById(id);

  if (!post) {
    return NextResponse.json(
      { success: false, error: "Post not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { success: true, data: post },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const storage = getStorage();
  const body = await request.json();

  try {
    if (!body.coverImage && body.content) {
      body.coverImage = extractCoverFromContent(body.content);
    }
    const updated = await storage.updatePost(id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT /api/posts error:", error);
    return NextResponse.json(
      { success: false, error: "Post not found" },
      { status: 404 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const storage = getStorage();
  await storage.deletePost(id);
  return NextResponse.json({ success: true });
}

import { NextRequest, NextResponse } from "next/server";
import { get, BlobNotFoundError } from "@vercel/blob";

const MIME_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  md: "text/markdown; charset=utf-8",
  txt: "text/plain; charset=utf-8",
};

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get("path");
  if (!pathname) {
    return NextResponse.json({ error: "Path required" }, { status: 400 });
  }

  if (!pathname.startsWith("uploads/")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 403 });
  }

  try {
    const blob = await get(pathname, { access: "private" });
    if (!blob) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const ext = pathname.split(".").pop()?.toLowerCase() || "";
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    const buffer = await new Response(blob.stream).arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "inline",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    if (error instanceof BlobNotFoundError) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    console.error("serve-file error:", error);
    return NextResponse.json({ error: "Failed to serve file" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { head } from "@vercel/blob";

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
    const blob = await head(pathname);
    const res = await fetch(blob.downloadUrl);

    if (!res.ok) {
      throw new Error(`Blob fetch failed: ${res.status}`);
    }

    const ext = pathname.split(".").pop()?.toLowerCase() || "";
    const contentType = MIME_TYPES[ext] || blob.contentType || "application/octet-stream";

    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "inline",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("serve-file error:", error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}

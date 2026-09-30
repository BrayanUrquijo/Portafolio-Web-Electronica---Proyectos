import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = ["res.cloudinary.com", "localhost"];

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "URL required" }, { status: 400 });
  }

  try {
    const parsed = new URL(url);
    if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
      return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const text = await res.text();
    return new NextResponse(text, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

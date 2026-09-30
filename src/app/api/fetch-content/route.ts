import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_HOSTS = ["res.cloudinary.com", "localhost"];

function signCloudinaryUrl(originalUrl: string): string {
  try {
    const parsed = new URL(originalUrl);
    if (parsed.hostname !== "res.cloudinary.com") return originalUrl;

    const segments = parsed.pathname.slice(1).split("/");
    const resourceType = segments[1];
    const rest = segments.slice(3);
    const publicIdWithExt = rest.filter((s) => !/^v\d+$/.test(s)).join("/");

    return cloudinary.url(publicIdWithExt, {
      resource_type: resourceType,
      type: "upload",
      sign_url: true,
      secure: true,
    });
  } catch {
    return originalUrl;
  }
}

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

  const isPdf = url.endsWith(".pdf") || request.nextUrl.searchParams.get("type") === "pdf";
  const fetchUrl = signCloudinaryUrl(url);

  try {
    const res = await fetch(fetchUrl);

    if (!res.ok) {
      console.error(`Fetch content failed: ${res.status} for ${fetchUrl}`);
      throw new Error(`Fetch failed: ${res.status}`);
    }

    if (isPdf) {
      const buffer = await res.arrayBuffer();
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": "inline",
        },
      });
    }

    const text = await res.text();
    return new NextResponse(text, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("fetch-content error:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

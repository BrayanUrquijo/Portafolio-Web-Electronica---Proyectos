import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";

export const config = {
  matcher: ["/admin/:path+", "/api/posts", "/api/posts/:path*", "/api/profile", "/api/upload"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    request.method === "GET" &&
    (pathname.startsWith("/api/posts") || pathname === "/api/profile")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin-token")?.value;

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  try {
    await verifyToken(token);
    return NextResponse.next();
  } catch {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin", request.url));
  }
}

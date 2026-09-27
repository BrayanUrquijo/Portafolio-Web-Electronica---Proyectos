import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth/jwt";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { success: false, error: "Contraseña incorrecta" },
      { status: 401 }
    );
  }

  const token = await signToken();

  const response = NextResponse.json({ success: true });
  response.cookies.set("admin-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return response;
}

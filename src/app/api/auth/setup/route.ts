import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth/jwt";
import { getAdminConfig, saveAdminConfig, hashPassword } from "@/lib/auth/password";

export async function POST(request: NextRequest) {
  const config = await getAdminConfig();
  if (config?.setupComplete) {
    return NextResponse.json(
      { success: false, error: "Setup ya completado" },
      { status: 400 }
    );
  }

  const { password, confirmPassword } = await request.json();

  if (!password || password.length < 4) {
    return NextResponse.json(
      { success: false, error: "La contraseña debe tener al menos 4 caracteres" },
      { status: 400 }
    );
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { success: false, error: "Las contraseñas no coinciden" },
      { status: 400 }
    );
  }

  await saveAdminConfig({
    passwordHash: hashPassword(password),
    setupComplete: true,
    updatedAt: new Date().toISOString(),
  });

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

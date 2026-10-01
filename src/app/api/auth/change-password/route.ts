import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";
import { verifyPassword, saveAdminConfig, hashPassword } from "@/lib/auth/password";

export async function PUT(request: NextRequest) {
  const token = request.cookies.get("admin-token")?.value;
  if (!token) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    await verifyToken(token);
  } catch {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { currentPassword, newPassword, confirmPassword } = await request.json();

  if (!newPassword || newPassword.length < 4) {
    return NextResponse.json(
      { success: false, error: "La nueva contraseña debe tener al menos 4 caracteres" },
      { status: 400 }
    );
  }

  if (newPassword !== confirmPassword) {
    return NextResponse.json(
      { success: false, error: "Las contraseñas no coinciden" },
      { status: 400 }
    );
  }

  const isValid = await verifyPassword(currentPassword);
  if (!isValid) {
    return NextResponse.json(
      { success: false, error: "Contraseña actual incorrecta" },
      { status: 401 }
    );
  }

  await saveAdminConfig({
    passwordHash: hashPassword(newPassword),
    setupComplete: true,
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}

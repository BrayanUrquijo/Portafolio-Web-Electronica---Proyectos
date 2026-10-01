import { NextRequest, NextResponse } from "next/server";
import { getThemeColor, saveThemeColor, THEME_PRESETS } from "@/lib/theme";

export async function GET() {
  const color = await getThemeColor();
  return NextResponse.json({ success: true, data: { color } });
}

export async function PUT(request: NextRequest) {
  const { color } = await request.json();

  if (!color || !THEME_PRESETS[color]) {
    return NextResponse.json(
      { success: false, error: "Color no válido" },
      { status: 400 }
    );
  }

  await saveThemeColor(color);
  return NextResponse.json({ success: true, data: { color } });
}

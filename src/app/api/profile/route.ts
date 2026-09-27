import { NextRequest, NextResponse } from "next/server";
import { getStorage } from "@/lib/data";

export async function GET() {
  const storage = getStorage();
  const profile = await storage.getProfile();
  return NextResponse.json({ success: true, data: profile });
}

export async function PUT(request: NextRequest) {
  const storage = getStorage();
  const body = await request.json();

  const updated = await storage.updateProfile(body);
  return NextResponse.json({ success: true, data: updated });
}

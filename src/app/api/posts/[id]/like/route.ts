import { NextRequest, NextResponse } from "next/server";
import { toggleLike } from "@/lib/data/analytics";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { action, visitorId } = await request.json();

  if (!visitorId) {
    return NextResponse.json(
      { success: false, error: "visitorId requerido" },
      { status: 400 }
    );
  }

  const analytics = await toggleLike(id, visitorId, action === "like");
  return NextResponse.json({ success: true, data: analytics });
}

import { NextRequest, NextResponse } from "next/server";
import { toggleLike } from "@/lib/data/analytics";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { action } = await request.json();
  const analytics = await toggleLike(id, action === "like");
  return NextResponse.json({ success: true, data: analytics });
}

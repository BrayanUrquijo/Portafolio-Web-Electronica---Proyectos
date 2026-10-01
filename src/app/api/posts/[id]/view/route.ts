import { NextRequest, NextResponse } from "next/server";
import { incrementView } from "@/lib/data/analytics";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const analytics = await incrementView(id);
  return NextResponse.json({ success: true, data: analytics });
}

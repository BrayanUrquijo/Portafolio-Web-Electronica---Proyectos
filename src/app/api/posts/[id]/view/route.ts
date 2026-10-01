import { NextRequest, NextResponse } from "next/server";
import { getPostAnalytics, incrementView } from "@/lib/data/analytics";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const analytics = await getPostAnalytics(id);
  return NextResponse.json({ success: true, data: analytics });
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const analytics = await incrementView(id);
  return NextResponse.json({ success: true, data: analytics });
}

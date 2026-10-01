import { NextResponse } from "next/server";
import { getAllAnalytics } from "@/lib/data/analytics";

export async function GET() {
  const data = await getAllAnalytics();
  return NextResponse.json({ success: true, data });
}

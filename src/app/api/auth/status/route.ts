import { NextResponse } from "next/server";
import { getAdminConfig } from "@/lib/auth/password";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ setupComplete: true });
  }
  const config = await getAdminConfig();
  return NextResponse.json({ setupComplete: !!config?.setupComplete });
}

import { put, get, BlobNotFoundError } from "@vercel/blob";
import { createHash } from "crypto";

const CONFIG_KEY = "data/admin-config.json";

interface AdminConfig {
  passwordHash: string;
  setupComplete: boolean;
  updatedAt: string;
}

export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export async function getAdminConfig(): Promise<AdminConfig | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const result = await get(CONFIG_KEY, { access: "private" });
    if (!result) return null;
    return new Response(result.stream).json();
  } catch (error) {
    if (error instanceof BlobNotFoundError) return null;
    console.error("getAdminConfig error:", error);
    return null;
  }
}

export async function saveAdminConfig(config: AdminConfig): Promise<void> {
  await put(CONFIG_KEY, JSON.stringify(config), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function verifyPassword(password: string): Promise<boolean> {
  if (process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD) {
    return true;
  }
  const config = await getAdminConfig();
  if (config?.setupComplete) {
    return hashPassword(password) === config.passwordHash;
  }
  return false;
}

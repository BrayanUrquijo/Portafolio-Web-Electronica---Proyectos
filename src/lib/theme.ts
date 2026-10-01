import { put, get, BlobNotFoundError } from "@vercel/blob";

export const THEME_PRESETS: Record<string, { label: string; dark: string; light: string }> = {
  cyan: { label: "Cian", dark: "#00f0ff", light: "#0891b2" },
  magenta: { label: "Magenta", dark: "#ff00e5", light: "#c026d3" },
  violet: { label: "Violeta", dark: "#8b5cf6", light: "#7c3aed" },
  blue: { label: "Azul", dark: "#3b82f6", light: "#2563eb" },
  green: { label: "Verde", dark: "#39ff14", light: "#16a34a" },
  pink: { label: "Rosa", dark: "#f472b6", light: "#db2777" },
  yellow: { label: "Amarillo", dark: "#facc15", light: "#ca8a04" },
};

const THEME_KEY = "data/theme.json";

export async function getThemeColor(): Promise<string> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return "cyan";
  try {
    const result = await get(THEME_KEY, { access: "private" });
    if (!result) return "cyan";
    const data: { color: string } = await new Response(result.stream).json();
    return data.color && THEME_PRESETS[data.color] ? data.color : "cyan";
  } catch (error) {
    if (error instanceof BlobNotFoundError) return "cyan";
    return "cyan";
  }
}

export async function saveThemeColor(color: string): Promise<void> {
  await put(THEME_KEY, JSON.stringify({ color }), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export function getThemeCSS(color: string): string {
  const preset = THEME_PRESETS[color] || THEME_PRESETS.cyan;
  return `:root{--neon-primary:${preset.dark};--neon-primary-light:${preset.light}}`;
}

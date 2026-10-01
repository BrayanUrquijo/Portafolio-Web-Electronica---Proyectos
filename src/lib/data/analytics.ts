import { put, get, BlobNotFoundError } from "@vercel/blob";
import type { PostAnalytics } from "./types";

const ANALYTICS_KEY = "data/analytics.json";

type AnalyticsMap = Record<string, PostAnalytics>;

async function readAnalytics(): Promise<AnalyticsMap> {
  try {
    const result = await get(ANALYTICS_KEY, { access: "private" });
    if (!result) return {};
    return new Response(result.stream).json();
  } catch (error) {
    if (error instanceof BlobNotFoundError) return {};
    return {};
  }
}

async function writeAnalytics(data: AnalyticsMap): Promise<void> {
  await put(ANALYTICS_KEY, JSON.stringify(data), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function getAllAnalytics(): Promise<AnalyticsMap> {
  return readAnalytics();
}

export async function getPostAnalytics(postId: string): Promise<PostAnalytics> {
  const all = await readAnalytics();
  return all[postId] || { views: 0, likes: 0 };
}

export async function incrementView(postId: string): Promise<PostAnalytics> {
  const all = await readAnalytics();
  if (!all[postId]) all[postId] = { views: 0, likes: 0 };
  all[postId].views += 1;
  await writeAnalytics(all);
  return all[postId];
}

export async function toggleLike(postId: string, add: boolean): Promise<PostAnalytics> {
  const all = await readAnalytics();
  if (!all[postId]) all[postId] = { views: 0, likes: 0 };
  all[postId].likes = Math.max(0, all[postId].likes + (add ? 1 : -1));
  await writeAnalytics(all);
  return all[postId];
}

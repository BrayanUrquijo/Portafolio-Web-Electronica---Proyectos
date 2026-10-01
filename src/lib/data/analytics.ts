import { put, get, BlobNotFoundError } from "@vercel/blob";
import type { PostAnalytics } from "./types";

const VIEWS_KEY = "data/analytics-views.json";
const LIKES_KEY = "data/analytics-likes.json";

type CountMap = Record<string, number>;

async function readCountMap(key: string): Promise<CountMap> {
  try {
    const result = await get(key, { access: "private" });
    if (!result) return {};
    return new Response(result.stream).json();
  } catch (error) {
    if (error instanceof BlobNotFoundError) return {};
    return {};
  }
}

async function writeCountMap(key: string, data: CountMap): Promise<void> {
  await put(key, JSON.stringify(data), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function getAllAnalytics(): Promise<Record<string, PostAnalytics>> {
  const [views, likes] = await Promise.all([
    readCountMap(VIEWS_KEY),
    readCountMap(LIKES_KEY),
  ]);
  const allIds = new Set([...Object.keys(views), ...Object.keys(likes)]);
  const result: Record<string, PostAnalytics> = {};
  for (const id of allIds) {
    result[id] = { views: views[id] || 0, likes: likes[id] || 0 };
  }
  return result;
}

export async function getPostAnalytics(postId: string): Promise<PostAnalytics> {
  const [views, likes] = await Promise.all([
    readCountMap(VIEWS_KEY),
    readCountMap(LIKES_KEY),
  ]);
  return { views: views[postId] || 0, likes: likes[postId] || 0 };
}

export async function incrementView(postId: string): Promise<PostAnalytics> {
  const views = await readCountMap(VIEWS_KEY);
  views[postId] = (views[postId] || 0) + 1;
  await writeCountMap(VIEWS_KEY, views);
  const likes = await readCountMap(LIKES_KEY);
  return { views: views[postId], likes: likes[postId] || 0 };
}

export async function toggleLike(postId: string, add: boolean): Promise<PostAnalytics> {
  const likes = await readCountMap(LIKES_KEY);
  likes[postId] = Math.max(0, (likes[postId] || 0) + (add ? 1 : -1));
  await writeCountMap(LIKES_KEY, likes);
  const views = await readCountMap(VIEWS_KEY);
  return { views: views[postId] || 0, likes: likes[postId] };
}

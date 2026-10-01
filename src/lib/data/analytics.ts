import { put, del, get, list, BlobNotFoundError } from "@vercel/blob";
import type { PostAnalytics } from "./types";

const VIEWS_KEY = "data/analytics-views.json";
const LIKES_PREFIX = "data/likes/";

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

async function countLikes(postId: string): Promise<number> {
  try {
    const { blobs } = await list({ prefix: `${LIKES_PREFIX}${postId}/` });
    return blobs.length;
  } catch {
    return 0;
  }
}

async function countAllLikes(): Promise<Record<string, number>> {
  try {
    const { blobs } = await list({ prefix: LIKES_PREFIX, limit: 1000 });
    const counts: Record<string, number> = {};
    for (const blob of blobs) {
      const parts = blob.pathname.split("/");
      if (parts.length >= 3) {
        const postId = parts[2];
        counts[postId] = (counts[postId] || 0) + 1;
      }
    }
    return counts;
  } catch {
    return {};
  }
}

export async function getAllAnalytics(): Promise<Record<string, PostAnalytics>> {
  const [views, likeCounts] = await Promise.all([
    readCountMap(VIEWS_KEY),
    countAllLikes(),
  ]);
  const allIds = new Set([...Object.keys(views), ...Object.keys(likeCounts)]);
  const result: Record<string, PostAnalytics> = {};
  for (const id of allIds) {
    result[id] = { views: views[id] || 0, likes: likeCounts[id] || 0 };
  }
  return result;
}

export async function getPostAnalytics(postId: string): Promise<PostAnalytics> {
  const [views, likes] = await Promise.all([
    readCountMap(VIEWS_KEY),
    countLikes(postId),
  ]);
  return { views: views[postId] || 0, likes };
}

export async function incrementView(postId: string): Promise<PostAnalytics> {
  const views = await readCountMap(VIEWS_KEY);
  views[postId] = (views[postId] || 0) + 1;
  await writeCountMap(VIEWS_KEY, views);
  const likes = await countLikes(postId);
  return { views: views[postId], likes };
}

export async function toggleLike(
  postId: string,
  visitorId: string,
  add: boolean
): Promise<PostAnalytics> {
  const likeKey = `${LIKES_PREFIX}${postId}/${visitorId}`;
  if (add) {
    await put(likeKey, "1", {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "text/plain",
    });
  } else {
    try {
      await del(likeKey);
    } catch {
      // already deleted
    }
  }
  const [views, likes] = await Promise.all([
    readCountMap(VIEWS_KEY),
    countLikes(postId),
  ]);
  return { views: views[postId] || 0, likes };
}

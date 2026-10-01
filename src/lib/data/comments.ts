import { put, get, BlobNotFoundError } from "@vercel/blob";
import type { Comment } from "./types";

function commentsKey(postId: string): string {
  return `data/comments/${postId}.json`;
}

export async function getComments(postId: string): Promise<Comment[]> {
  try {
    const result = await get(commentsKey(postId), { access: "private" });
    if (!result) return [];
    return new Response(result.stream).json();
  } catch (error) {
    if (error instanceof BlobNotFoundError) return [];
    return [];
  }
}

async function writeComments(postId: string, data: Comment[]): Promise<void> {
  await put(commentsKey(postId), JSON.stringify(data), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function addComment(postId: string, comment: Comment): Promise<Comment[]> {
  const comments = await getComments(postId);
  comments.push(comment);
  await writeComments(postId, comments);
  return comments;
}

export async function deleteComment(postId: string, commentId: string): Promise<Comment[]> {
  const comments = await getComments(postId);
  const filtered = comments.filter((c) => c.id !== commentId);
  await writeComments(postId, filtered);
  return filtered;
}

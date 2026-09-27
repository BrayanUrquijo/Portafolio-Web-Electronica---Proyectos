import type { Post, Profile } from "./types";
import { LocalStorage } from "./local-storage";
import { BlobStorage } from "./blob-storage";

export interface DataStorage {
  getPosts(): Promise<Post[]>;
  getPostById(id: string): Promise<Post | null>;
  createPost(post: Post): Promise<Post>;
  updatePost(id: string, data: Partial<Post>): Promise<Post>;
  deletePost(id: string): Promise<void>;
  getProfile(): Promise<Profile>;
  updateProfile(data: Partial<Profile>): Promise<Profile>;
}

let storageInstance: DataStorage | null = null;

export function getStorage(): DataStorage {
  if (storageInstance) return storageInstance;

  const hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
  console.log(`Storage: using ${hasBlob ? "BlobStorage" : "LocalStorage"}, VERCEL=${!!process.env.VERCEL}`);

  if (hasBlob) {
    storageInstance = new BlobStorage();
  } else {
    storageInstance = new LocalStorage();
  }

  return storageInstance;
}

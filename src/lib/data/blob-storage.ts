import { put, get, BlobNotFoundError } from "@vercel/blob";
import type { Post, Profile } from "./types";
import type { DataStorage } from "./storage";

const POSTS_KEY = "data/posts.json";
const PROFILE_KEY = "data/profile.json";

async function readBlob<T>(key: string, fallback: T): Promise<T> {
  try {
    const result = await get(key, { access: "private" });
    if (!result) return fallback;
    return new Response(result.stream).json();
  } catch (error) {
    if (error instanceof BlobNotFoundError) return fallback;
    console.error(`readBlob error for ${key}:`, error);
    return fallback;
  }
}

async function writeBlob<T>(key: string, data: T): Promise<void> {
  await put(key, JSON.stringify(data), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

const DEFAULT_PROFILE: Profile = {
  name: "Tu Nombre",
  photoUrl: "",
  photoPublicId: "",
  bio: "Estudiante de Tecnología en Electrónica Industrial.",
  careers: [{ name: "Tecnología en Electrónica Industrial", semester: 1 }],
  university: "Tu Universidad",
  socialLinks: {},
  goals: [],
  updatedAt: new Date().toISOString(),
};

export class BlobStorage implements DataStorage {
  async getPosts(): Promise<Post[]> {
    return readBlob<Post[]>(POSTS_KEY, []);
  }

  async getPostById(id: string): Promise<Post | null> {
    const posts = await this.getPosts();
    return posts.find((p) => p.id === id) ?? null;
  }

  async createPost(post: Post): Promise<Post> {
    const posts = await this.getPosts();
    posts.push(post);
    await writeBlob(POSTS_KEY, posts);
    return post;
  }

  async updatePost(id: string, data: Partial<Post>): Promise<Post> {
    let posts = await this.getPosts();
    let index = posts.findIndex((p) => p.id === id);

    if (index === -1) {
      await new Promise((r) => setTimeout(r, 1500));
      posts = await this.getPosts();
      index = posts.findIndex((p) => p.id === id);
      if (index === -1) throw new Error("Post not found");
    }

    posts[index] = { ...posts[index], ...data, updatedAt: new Date().toISOString() };
    await writeBlob(POSTS_KEY, posts);
    return posts[index];
  }

  async deletePost(id: string): Promise<void> {
    const posts = await this.getPosts();
    const filtered = posts.filter((p) => p.id !== id);
    await writeBlob(POSTS_KEY, filtered);
  }

  async getProfile(): Promise<Profile> {
    return readBlob<Profile>(PROFILE_KEY, DEFAULT_PROFILE);
  }

  async updateProfile(data: Partial<Profile>): Promise<Profile> {
    const profile = await this.getProfile();
    const updated = { ...profile, ...data, updatedAt: new Date().toISOString() };
    await writeBlob(PROFILE_KEY, updated);
    return updated;
  }
}

import fs from "fs/promises";
import path from "path";
import type { Post, Profile } from "./types";
import type { DataStorage } from "./storage";

const DATA_DIR = path.join(process.cwd(), "data");

async function readJson<T>(filename: string): Promise<T> {
  const filePath = path.join(DATA_DIR, filename);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

async function writeJson<T>(filename: string, data: T): Promise<void> {
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export class LocalStorage implements DataStorage {
  async getPosts(): Promise<Post[]> {
    return readJson<Post[]>("posts.json");
  }

  async getPostById(id: string): Promise<Post | null> {
    const posts = await this.getPosts();
    return posts.find((p) => p.id === id) ?? null;
  }

  async createPost(post: Post): Promise<Post> {
    const posts = await this.getPosts();
    posts.push(post);
    await writeJson("posts.json", posts);
    return post;
  }

  async updatePost(id: string, data: Partial<Post>): Promise<Post> {
    const posts = await this.getPosts();
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Post not found");
    posts[index] = { ...posts[index], ...data, updatedAt: new Date().toISOString() };
    await writeJson("posts.json", posts);
    return posts[index];
  }

  async deletePost(id: string): Promise<void> {
    const posts = await this.getPosts();
    const filtered = posts.filter((p) => p.id !== id);
    await writeJson("posts.json", filtered);
  }

  async getProfile(): Promise<Profile> {
    return readJson<Profile>("profile.json");
  }

  async updateProfile(data: Partial<Profile>): Promise<Profile> {
    const profile = await this.getProfile();
    const updated = { ...profile, ...data, updatedAt: new Date().toISOString() };
    await writeJson("profile.json", updated);
    return updated;
  }
}

"use client";

import { useSearchParams } from "next/navigation";
import { SplashScreen } from "@/components/splash/SplashScreen";
import { PostGrid } from "@/components/posts/PostGrid";
import { PostFilters } from "@/components/posts/PostFilters";
import type { Post, PostCategory } from "@/lib/data/types";

export function FeedContent({ posts }: { posts: Post[] }) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") as PostCategory | null;

  const filtered = category
    ? posts.filter((p) => p.category === category)
    : posts;

  return (
    <SplashScreen>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-12">
          <h1 className="font-display text-3xl md:text-5xl font-bold text-neon-cyan text-glow-cyan">
            PORTAFOLIO
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Proyectos, prácticas y evidencias de Ingeniería Electrónica
          </p>
          <div className="flex justify-center">
            <div className="w-20 h-0.5 rounded-full bg-gradient-to-r from-neon-cyan to-neon-violet" />
          </div>
        </div>

        <div className="mb-8">
          <PostFilters />
        </div>

        <PostGrid posts={filtered} />
      </div>
    </SplashScreen>
  );
}

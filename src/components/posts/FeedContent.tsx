"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SplashScreen } from "@/components/splash/SplashScreen";
import { PostGrid } from "@/components/posts/PostGrid";
import { PostFilters } from "@/components/posts/PostFilters";
import type { Post, PostCategory, PostAnalytics } from "@/lib/data/types";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ");
}

export function FeedContent({ posts }: { posts: Post[] }) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") as PostCategory | null;
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [analytics, setAnalytics] = useState<Record<string, PostAnalytics>>({});

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((data) => setAnalytics(data.data || {}))
      .catch(() => {});
  }, []);

  const results = useMemo(() => {
    let filtered = category
      ? posts.filter((p) => p.category === category)
      : posts;

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          stripHtml(p.content).toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return [...filtered].sort((a, b) => {
      const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sortOrder === "newest" ? diff : -diff;
    });
  }, [posts, category, search, sortOrder]);

  return (
    <SplashScreen>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-12">
          <h1 className="font-display text-3xl md:text-5xl font-bold text-neon-cyan text-glow-cyan">
            PORTAFOLIO
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Proyectos, prácticas y evidencias de Tecnología en Electrónica Industrial.
          </p>
          <div className="flex justify-center">
            <div className="w-20 h-0.5 rounded-full bg-gradient-to-r from-neon-cyan to-neon-violet" />
          </div>
        </div>

        <div className="mb-4">
          <PostFilters />
        </div>

        <div className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título, contenido o tags..."
              className="w-full pl-10 pr-3 py-2 rounded-lg text-sm
                         bg-surface-secondary border border-surface-border
                         text-text-primary placeholder:text-text-muted
                         focus:outline-none focus:border-neon-cyan focus:glow-sm
                         transition-all duration-200"
            />
          </div>
          <button
            onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
            className="px-3 py-2 rounded-lg text-sm border border-surface-border
                       bg-surface-secondary text-text-secondary
                       hover:border-neon-cyan hover:text-neon-cyan
                       transition-all duration-200 flex items-center gap-2 shrink-0"
            title={sortOrder === "newest" ? "Más nuevas primero" : "Más antiguas primero"}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {sortOrder === "newest" ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l7.5 7.5 7.5-7.5m-15-6l7.5 7.5 7.5-7.5" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 11.25l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" />
              )}
            </svg>
            {sortOrder === "newest" ? "Recientes" : "Antiguas"}
          </button>
        </div>

        <PostGrid posts={results} analytics={analytics} />
      </div>
    </SplashScreen>
  );
}

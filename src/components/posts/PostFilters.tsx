"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { POST_CATEGORIES } from "@/lib/data/types";
import type { PostCategory } from "@/lib/data/types";

export function PostFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") as PostCategory | null;

  function setCategory(category: PostCategory | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setCategory(null)}
        className={cn(
          "px-3 py-1.5 text-sm rounded-full border transition-all duration-200",
          !activeCategory
            ? "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/50 glow-sm"
            : "text-text-secondary border-surface-border hover:border-text-muted"
        )}
      >
        Todos
      </button>
      {POST_CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => setCategory(cat.value)}
          className={cn(
            "px-3 py-1.5 text-sm rounded-full border transition-all duration-200",
            activeCategory === cat.value
              ? "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/50 glow-sm"
              : "text-text-secondary border-surface-border hover:border-text-muted"
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

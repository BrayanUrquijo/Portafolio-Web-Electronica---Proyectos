"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { formatDate, truncate } from "@/lib/utils";
import type { Post } from "@/lib/data/types";

const categoryColors: Record<string, "cyan" | "magenta" | "violet" | "green" | "yellow" | "default"> = {
  proyecto: "cyan",
  practica: "magenta",
  investigacion: "violet",
  tutorial: "green",
  nota: "yellow",
  otro: "default",
};

export function PostCard({ post }: { post: Post }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/post/${post.id}`} className="block group">
        <div className="rounded-xl border border-surface-border bg-surface-card overflow-hidden
                        transition-all duration-300 group-hover:border-neon-cyan/50 group-hover:glow-sm">
          {post.coverImage ? (
            <div className="relative h-48 overflow-hidden">
              <Image
                src={post.coverImage.url}
                alt={post.coverImage.alt || post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-primary/80 to-transparent" />
            </div>
          ) : (
            <div className="h-48 bg-gradient-to-br from-neon-cyan/5 to-neon-violet/5
                            flex items-center justify-center">
              <svg className="w-12 h-12 text-surface-border" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant={categoryColors[post.category]}>
                {post.category}
              </Badge>
              <span className="text-xs text-text-muted">Sem. {post.semester}</span>
            </div>

            <h3 className="font-display text-lg font-bold text-text-primary group-hover:text-neon-cyan
                           transition-colors line-clamp-2">
              {post.title}
            </h3>

            <p className="text-sm text-text-secondary line-clamp-2">
              {truncate(post.excerpt, 120)}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-surface-border">
              <time className="text-xs text-text-muted">{formatDate(post.createdAt)}</time>
              {post.tags.length > 0 && (
                <span className="text-xs text-text-muted">
                  {post.tags.slice(0, 2).join(", ")}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

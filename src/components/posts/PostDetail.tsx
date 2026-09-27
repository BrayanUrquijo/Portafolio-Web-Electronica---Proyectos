"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/lib/data/types";

const categoryColors: Record<string, "cyan" | "magenta" | "violet" | "green" | "yellow" | "default"> = {
  proyecto: "cyan",
  practica: "magenta",
  investigacion: "violet",
  tutorial: "green",
  nota: "yellow",
  otro: "default",
};

export function PostDetail({ post }: { post: Post }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-neon-cyan
                   transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Volver al inicio
      </Link>

      {post.coverImage && (
        <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
          <Image
            src={post.coverImage.url}
            alt={post.coverImage.alt || post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-primary/60 to-transparent" />
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <Badge variant={categoryColors[post.category]}>{post.category}</Badge>
        <span className="text-sm text-text-muted">Semestre {post.semester}</span>
        <time className="text-sm text-text-muted">{formatDate(post.createdAt)}</time>
      </div>

      <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4">
        {post.title}
      </h1>

      {post.excerpt && (
        <p className="text-lg text-text-secondary mb-8 border-l-2 border-neon-cyan/50 pl-4">
          {post.excerpt}
        </p>
      )}

      <div
        className="prose prose-invert max-w-none
                   prose-headings:font-display prose-headings:text-text-primary
                   prose-p:text-text-secondary prose-a:text-neon-cyan
                   prose-strong:text-text-primary
                   [&_p]:leading-relaxed [&_p]:mb-4
                   [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-4
                   [&_h3]:text-xl [&_h3]:mt-6 [&_h3]:mb-3
                   [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
                   [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
                   [&_li]:mb-1 [&_li]:text-text-secondary"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.media.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-xl font-bold text-text-primary mb-4">Galería</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {post.media.map((media, index) => (
              <div key={index} className="rounded-lg overflow-hidden border border-surface-border">
                {media.type === "image" ? (
                  <Image
                    src={media.url}
                    alt={media.alt || `Imagen ${index + 1}`}
                    width={media.width || 800}
                    height={media.height || 600}
                    className="w-full h-auto"
                  />
                ) : (
                  <video
                    src={media.url}
                    controls
                    className="w-full"
                    preload="metadata"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {post.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="default">#{tag}</Badge>
          ))}
        </div>
      )}
    </motion.article>
  );
}

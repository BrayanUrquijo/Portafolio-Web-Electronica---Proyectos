"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { MarkdownViewer } from "@/components/media/MarkdownViewer";
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

export function PostDetail({ post, isPreview }: { post: Post; isPreview?: boolean }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      {!isPreview && (
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
      )}

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
                   [&_li]:mb-1 [&_li]:text-text-secondary
                   [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-lg [&_iframe]:my-6
                   [&_[data-youtube-video]]:my-6"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.media.filter((m) => m.type === "image" || m.type === "video").length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-xl font-bold text-text-primary mb-4">Galería</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {post.media
              .filter((m) => m.type === "image" || m.type === "video")
              .map((media, index) => (
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

      {post.media.filter((m) => m.type === "pdf" || m.type === "markdown").length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-xl font-bold text-text-primary mb-4">Documentos</h2>
          <div className="space-y-6">
            {post.media
              .filter((m) => m.type === "pdf" || m.type === "markdown")
              .map((doc, index) =>
                doc.type === "markdown" ? (
                  <MarkdownViewer key={index} url={doc.url} filename={doc.filename || doc.alt} />
                ) : (
                  <div key={index} className="rounded-lg border border-surface-border overflow-hidden">
                    <div className="px-4 py-3 border-b border-surface-border bg-surface-elevated flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        <span className="text-sm font-medium text-text-primary">{doc.filename || doc.alt || "Documento PDF"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neon-cyan text-sm hover:underline flex items-center gap-1"
                        >
                          Abrir PDF
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                        </a>
                        <a
                          href={doc.url}
                          download={doc.filename || "documento.pdf"}
                          className="text-neon-cyan text-sm hover:underline"
                        >
                          Descargar
                        </a>
                      </div>
                    </div>
                    <iframe
                      src={doc.url}
                      className="w-full h-[500px] bg-white"
                      title={doc.filename || doc.alt || "PDF"}
                    />
                  </div>
                )
              )}
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

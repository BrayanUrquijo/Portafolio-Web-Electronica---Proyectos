"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownViewerProps {
  url: string;
  filename?: string;
}

export function MarkdownViewer({ url, filename }: MarkdownViewerProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch(`/api/fetch-content?url=${encodeURIComponent(url)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.text();
      })
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [url]);

  if (loading) {
    return (
      <div className="rounded-lg border border-surface-border bg-surface-card p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-surface-elevated rounded w-3/4" />
          <div className="h-4 bg-surface-elevated rounded w-1/2" />
          <div className="h-4 bg-surface-elevated rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (error || content === null) {
    return (
      <div className="rounded-lg border border-surface-border bg-surface-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-neon-cyan shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <span className="text-sm text-text-muted">No se pudo cargar {filename || "el archivo"}</span>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neon-cyan text-sm hover:underline shrink-0"
        >
          Descargar
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-surface-border bg-surface-card overflow-hidden">
      <div className="px-4 py-3 border-b border-surface-border bg-surface-elevated flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <span className="text-sm font-medium text-text-primary">{filename || "Markdown"}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-text-muted hover:text-neon-cyan transition-colors"
          >
            {expanded ? "Colapsar" : "Expandir"}
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon-cyan text-xs hover:underline"
          >
            Descargar
          </a>
        </div>
      </div>
      <div
        className={`p-6 overflow-y-auto transition-all duration-300 ${expanded ? "max-h-none" : "max-h-96"}`}
      >
        <div
          className="prose prose-invert max-w-none
                     prose-headings:font-display prose-headings:text-text-primary
                     prose-p:text-text-secondary prose-a:text-neon-cyan
                     prose-strong:text-text-primary prose-code:text-neon-cyan
                     prose-pre:bg-surface-secondary prose-pre:border prose-pre:border-surface-border
                     [&_p]:leading-relaxed [&_p]:mb-4
                     [&_h1]:text-2xl [&_h1]:mt-6 [&_h1]:mb-4
                     [&_h2]:text-xl [&_h2]:mt-6 [&_h2]:mb-3
                     [&_h3]:text-lg [&_h3]:mt-4 [&_h3]:mb-2
                     [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
                     [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
                     [&_li]:mb-1 [&_li]:text-text-secondary
                     [&_table]:border-collapse [&_table]:w-full
                     [&_th]:border [&_th]:border-surface-border [&_th]:px-3 [&_th]:py-2 [&_th]:bg-surface-elevated [&_th]:text-left [&_th]:text-text-primary
                     [&_td]:border [&_td]:border-surface-border [&_td]:px-3 [&_td]:py-2 [&_td]:text-text-secondary
                     [&_blockquote]:border-l-2 [&_blockquote]:border-neon-cyan/50 [&_blockquote]:pl-4 [&_blockquote]:text-text-muted
                     [&_hr]:border-surface-border
                     [&_img]:rounded-lg [&_img]:max-w-full"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
      {!expanded && content.split("\n").length > 20 && (
        <div className="px-4 py-2 border-t border-surface-border bg-surface-elevated text-center">
          <button
            onClick={() => setExpanded(true)}
            className="text-xs text-neon-cyan hover:underline"
          >
            Ver contenido completo
          </button>
        </div>
      )}
    </div>
  );
}

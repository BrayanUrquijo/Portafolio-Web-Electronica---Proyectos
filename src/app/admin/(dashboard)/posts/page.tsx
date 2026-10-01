"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { PreviewOverlay } from "@/components/posts/PreviewOverlay";
import { formatDate } from "@/lib/utils";
import type { Post, Comment } from "@/lib/data/types";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewPost, setPreviewPost] = useState<Post | null>(null);
  const [commentsPostId, setCommentsPostId] = useState<string | null>(null);
  const [commentsPostTitle, setCommentsPostTitle] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/api/posts?all=true")
      .then((r) => r.json())
      .then((data) => {
        const loaded = data.data || [];
        setPosts(loaded);
        setLoading(false);
        loaded.forEach((post: Post) => {
          fetch(`/api/posts/${post.id}/comments`)
            .then((r) => r.json())
            .then((d) => {
              setCommentCounts((prev) => ({ ...prev, [post.id]: (d.data || []).length }));
            });
        });
      });
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta publicación?")) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
    fetch(`/api/posts/${id}`, { method: "DELETE" }).catch(() => {});
  }

  async function openComments(post: Post) {
    setCommentsPostId(post.id);
    setCommentsPostTitle(post.title);
    setLoadingComments(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/comments`);
      const data = await res.json();
      setComments(data.data || []);
    } catch {
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  }

  async function handleDeleteComment(commentId: string) {
    if (!commentsPostId) return;
    if (!confirm("¿Eliminar este comentario?")) return;
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    setCommentCounts((prev) => ({
      ...prev,
      [commentsPostId]: Math.max(0, (prev[commentsPostId] || 1) - 1),
    }));
    try {
      await fetch(`/api/posts/${commentsPostId}/comments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });
    } catch {
      // silent
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-text-primary">Publicaciones</h1>
        <Link href="/admin/posts/nuevo">
          <Button>+ Nueva</Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-lg bg-surface-card animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          <p className="text-lg">No hay publicaciones</p>
          <Link href="/admin/posts/nuevo" className="text-neon-cyan text-sm mt-2 inline-block">
            Crea tu primera publicación
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between gap-4 p-4 rounded-lg
                         bg-surface-card border border-surface-border"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-text-primary truncate">{post.title}</h3>
                  {!post.published && <Badge variant="yellow">Borrador</Badge>}
                </div>
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <Badge variant="cyan">{post.category}</Badge>
                  <span>Sem. {post.semester}</span>
                  <span>{formatDate(post.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openComments(post)}
                  className="relative p-2 rounded-lg text-text-muted hover:text-neon-cyan hover:bg-surface-elevated transition-colors"
                  title="Comentarios"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                  </svg>
                  {(commentCounts[post.id] || 0) > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center
                                     rounded-full bg-neon-cyan text-[10px] font-bold text-bg-primary px-1">
                      {commentCounts[post.id]}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setPreviewPost(post)}
                  className="p-2 rounded-lg text-text-muted hover:text-neon-cyan hover:bg-surface-elevated transition-colors"
                  title="Vista previa"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <Link href={`/admin/posts/${post.id}`}>
                  <Button variant="ghost">Editar</Button>
                </Link>
                <Button variant="danger" onClick={() => handleDelete(post.id)}>
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {previewPost && (
        <PreviewOverlay
          open={!!previewPost}
          post={previewPost}
          onClose={() => setPreviewPost(null)}
        />
      )}

      <Modal
        open={!!commentsPostId}
        onClose={() => setCommentsPostId(null)}
        title="Comentarios"
      >
        <p className="text-xs text-text-muted mb-4 truncate">{commentsPostTitle}</p>
        {loadingComments ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 rounded-lg bg-surface-secondary animate-pulse" />
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-text-muted py-6 text-center">
            No hay comentarios en esta publicación.
          </p>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {[...comments].reverse().map((comment) => (
              <div
                key={comment.id}
                className="p-3 rounded-lg border border-surface-border bg-surface-secondary group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-neon-cyan">{comment.name}</span>
                      <time className="text-xs text-text-muted">{formatDate(comment.createdAt)}</time>
                    </div>
                    <p className="text-sm text-text-secondary whitespace-pre-wrap break-words">
                      {comment.text}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="shrink-0 p-1.5 rounded-lg text-text-muted hover:text-red-400
                               hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100"
                    title="Eliminar comentario"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </>
  );
}

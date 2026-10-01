"use client";

import { useEffect, useState, useRef } from "react";
import { formatDate } from "@/lib/utils";
import type { Comment } from "@/lib/data/types";

function getLikedPosts(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("liked-posts") || "[]");
  } catch {
    return [];
  }
}

function setLikedPosts(ids: string[]) {
  localStorage.setItem("liked-posts", JSON.stringify(ids));
}

export function PostInteractions({ postId }: { postId: string }) {
  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const viewRegistered = useRef(false);

  useEffect(() => {
    setLiked(getLikedPosts().includes(postId));

    fetch(`/api/posts/${postId}/view`)
      .then((r) => r.json())
      .then((data) => {
        if (data.data) {
          setViews(data.data.views);
          setLikes(data.data.likes);
        }
      });

    fetch(`/api/posts/${postId}/comments`)
      .then((r) => r.json())
      .then((data) => setComments(data.data || []));

    if (!viewRegistered.current) {
      viewRegistered.current = true;
      fetch(`/api/posts/${postId}/view`, { method: "POST" }).catch(() => {});
    }
  }, [postId]);

  async function handleLike() {
    const action = liked ? "unlike" : "like";
    const likedPosts = getLikedPosts();

    setLiked(!liked);
    setLikes((prev) => prev + (liked ? -1 : 1));

    if (action === "like") {
      setLikedPosts([...likedPosts, postId]);
    } else {
      setLikedPosts(likedPosts.filter((id) => id !== postId));
    }

    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.data) setLikes(data.data.likes);
    } catch {
      setLiked(liked);
      setLikes((prev) => prev + (liked ? 1 : -1));
    }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, text }),
      });
      const data = await res.json();
      if (data.data) {
        setComments(data.data);
        setText("");
        setName("");
      }
    } catch {
      // silent
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-10 space-y-8">
      <div className="flex items-center gap-6 py-4 border-t border-b border-surface-border">
        <div className="flex items-center gap-2 text-text-muted">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm">{views}</span>
        </div>

        <button
          onClick={handleLike}
          className="flex items-center gap-2 group transition-colors"
        >
          <svg
            className={`w-5 h-5 transition-colors ${
              liked ? "fill-red-500 text-red-500" : "text-text-muted group-hover:text-red-400"
            }`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            fill={liked ? "currentColor" : "none"}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <span className={`text-sm transition-colors ${liked ? "text-red-500" : "text-text-muted group-hover:text-red-400"}`}>
            {likes}
          </span>
        </button>

        <div className="flex items-center gap-2 text-text-muted">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
          </svg>
          <span className="text-sm">{comments.length}</span>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="font-display text-lg font-bold text-text-primary">
          Comentarios
        </h3>

        <form onSubmit={handleComment} className="space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre (opcional)"
            className="w-full px-3 py-2 rounded-lg text-sm bg-surface-secondary border border-surface-border
                       text-text-primary placeholder:text-text-muted
                       focus:outline-none focus:border-neon-cyan focus:glow-sm transition-all duration-200"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe un comentario..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg text-sm bg-surface-secondary border border-surface-border
                       text-text-primary placeholder:text-text-muted resize-none
                       focus:outline-none focus:border-neon-cyan focus:glow-sm transition-all duration-200"
          />
          <button
            type="submit"
            disabled={!text.trim() || sending}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-neon-cyan/10 text-neon-cyan
                       border border-neon-cyan/30 hover:bg-neon-cyan/20
                       disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {sending ? "Enviando..." : "Comentar"}
          </button>
        </form>

        {comments.length === 0 ? (
          <p className="text-sm text-text-muted py-4">
            No hay comentarios aún. Sé el primero en comentar.
          </p>
        ) : (
          <div className="space-y-4">
            {[...comments].reverse().map((comment) => (
              <div
                key={comment.id}
                className="p-4 rounded-lg border border-surface-border bg-surface-card"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-neon-cyan">
                    {comment.name}
                  </span>
                  <time className="text-xs text-text-muted">
                    {formatDate(comment.createdAt)}
                  </time>
                </div>
                <p className="text-sm text-text-secondary whitespace-pre-wrap">
                  {comment.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

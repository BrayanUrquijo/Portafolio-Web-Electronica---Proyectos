"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/lib/data/types";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts?all=true")
      .then((r) => r.json())
      .then((data) => {
        setPosts(data.data || []);
        setLoading(false);
      });
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta publicación?")) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
    fetch(`/api/posts/${id}`, { method: "DELETE" }).catch(() => {});
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
    </>
  );
}

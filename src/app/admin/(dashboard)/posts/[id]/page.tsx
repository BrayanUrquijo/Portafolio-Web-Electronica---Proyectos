"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PostForm } from "@/components/posts/PostForm";
import type { Post } from "@/lib/data/types";

export default function EditPostPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setPost(data.data);
        setLoading(false);
      });
  }, [params.id]);

  return (
    <>
      <h1 className="font-display text-2xl font-bold text-text-primary mb-6">
        Editar Publicación
      </h1>
      {loading ? (
        <div className="space-y-4">
          <div className="h-10 rounded-lg bg-surface-card animate-pulse" />
          <div className="h-10 rounded-lg bg-surface-card animate-pulse" />
          <div className="h-40 rounded-lg bg-surface-card animate-pulse" />
        </div>
      ) : post ? (
        <PostForm post={post} />
      ) : (
        <p className="text-text-muted">Publicación no encontrada</p>
      )}
    </>
  );
}

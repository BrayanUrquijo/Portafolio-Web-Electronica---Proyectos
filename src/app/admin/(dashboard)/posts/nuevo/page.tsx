"use client";

import { PostForm } from "@/components/posts/PostForm";

export default function NewPostPage() {
  return (
    <>
      <h1 className="font-display text-2xl font-bold text-text-primary mb-6">
        Nueva Publicación
      </h1>
      <PostForm />
    </>
  );
}

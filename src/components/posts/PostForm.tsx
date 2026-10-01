"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { FileUploader } from "@/components/media/FileUploader";
import { PreviewOverlay } from "@/components/posts/PreviewOverlay";
import { POST_CATEGORIES } from "@/lib/data/types";
import type { Post, PostMedia } from "@/lib/data/types";

interface PostFormProps {
  post?: Post;
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const isEditing = !!post;
  const wasPublished = post?.published ?? false;

  const [title, setTitle] = useState(post?.title || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState(post?.content || "");
  const [category, setCategory] = useState(post?.category || "proyecto");
  const [semester, setSemester] = useState(post?.semester || 1);
  const [tags, setTags] = useState(post?.tags.join(", ") || "");
  const [media, setMedia] = useState<PostMedia[]>(post?.media || []);
  const [coverImage, setCoverImage] = useState<PostMedia | undefined>(post?.coverImage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPreview, setShowPreview] = useState(false);
  const [previewPost, setPreviewPost] = useState<Post | null>(null);
  const [savedPostId, setSavedPostId] = useState<string | undefined>(post?.id);
  const [publishLoading, setPublishLoading] = useState(false);

  function handleFileUploaded(url: string, file: File) {
    let type: PostMedia["type"];
    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      type = "pdf";
    } else if (file.type === "text/markdown" || file.name.endsWith(".md")) {
      type = "markdown";
    } else if (file.type.startsWith("video/")) {
      type = "video";
    } else {
      type = "image";
    }
    const newMedia: PostMedia = {
      type,
      url,
      publicId: "",
      alt: file.name,
      filename: file.name,
    };
    setMedia((prev) => [...prev, newMedia]);
    if (!coverImage && type === "image") setCoverImage(newMedia);
  }

  function removeMedia(index: number) {
    const updated = media.filter((_, i) => i !== index);
    setMedia(updated);
    if (coverImage === media[index]) {
      setCoverImage(updated.find((m) => m.type === "image") || undefined);
    }
  }

  async function handleSaveAndPreview(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("El título es obligatorio");
      return;
    }
    setLoading(true);
    setError("");

    const body = {
      title,
      excerpt,
      content,
      category,
      semester,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      published: wasPublished,
      media,
      coverImage,
    };

    try {
      const url = savedPostId ? `/api/posts/${savedPostId}` : "/api/posts";
      const method = savedPostId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        const saved = data.data;
        setSavedPostId(saved.id);
        setPreviewPost(saved);
        setShowPreview(true);
      } else {
        setError("Error al guardar");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish() {
    if (!previewPost) return;
    setPublishLoading(true);
    try {
      const res = await fetch(`/api/posts/${previewPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: true }),
      });
      if (res.ok) {
        router.push("/admin/posts");
        router.refresh();
      } else {
        setError("Error al publicar");
        setShowPreview(false);
      }
    } catch {
      setError("Error de conexión");
      setShowPreview(false);
    } finally {
      setPublishLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSaveAndPreview} className="space-y-6 max-w-3xl">
        <Input
          id="title"
          label="Título"
          placeholder="Nombre del proyecto o práctica"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={error && !title.trim() ? error : ""}
        />

        <Input
          id="excerpt"
          label="Resumen breve"
          placeholder="Una línea describiendo el trabajo"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-text-secondary">
            Contenido
          </label>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Escribe la descripción de tu proyecto, puedes dar formato con la barra de herramientas..."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1">
            <label htmlFor="category" className="block text-sm font-medium text-text-secondary">
              Categoría
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Post["category"])}
              className="w-full px-3 py-2 rounded-lg text-sm bg-surface-secondary border border-surface-border
                         text-text-primary focus:outline-none focus:border-neon-cyan focus:glow-sm"
            >
              {POST_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <Input
            id="semester"
            label="Semestre"
            type="number"
            min={1}
            max={12}
            value={semester}
            onChange={(e) => setSemester(parseInt(e.target.value) || 1)}
          />

          <Input
            id="tags"
            label="Tags (separados por coma)"
            placeholder="arduino, pcb, sensor"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-text-secondary">
            Archivos de la galería
          </label>
          <FileUploader
            onUpload={handleFileUploaded}
            label="Subir archivos desde tu computador"
          />
          {media.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-3">
              {media.map((m, i) => (
                <div key={i} className="relative rounded-lg border border-surface-border overflow-hidden">
                  {m.type === "image" ? (
                    <Image src={m.url} alt={m.alt || ""} width={400} height={128} className="w-full h-32 object-cover" />
                  ) : (
                    <div className="w-full h-32 bg-surface-elevated flex items-center justify-center">
                      <div className="text-center">
                        {m.type === "pdf" ? (
                          <svg className="w-8 h-8 mx-auto text-red-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                        ) : m.type === "markdown" ? (
                          <svg className="w-8 h-8 mx-auto text-neon-cyan mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                        ) : (
                          <svg className="w-8 h-8 mx-auto text-text-muted mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                          </svg>
                        )}
                        <p className="text-xs text-text-muted truncate px-2">{m.filename || m.alt || m.type.toUpperCase()}</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-1 right-1 flex gap-1">
                    {m.type === "image" && coverImage !== m && (
                      <button
                        type="button"
                        onClick={() => setCoverImage(m)}
                        className="w-6 h-6 rounded bg-neon-cyan/80 text-white text-xs
                                   flex items-center justify-center hover:bg-neon-cyan"
                        title="Usar como portada"
                      >
                        ★
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(i)}
                      className="w-6 h-6 rounded bg-red-500/80 text-white text-xs
                                 flex items-center justify-center hover:bg-red-500"
                    >
                      ×
                    </button>
                  </div>
                  {coverImage === m && (
                    <div className="absolute bottom-0 left-0 right-0 bg-neon-cyan/90 text-xs text-center py-0.5 text-white font-medium">
                      Portada
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex gap-3">
          <Button type="submit" isLoading={loading}>
            Guardar y Previsualizar
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </form>

      {previewPost && (
        <PreviewOverlay
          open={showPreview}
          post={previewPost}
          onClose={() => setShowPreview(false)}
          onPublish={!wasPublished ? handlePublish : undefined}
          publishLoading={publishLoading}
        />
      )}
    </>
  );
}

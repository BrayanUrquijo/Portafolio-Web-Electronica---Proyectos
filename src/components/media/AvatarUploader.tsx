"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface AvatarUploaderProps {
  currentUrl: string;
  name: string;
  onUpload: (url: string) => void;
}

export function AvatarUploader({ currentUrl, name, onUpload }: AvatarUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (data.success && data.data?.url) {
        setPreview(data.data.url);
        onUpload(data.data.url);
      }
    } catch {
      setPreview(currentUrl);
    } finally {
      setUploading(false);
    }
  }

  const initial = name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-neon-cyan glow-cyan">
        {preview ? (
          <Image
            src={preview}
            alt={name}
            width={112}
            height={112}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-surface-elevated flex items-center justify-center">
            <span className="text-3xl font-display font-bold text-neon-cyan">
              {initial}
            </span>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <svg className="animate-spin w-6 h-6 text-neon-cyan" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="text-sm text-neon-cyan hover:text-neon-cyan/80 transition-colors
                   disabled:opacity-50 flex items-center gap-1.5"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {uploading ? "Subiendo..." : "Cambiar foto"}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

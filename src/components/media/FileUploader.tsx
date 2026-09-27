"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onUpload: (url: string, file: File) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  className?: string;
}

export function FileUploader({
  onUpload,
  accept = "image/*,video/*",
  multiple = true,
  label = "Subir archivos",
  className,
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (data.success && data.data?.url) {
      return data.data.url as string;
    }
    throw new Error(data.error || "Error al subir");
  }

  async function handleFiles(files: FileList | File[]) {
    setUploading(true);
    for (const file of Array.from(files)) {
      try {
        const url = await uploadFile(file);
        onUpload(url, file);
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }
    setUploading(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }

  return (
    <div className={className}>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200",
          dragOver
            ? "border-neon-cyan bg-neon-cyan/5"
            : "border-surface-border hover:border-neon-cyan/50 hover:bg-surface-elevated/50"
        )}
      >
        <div className="space-y-2">
          <svg className="w-8 h-8 mx-auto text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p className="text-sm text-text-secondary">
            {uploading ? "Subiendo..." : "Arrastra archivos aquí o haz click"}
          </p>
          <p className="text-xs text-text-muted">Imágenes y videos</p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      {!uploading && (
        <Button
          type="button"
          variant="ghost"
          onClick={() => inputRef.current?.click()}
          className="mt-2 w-full"
        >
          {label}
        </Button>
      )}

      {uploading && (
        <div className="mt-2 flex items-center justify-center gap-2 text-sm text-neon-cyan">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Subiendo...
        </div>
      )}
    </div>
  );
}

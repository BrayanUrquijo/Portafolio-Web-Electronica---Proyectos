"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PostDetail } from "./PostDetail";
import { Button } from "@/components/ui/Button";
import type { Post } from "@/lib/data/types";

interface PreviewOverlayProps {
  open: boolean;
  post: Post;
  onClose: () => void;
  onPublish?: () => void;
  publishLoading?: boolean;
  publishLabel?: string;
  subtitle?: string;
  onTogglePublish?: () => void;
  toggleLoading?: boolean;
}

export function PreviewOverlay({
  open,
  post,
  onClose,
  onPublish,
  publishLoading,
  publishLabel = "Publicar y salir",
  subtitle = "Se guarda como borrador",
  onTogglePublish,
  toggleLoading,
}: PreviewOverlayProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-surface-primary/98 overflow-y-auto"
        >
          <div className="sticky top-0 z-10 border-b border-neon-cyan/20 bg-surface-primary/80 backdrop-blur-md">
            <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-neon-cyan"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm font-medium text-neon-cyan">
                  Vista previa
                </span>
              </div>
              <div className="flex items-center gap-3">
                {onTogglePublish && (
                  <Button
                    variant={post.published ? "danger" : "secondary"}
                    onClick={onTogglePublish}
                    isLoading={toggleLoading}
                  >
                    {post.published ? "Ocultar al público" : "Hacer pública"}
                  </Button>
                )}
                {onPublish && (
                  <Button onClick={onPublish} isLoading={publishLoading}>
                    {publishLabel}
                  </Button>
                )}
                <Button variant="ghost" onClick={onClose}>
                  Salir
                </Button>
              </div>
            </div>
            {onPublish && subtitle && (
              <p className="text-center text-xs text-text-muted pb-2">
                {subtitle}
              </p>
            )}
          </div>

          <div className="px-4 py-8">
            <PostDetail post={post} isPreview />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

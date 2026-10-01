"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface LightboxImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface LightboxProps {
  images: LightboxImage[];
  index: number;
  open: boolean;
  onClose: () => void;
  enableZoom?: boolean;
}

export function Lightbox({ images, index, open, onClose, enableZoom = true }: LightboxProps) {
  const [current, setCurrent] = useState(index);
  const [zoomed, setZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setCurrent(index);
    setZoomed(false);
    setPosition({ x: 0, y: 0 });
  }, [index, open]);

  const goTo = useCallback(
    (dir: number) => {
      setZoomed(false);
      setPosition({ x: 0, y: 0 });
      setCurrent((prev) => {
        const next = prev + dir;
        if (next < 0) return images.length - 1;
        if (next >= images.length) return 0;
        return next;
      });
    },
    [images.length]
  );

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goTo(-1);
      if (e.key === "ArrowRight") goTo(1);
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, goTo]);

  function toggleZoom(e: React.MouseEvent) {
    if (!enableZoom) return;
    e.stopPropagation();
    if (zoomed) {
      setZoomed(false);
      setPosition({ x: 0, y: 0 });
    } else {
      setZoomed(true);
    }
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (!zoomed) return;
    dragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    posStart.current = { ...position };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    setPosition({
      x: posStart.current.x + (e.clientX - dragStart.current.x),
      y: posStart.current.y + (e.clientY - dragStart.current.y),
    });
  }

  function handlePointerUp() {
    dragging.current = false;
  }

  if (!images.length) return null;
  const img = images[current];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goTo(-1); }}
                className="absolute left-4 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goTo(1); }}
                className="absolute right-4 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {current + 1} / {images.length}
            </div>
          )}

          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative max-w-[90vw] max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
            style={{
              cursor: enableZoom ? (zoomed ? "grab" : "zoom-in") : "default",
            }}
          >
            <div
              onClick={toggleZoom}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              style={{
                transform: zoomed
                  ? `scale(2) translate(${position.x / 2}px, ${position.y / 2}px)`
                  : "scale(1)",
                transition: dragging.current ? "none" : "transform 0.3s ease",
                cursor: zoomed ? "grab" : enableZoom ? "zoom-in" : "default",
              }}
            >
              <Image
                src={img.url}
                alt={img.alt || ""}
                width={img.width || 1200}
                height={img.height || 900}
                className="max-h-[85vh] w-auto h-auto object-contain rounded-lg select-none"
                draggable={false}
                priority
              />
            </div>
          </motion.div>

          {enableZoom && (
            <div className="absolute bottom-4 right-4 text-white/40 text-xs">
              {zoomed ? "Click para alejar · Arrastra para mover" : "Click para acercar"}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

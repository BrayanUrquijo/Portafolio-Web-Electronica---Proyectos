"use client";

import { CldImage } from "next-cloudinary";

interface OptimizedImageProps {
  publicId: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export function OptimizedImage({
  publicId,
  alt,
  width,
  height,
  className,
}: OptimizedImageProps) {
  if (!publicId) return null;

  return (
    <CldImage
      src={publicId}
      alt={alt}
      width={width}
      height={height}
      className={className}
      crop="fill"
      gravity="auto"
      quality="auto"
      format="auto"
    />
  );
}

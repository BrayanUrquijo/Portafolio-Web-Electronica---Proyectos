"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/Button";
import type { PostMedia } from "@/lib/data/types";

interface CloudinaryUploaderProps {
  onUpload: (media: PostMedia) => void;
  label?: string;
}

interface CloudinaryResult {
  info: {
    secure_url: string;
    public_id: string;
    resource_type: string;
    width: number;
    height: number;
    original_filename: string;
  };
}

export function CloudinaryUploader({ onUpload, label = "Subir Archivo" }: CloudinaryUploaderProps) {
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!uploadPreset) {
    return (
      <p className="text-xs text-text-muted">
        Cloudinary no configurado. Usa URLs directas o configura NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET en .env.local
      </p>
    );
  }

  return (
    <CldUploadWidget
      uploadPreset={uploadPreset}
      options={{
        sources: ["local", "url", "camera"],
        multiple: true,
        maxFiles: 10,
        resourceType: "auto",
      }}
      onSuccess={(result: unknown) => {
        const r = result as CloudinaryResult;
        const media: PostMedia = {
          type: r.info.resource_type === "video" ? "video" : "image",
          url: r.info.secure_url,
          publicId: r.info.public_id,
          alt: r.info.original_filename,
          width: r.info.width,
          height: r.info.height,
        };
        onUpload(media);
      }}
    >
      {({ open }) => (
        <Button type="button" variant="secondary" onClick={() => open()}>
          {label}
        </Button>
      )}
    </CldUploadWidget>
  );
}
